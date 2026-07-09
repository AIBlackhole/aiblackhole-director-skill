# Local Import

Use this reference when the user wants Codex to open a local image in the director without manually using the browser file picker.

## Why This Exists

Browsers do not allow a webpage to read arbitrary local file paths. This skill avoids browser file-picker limits by running a local server that serves the director web files and exposes the selected image as a local `imports/` URL.

For automatic local image import:

1. Serve the director directly from the resolved web directory, usually `assets/web/`.
2. Copy only the user's image into a temporary local session under `imports/`.
3. Start a local static server.
4. Open `panorama-viewer.html?image=imports/<image-file>`.

The Codex skill includes unpacked director web files:

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

Do not pass `--open` during normal skill use. The helper should print JSON, then the agent should open the returned `url` with its built-in browser when available.

If `--web-dir` is omitted, the script searches common project folders:

- `output/panorama-director-v1.4/web`
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
- `web_dir`: director web folder being served
- `session_dir`: temporary image session folder, when an image was provided
- `imports_dir`: temporary imports folder, when an image was provided
- `imported_image`: copied image path
- `stop_hint`: command to stop the server

## Important Boundary

This does not upload the user's image to any public website. The director web files stay in place, and only the imported image is copied into a temporary local folder for serving by local URL.
