#!/usr/bin/env python3
"""Create a local AI Blackhole Director session for a local image."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


REQUIRED_FILES = ("panorama-viewer.html", "panorama-director.js")


def candidate_web_dirs(cwd: Path) -> list[Path]:
    return [
        cwd / "output" / "panorama-director-v1.2" / "web",
        cwd / "output",
        cwd,
    ]


def is_web_dir(path: Path) -> bool:
    return path.is_dir() and all((path / name).is_file() for name in REQUIRED_FILES)


def resolve_web_dir(cwd: Path, explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit).expanduser().resolve()
        if not is_web_dir(path):
            raise SystemExit(f"Web directory is missing required files: {path}")
        return path

    for path in candidate_web_dirs(cwd):
        if is_web_dir(path):
            return path.resolve()

    checked = "\n".join(str(path) for path in candidate_web_dirs(cwd))
    raise SystemExit(
        "Could not find a local director web directory. Pass --web-dir with a folder "
        "that contains panorama-viewer.html and panorama-director.js.\nChecked:\n"
        f"{checked}"
    )


def reserve_port(start: int) -> int:
    for port in range(start, start + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            probe.settimeout(0.2)
            if probe.connect_ex(("127.0.0.1", port)) == 0:
                continue
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise SystemExit(f"No free port found from {start} to {start + 49}")


def copy_web_tree(source: Path, destination: Path) -> None:
    ignore = shutil.ignore_patterns("__pycache__", ".git", ".DS_Store")
    shutil.copytree(source, destination, ignore=ignore)


def imported_name(source: Path) -> str:
    suffix = source.suffix.lower() or ".png"
    stamp = time.strftime("%Y%m%d-%H%M%S")
    return f"imported-image-{stamp}{suffix}"


def start_server(web_dir: Path, port: int, logs_dir: Path) -> subprocess.Popen:
    logs_dir.mkdir(parents=True, exist_ok=True)
    stdout_path = logs_dir / f"aiblackhole-director-local-{port}.stdout.log"
    stderr_path = logs_dir / f"aiblackhole-director-local-{port}.stderr.log"
    stdout = stdout_path.open("a", encoding="utf-8")
    stderr = stderr_path.open("a", encoding="utf-8")
    return subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=str(web_dir),
        stdout=stdout,
        stderr=stderr,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Open a local image in a local AI Blackhole Director session."
    )
    parser.add_argument("image", help="Local image file to import.")
    parser.add_argument(
        "--web-dir",
        help="Folder containing panorama-viewer.html and panorama-director.js. "
        "Defaults to common Project01 output folders.",
    )
    parser.add_argument("--port", type=int, default=8766, help="Preferred local port.")
    parser.add_argument(
        "--session-root",
        help="Directory for generated local sessions. Defaults to output/local-import-sessions.",
    )
    parser.add_argument("--open", action="store_true", help="Open the URL in the default browser.")
    args = parser.parse_args()

    cwd = Path.cwd()
    image = Path(args.image).expanduser().resolve()
    if not image.is_file():
        raise SystemExit(f"Image does not exist: {image}")

    web_source = resolve_web_dir(cwd, args.web_dir)
    session_root = (
        Path(args.session_root).expanduser().resolve()
        if args.session_root
        else (cwd / "output" / "local-import-sessions").resolve()
    )
    session_root.mkdir(parents=True, exist_ok=True)

    session_dir = session_root / time.strftime("session-%Y%m%d-%H%M%S")
    web_dir = session_dir / "web"
    copy_web_tree(web_source, web_dir)

    imports_dir = web_dir / "imports"
    imports_dir.mkdir(parents=True, exist_ok=True)
    image_name = imported_name(image)
    imported_image = imports_dir / image_name
    shutil.copy2(image, imported_image)

    port = reserve_port(args.port)
    logs_dir = cwd / "logs"
    process = start_server(web_dir, port, logs_dir)
    time.sleep(0.6)
    if process.poll() is not None:
        raise SystemExit(f"Local server failed to start on port {port}")

    image_url = f"imports/{image_name}"
    url = f"http://127.0.0.1:{port}/panorama-viewer.html?image={image_url}"
    pid_path = logs_dir / f"aiblackhole-director-local-{port}.pid"
    pid_path.write_text(str(process.pid), encoding="utf-8")

    result = {
        "url": url,
        "pid": process.pid,
        "port": port,
        "web_dir": str(web_dir),
        "imported_image": str(imported_image),
        "stop_hint": f"Stop-Process -Id {process.pid}",
    }

    if args.open:
        webbrowser.open(url)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
