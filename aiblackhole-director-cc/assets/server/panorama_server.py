from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


DEVTOOLS_PROBE_PATH = "/.well-known/appspecific/com.chrome.devtools.json"


class PanoramaRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".png": "image/png",
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


def find_web_root() -> Path:
    script_path = Path(__file__).resolve()
    candidates = [
        script_path.parents[1] / "web",
        script_path.parents[1] / "output",
        Path.cwd(),
    ]

    for candidate in candidates:
        if (candidate / "panorama-viewer.html").is_file():
            return candidate

    raise FileNotFoundError(
        "Could not find panorama-viewer.html. Keep this script next to the web folder "
        "from the deployment package, or run it from the directory containing the page."
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the 720 panorama viewer locally.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=8795, help="Port to bind. Default: 8795")
    args = parser.parse_args()

    web_root = find_web_root()
    handler = partial(PanoramaRequestHandler, directory=str(web_root))
    server = ThreadingHTTPServer((args.host, args.port), handler)

    url = f"http://{args.host}:{args.port}/panorama-viewer.html"
    print(f"Serving: {web_root}")
    print(f"Open:    {url}")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
