---
name: aiblackhole-director
description: 'Use when Codex needs to help users create, open, use, explain, test, or customize local AI Blackhole Studio panorama director sessions, including local image import, panorama image viewing, flat image director mode, local static server startup, character placement, occluders, objects, screenshots, shortcuts, and user workflow guidance.'
---

# AI Blackhole Director

Use this skill to help users work with local AI Blackhole Studio panorama director sessions.

## Entry Point

The default workflow is local:

1. Use `scripts/local_import.py` to serve the director from `assets/web/`.
2. If an image is provided, copy only that image into a temporary local `imports/` folder.
3. Start a local static server.
4. Open the generated `http://127.0.0.1:<port>/panorama-viewer.html?image=...` URL with the agent's built-in browser when available.

If no `--web-dir` is supplied, the helper uses the default local director files.

Do not use `https://aiblackhole.net/panorama-viewer` as the default path for this skill. The public site can remain a diagnostic or sharing reference, but local deployment is the primary mode.

## Core Workflow

1. If the user gives a local image path, read `references/local-import.md` and run `scripts/local_import.py`.
2. Open the helper output URL in Codex's built-in browser when browser control is available, or give the user the URL when it is not.
3. Confirm the page loaded and `document.body` has the `panorama-loaded` class when browser control is available.
4. Identify the user's next task:
   - use the director
   - learn a feature
   - customize or package the local director files
5. For feature guidance, read `references/feature-guide.md`.
6. For local server, asset, image, route, or browser issues, read `references/troubleshooting.md`.
7. Keep instructions practical and user-facing. Prefer the local helper for automatic image opening.

## 使用说明

当用户要求查看使用说明时，只显示下面两条示例：

```text
打开导演台
打开这张图片：C:\...\image.png
```

不要在简短使用说明里加入截图、角色、遮挡物或图片加载排查示例。

## 导演台使用说明

当前导演台应使用本地地址打开，例如：

```text
http://127.0.0.1:<port>/panorama-viewer.html
```

它的默认流程是：把图片复制到本地临时会话里，启动本地服务，再打开导演台页面。图片不会上传到公开网站。

主要能做这些事：

- 上传全景图或普通图片
- 添加角色
- 添加立方体、球体等物体
- 添加遮挡物，用来模拟人物或物体被前景遮住
- 移动、旋转、缩放选中的角色或物体
- 批量选择多个对象并一起调整
- 锁定或解锁对象
- 隐藏或显示右侧导演面板
- 切换中文/英文界面
- 保存当前画面为 PNG 截图

常用快捷键：

- `H`：隐藏/显示导演面板
- `F`：全屏
- `R`：重置镜头
- `S`：保存当前视图

推荐使用流程：

1. 上传一张全景图或普通图片。
2. 添加角色和物体。
3. 调整位置、大小、旋转和姿势。
4. 用遮挡物做前后层次。
5. 调整镜头构图。
6. 隐藏侧栏预览干净画面。
7. 保存截图。

## Local Image Import

When the user gives a local image path and wants it opened automatically, use:

```bash
python <skill-dir>/scripts/local_import.py "<image-path>"
```

When the user only wants to deploy/open the local director without an image, use:

```bash
python <skill-dir>/scripts/local_import.py
```

Do not pass `--open` during normal skill use. Parse the helper JSON, then open `url` with Codex's built-in browser when available. Use `--open` only when the user explicitly asks to open the system default browser.

Pass `--web-dir` only when the user explicitly wants to use a custom director web folder.

Use the helper output URL to open the local session. Explain that the director page is served directly from `assets/web/`, while imported images are copied into a temporary local `imports/` folder and are not uploaded to any public website.

The Codex skill stores the director web files unpacked under `assets/web/`. Do not create or expect a nested zip package inside this skill.

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
3. `panorama-viewer.html` and `panorama-director.js` are present in the reported `web_dir`.
4. The port is not occupied by an old session.
5. Browser console/network errors if the image still fails to load.

## Do Not

- Do not force-upload local files into the public site.
- Do not use the public website as the default path for this skill.
- Do not modify a live deployment without explicit user approval.
- Do not assume local loading errors are caused by the app before checking server process, port, route, asset path, and browser console basics.
