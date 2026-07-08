---
name: aiblackhole-director-cc
description: "Use this skill in Claude Code to open and use local AI Blackhole Studio director sessions, including local image import, panorama image viewing, flat image director mode, local static server startup, character placement, occluders, objects, screenshots, shortcuts, and user workflow guidance."
---

# AI Blackhole Director For Claude Code

Use this skill when the user wants Claude Code to open or use the AI Blackhole Studio director locally.

## Entry Point

The default workflow is local:

1. Resolve the skill folder as the directory containing this `SKILL.md`.
2. Run `scripts/local_import.py` from this skill folder.
3. Open the generated local URL, usually:

```text
http://127.0.0.1:<port>/panorama-viewer.html
```

or, when an image is imported:

```text
http://127.0.0.1:<port>/panorama-viewer.html?image=imports/imported-image-YYYYMMDD-HHMMSS.png
```

Do not use `https://aiblackhole.net/panorama-viewer` as the default path for local files. Public webpages cannot read arbitrary local file paths. Use the local helper instead.

## 使用说明

当用户要求查看使用说明时，只显示下面两条示例：

```text
打开导演台
打开这张图片：C:\...\image.png
```

不要在简短使用说明里加入截图、角色、遮挡物或图片加载排查示例。

## Main Commands

When the user gives a local image path, run:

```bash
python "<skill-dir>/scripts/local_import.py" "<image-path>" --open
```

When the user only wants to open the director without importing an image, run:

```bash
python "<skill-dir>/scripts/local_import.py" --open
```

The helper copies the image into a temporary local web session, starts a local static server, and prints JSON containing:

- `url`: local director URL to open
- `pid`: local server process ID
- `port`: selected local port
- `web_dir`: generated local web folder
- `imported_image`: copied local image path when an image was provided
- `stop_hint`: command hint for stopping the local server

Explain that the file is copied into a local session and is not uploaded to any public website.

## Browser Checks

When browser control is available, verify:

1. The generated local URL loads.
2. The imported image name appears in the file metadata area when an image was provided.
3. The empty upload state is hidden after loading an image.
4. `document.body.dataset.viewMode` is `panorama` for panorama images or `flat` for normal images.
5. The main interactions work if the user asks to test them.

## Feature Guidance

For feature guidance, read `references/feature-guide.md`.

For local import details, read `references/local-import.md`.

For local server, asset, image, route, or browser issues, read `references/troubleshooting.md`.

## Do Not

- Do not force-upload local files into the public site.
- Do not use the public website as the default path for local file import.
- Do not modify a live deployment without explicit user approval.
- Do not assume local loading errors are caused by the app before checking server process, port, route, asset path, and browser console basics.
