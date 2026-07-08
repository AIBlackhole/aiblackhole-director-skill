# AI Blackhole Director For Claude Code

This repository contains a Codex skill, but Claude Code can still use the project by following this file.

## Purpose

Help the user open local panorama or flat images in a local AI Blackhole Studio director session.

Do not try to upload local files into `https://aiblackhole.net/panorama-viewer`. Browser security prevents public webpages from reading arbitrary local paths. Use the local import helper instead.

## Main Command

Run the helper script:

```bash
python aiblackhole-director/scripts/local_import.py "<image-path>" --web-dir "<director-web-dir>" --open
```

Example on Windows:

```bash
python aiblackhole-director/scripts/local_import.py "C:/Users/Haku/Pictures/panorama.png" --web-dir "C:/Users/Haku/Documents/Project01/output/panorama-director-v1.2/web" --open
```

The helper will:

1. Copy the image into a generated local director session.
2. Start a local static server.
3. Print a local URL like:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

4. Open the URL when `--open` is provided.

## Required Director Web Directory

The `--web-dir` folder must contain:

```text
panorama-viewer.html
panorama-director.js
vendor/
```

If `--web-dir` is not provided, the helper searches common folders relative to the current working directory:

```text
output/panorama-director-v1.2/web
output
.
```

## Verification

After opening the generated local URL, check:

- the page title contains `720`
- the file metadata shows the imported image name
- the empty upload state is hidden
- `document.body` has the `panorama-loaded` class
- `document.body.dataset.viewMode` is `panorama` or `flat`

## Troubleshooting

If the page opens but the image is not loaded:

1. Request the generated local URL from the helper output.
2. Confirm the copied image exists under the generated `web/imports/` folder.
3. Open the image URL directly, such as:

```text
http://127.0.0.1:8766/imports/imported-image.png
```

4. If it returns 404, stop old local Python server processes or rerun the helper so it can choose a free port.
5. Check that the selected `--web-dir` has the required director files.

## Notes

- This workflow does not upload the user's image to any public website.
- The local server process ID is printed as `pid` in the helper output.
- Stop a server on Windows with:

```powershell
Stop-Process -Id <pid>
```
