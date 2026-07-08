---
name: aiblackhole-director
description: Use when Codex needs to help users create, deploy, open, use, explain, test, troubleshoot, or customize local AI Blackhole Studio panorama director sessions, including bundled local deployment, local image import, panorama image viewing, flat image director mode, local static server startup, character placement, occluders, objects, screenshots, shortcuts, and user workflow guidance.
---

# AI Blackhole Director

Use this skill to help users work with local AI Blackhole Studio panorama director sessions.

## Entry Point

The default workflow is local:

1. Use `scripts/local_import.py` to copy a local image into a temporary local director session.
2. Start a local static server.
3. Open the generated `http://127.0.0.1:<port>/panorama-viewer.html?image=...` URL.

The skill includes the director package at `assets/panorama-director-deploy-v1.2.zip`. If no `--web-dir` is supplied, the helper can extract and use this bundled package.

Do not use `https://aiblackhole.net/panorama-viewer` as the default path for this skill. The public site can remain a diagnostic or sharing reference, but local deployment is the primary mode.

## Core Workflow

1. If the user gives a local image path, read `references/local-import.md` and run `scripts/local_import.py`.
2. Open the helper output URL in the browser when browser control is available, or give the user the URL when it is not.
3. Confirm the page loaded and `document.body` has the `panorama-loaded` class when browser control is available.
4. Identify the user's next task:
   - use the director
   - learn a feature
   - troubleshoot a local loading or browser issue
   - customize or package the local director files
5. For feature guidance, read `references/feature-guide.md`.
6. For local server, asset, image, route, or browser issues, read `references/troubleshooting.md`.
7. Keep instructions practical and user-facing. Prefer the local helper for automatic image opening.

## Local Image Import

When the user gives a local image path and wants it opened automatically, use:

```bash
python <skill-dir>/scripts/local_import.py "<image-path>" --open
```

When the user only wants to deploy/open the local director without an image, use:

```bash
python <skill-dir>/scripts/local_import.py --open
```

Pass `--web-dir` only when the user explicitly wants to use a custom director web folder.

Use the helper output URL to open the local session. Explain that the image is copied into a temporary local web session and is not uploaded to any public website.

## Browser Checks

When browser control is available, verify:

1. The generated local URL loads.
2. The uploaded/imported image name appears in the file metadata area.
3. The empty upload state is hidden after loading.
4. `document.body.dataset.viewMode` is `panorama` for panorama images or `flat` for normal images.
5. The main interactions work: add character, add object, add occluder, transform selection, hide/show sidebar, save screenshot.

## Optional Public Reference

The historical public URL is:

https://aiblackhole.net/panorama-viewer

Do not use it for automatic local file import. Public webpages cannot read arbitrary local file paths; use the local helper instead.

## Troubleshooting Order

For local sessions, check:

1. The local server process is running.
2. The generated `imports/<image>` URL returns HTTP 200.
3. `panorama-viewer.html` and `panorama-director.js` are present in the local web folder.
4. The port is not occupied by an old session.
5. Browser console/network errors if the image still fails to load.

## Do Not

- Do not force-upload local files into the public site.
- Do not use the public website as the default path for this skill.
- Do not modify a live deployment without explicit user approval.
- Do not assume local loading errors are caused by the app before checking server process, port, route, asset path, and browser console basics.
