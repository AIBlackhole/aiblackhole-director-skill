#!/usr/bin/env python3
"""Create a local AI Blackhole Director session for a local image."""

from __future__ import annotations

import argparse
import json
import posixpath
import shutil
import socket
import subprocess
import sys
import time
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote


REQUIRED_FILES = ("panorama-viewer.html", "panorama-director.js")
DEVTOOLS_PROBE_PATH = "/.well-known/appspecific/com.chrome.devtools.json"


class DirectorRequestHandler(SimpleHTTPRequestHandler):
    imports_dir: Path | None = None
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
    }

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] == DEVTOOLS_PROBE_PATH:
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def do_HEAD(self) -> None:
        if self.path.split("?", 1)[0] == DEVTOOLS_PROBE_PATH:
            self.send_response(204)
            self.end_headers()
            return
        super().do_HEAD()

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, path: str) -> str:
        route = path.split("?", 1)[0].split("#", 1)[0]
        if self.imports_dir and (route == "/imports" or route.startswith("/imports/")):
            relative = route[len("/imports") :].lstrip("/")
            clean = posixpath.normpath(unquote(relative))
            parts = [part for part in clean.split("/") if part and part not in (".", "..")]
            resolved = self.imports_dir.joinpath(*parts).resolve()
            try:
                resolved.relative_to(self.imports_dir.resolve())
            except ValueError:
                return str(self.imports_dir / "__invalid__")
            return str(resolved)
        return super().translate_path(path)


def candidate_web_dirs(cwd: Path) -> list[Path]:
    return [
        cwd / "output" / "panorama-director-v1.2" / "web",
        cwd / "output",
        cwd,
    ]


def is_web_dir(path: Path) -> bool:
    return path.is_dir() and all((path / name).is_file() for name in REQUIRED_FILES)


def find_web_dir(root: Path) -> Path | None:
    if is_web_dir(root):
        return root
    for path in root.rglob("panorama-viewer.html"):
        candidate = path.parent
        if is_web_dir(candidate):
            return candidate
    return None


def bundled_assets_dir() -> Path | None:
    skill_dir = Path(__file__).resolve().parents[1]
    candidate = skill_dir / "assets"
    bundled_web_dir = find_web_dir(candidate)
    return bundled_web_dir.resolve() if bundled_web_dir else None


