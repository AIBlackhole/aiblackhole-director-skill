# Troubleshooting

Use this reference for local director session loading, route, static server, and browser issues.

## First Checks

Ask for:

- the generated local URL
- browser name and version if available
- device type
- screenshot of the error
- whether the local server process is still running

Local URLs usually look like:

```text
http://127.0.0.1:<port>/panorama-viewer.html?image=imports/<image-file>
```

## Common Issues

### Page does not open

Check:

1. The local Python server process is running.
2. The URL uses the same port printed by `scripts/local_import.py`.
3. The port is not occupied by an older local session.
4. The generated session `web` folder still exists.

### Image returns 404

Check:

1. The copied image exists under `web/imports/`.
2. The URL query uses `image=imports/<image-file>`.
3. The server is serving the same session folder that contains that import.
4. Stop older Python server processes if they are serving stale folders.

### 404 on `panorama-viewer.html`

Check that the chosen `--web-dir` contains:

- `panorama-viewer.html`
- `panorama-director.js`

### Assets fail to load

Check that these files are deployed together:

- `panorama-viewer.html`
- `panorama-director.js`
- favicon/logo assets
- `vendor/three/three.module.js`
- `vendor/three/addons/controls/TransformControls.js`
- favicon/logo assets

Use browser developer tools to inspect failed network requests.

### Upload or screenshot does not work

Check:

1. Browser permissions.
2. Console errors.
3. Whether the local image URL returns HTTP 200.
4. Whether the image file is very large or unsupported.

### UI appears but tools do not work

Check:

1. JavaScript console errors.
2. Whether `panorama-director.js` loaded successfully.
3. Browser WebGL support.
4. Browser extensions that may block scripts.

## Response Style

When helping non-technical users, avoid dumping diagnostics at once. Start with the generated local URL, whether the server process is running, and a screenshot, then narrow the issue step by step.
