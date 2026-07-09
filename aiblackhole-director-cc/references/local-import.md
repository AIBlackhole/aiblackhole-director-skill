# Local Import

Use this reference when the user wants Codex to open a local image in the director without manually using the browser file picker.

## Why This Exists

Browsers do not allow a webpage to read arbitrary local file paths. This skill avoids browser file-picker limits by creating a local static session that serves the selected image as a local URL.

For automatic local image import, create a local director session:

1. Copy the director web files into a temporary local session.
2. Copy the user's image into that session under `imports/`.
3. Start a local static server.
4. Open `panorama-viewer.html?image=imports/<image-file>`.

The Claude Code skill includes unpacked director web files:

```text
assets/web/
```

## Script

Run:

```bash
python <skill-dir>/scripts/local_import.py "C:/path/to/image.png"
```

To deploy/open the local director without importing an image:

```bash
python <skill-dir>/scripts/local_import.py
```

Do not pass `--open` during normal skill use. The helper should print JSON, then the agent should open the returned `url` with its built-in browser or preview capability when available.

If `--web-dir` is omitted, the script searches common project folders:

- `output/panorama-director-v1.2/web`
- `output`
- current directory

If none are found, it uses the unpacked director files under `assets/web/`.

The web directory must contain:

- `panorama-viewer.html`
- `panorama-director.js`

## Expected Output

The script prints JSON with:

- `url`: local URL to open
- `pid`: local server process ID
- `web_dir`: generated session web folder
- `imported_image`: copied image path
- `stop_hint`: command to stop the server

## Important Boundary

This does not upload the user's image to any public website. It creates a local session that behaves like the director page and loads the copied image by local URL.