def resolve_web_dir(cwd: Path, explicit: str | None) -> tuple[Path, str]:
    if explicit:
        path = Path(explicit).expanduser().resolve()
        if not is_web_dir(path):
            raise SystemExit(f"Web directory is missing required files: {path}")
        return path, "explicit-web-dir"

    for path in candidate_web_dirs(cwd):
        if is_web_dir(path):
            return path.resolve(), "workspace-web-dir"

    bundled_web_dir = bundled_assets_dir()
    if bundled_web_dir:
        return bundled_web_dir, "bundled-assets"

    checked = "\n".join(str(path) for path in candidate_web_dirs(cwd))
    raise SystemExit(
        "Could not find a local director web directory or bundled assets. Pass --web-dir "
        "with a folder that contains panorama-viewer.html and panorama-director.js.\nChecked:\n"
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


def imported_name(source: Path) -> str:
    suffix = source.suffix.lower() or ".png"
    stamp = time.strftime("%Y%m%d-%H%M%S")
    return f"imported-image-{stamp}{suffix}"


def serve_forever(web_dir: Path, imports_dir: Path | None, host: str, port: int) -> None:
    handler_class = type(
        "SessionDirectorRequestHandler",
        (DirectorRequestHandler,),
        {"imports_dir": imports_dir.resolve() if imports_dir else None},
    )
    handler = partial(handler_class, directory=str(web_dir))
    server = ThreadingHTTPServer((host, port), handler)
    try:
        server.serve_forever()
    finally:
        server.server_close()


def start_server(web_dir: Path, imports_dir: Path | None, port: int, logs_dir: Path) -> subprocess.Popen:
    logs_dir.mkdir(parents=True, exist_ok=True)
    stdout_path = logs_dir / f"aiblackhole-director-local-{port}.stdout.log"
    stderr_path = logs_dir / f"aiblackhole-director-local-{port}.stderr.log"
    stdout = stdout_path.open("a", encoding="utf-8")
    stderr = stderr_path.open("a", encoding="utf-8")
    return subprocess.Popen(
        [
            sys.executable,
            str(Path(__file__).resolve()),
            "--serve",
            "--serve-web-dir",
            str(web_dir),
            "--port",
            str(port),
        ]
        + (["--serve-imports-dir", str(imports_dir)] if imports_dir else []),
        cwd=str(Path.cwd()),
        stdout=stdout,
        stderr=stderr,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Open a local image in a local AI Blackhole Director session."
    )
    parser.add_argument("image", nargs="?", help="Optional local image file to import.")
    parser.add_argument(
        "--web-dir",
        help="Folder containing panorama-viewer.html and panorama-director.js. "
        "Defaults to common Project01 output folders, then assets/web in this skill.",
    )
    parser.add_argument("--port", type=int, default=8766, help="Preferred local port.")
    parser.add_argument(
        "--session-root",
        help="Directory for generated local sessions. Defaults to output/local-import-sessions.",
    )
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the URL in the system default browser. Skills should omit this and open the printed URL with the agent browser.",
    )
    parser.add_argument("--serve", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--serve-web-dir", help=argparse.SUPPRESS)
    parser.add_argument("--serve-imports-dir", help=argparse.SUPPRESS)
    parser.add_argument("--host", default="127.0.0.1", help=argparse.SUPPRESS)
    args = parser.parse_args()

    cwd = Path.cwd()
    if args.serve:
        if not args.serve_web_dir:
            raise SystemExit("--serve-web-dir is required in server mode")
        web_dir = Path(args.serve_web_dir).expanduser().resolve()
        if not is_web_dir(web_dir):
            raise SystemExit(f"Web directory is missing required files: {web_dir}")
        imports_dir = (
            Path(args.serve_imports_dir).expanduser().resolve()
            if args.serve_imports_dir
            else None
        )
        serve_forever(web_dir, imports_dir, args.host, args.port)
        return 0

    image = Path(args.image).expanduser().resolve() if args.image else None
    if image and not image.is_file():
        raise SystemExit(f"Image does not exist: {image}")

    session_root = (
        Path(args.session_root).expanduser().resolve()
        if args.session_root
        else (cwd / "output" / "local-import-sessions").resolve()
    )
    web_source, source_kind = resolve_web_dir(cwd, args.web_dir)

    imported_image = None
    image_name = None
    session_dir = None
    imports_dir = None
    if image:
        session_root.mkdir(parents=True, exist_ok=True)
        session_dir = session_root / time.strftime("session-%Y%m%d-%H%M%S")
        imports_dir = session_dir / "imports"
        imports_dir.mkdir(parents=True, exist_ok=True)
        image_name = imported_name(image)
        imported_image = imports_dir / image_name
        shutil.copy2(image, imported_image)

    port = reserve_port(args.port)
    logs_dir = cwd / "logs"
    process = start_server(web_source, imports_dir, port, logs_dir)
    time.sleep(0.6)
    if process.poll() is not None:
        raise SystemExit(f"Local server failed to start on port {port}")

    image_url = f"imports/{image_name}" if image_name else ""
    url = (
        f"http://127.0.0.1:{port}/panorama-viewer.html?image={image_url}"
        if image_url
        else f"http://127.0.0.1:{port}/panorama-viewer.html"
    )
    pid_path = logs_dir / f"aiblackhole-director-local-{port}.pid"
    pid_path.write_text(str(process.pid), encoding="utf-8")

    result = {
        "url": url,
        "pid": process.pid,
        "port": port,
        "source": source_kind,
        "web_dir": str(web_source),
        "session_dir": str(session_dir) if session_dir else None,
        "imports_dir": str(imports_dir) if imports_dir else None,
        "imported_image": str(imported_image) if imported_image else None,
        "stop_hint": f"Stop-Process -Id {process.pid}",
    }

    if args.open:
        webbrowser.open(url)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
