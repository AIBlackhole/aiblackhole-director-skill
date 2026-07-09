720 panorama director deployment package v1.3

Files:
- web/index.html: AI Blackhole Studio entry page
- web/panorama-viewer.html: the 720 panorama director page
- web/panorama-director.js: director-stage logic
- web/favicon.ico, web/favicon-192.png, web/apple-touch-icon.png: page icons
- web/ai-blackhole-studio-reference.png, web/vendor/gsap/: entry page visual and animation runtime
- web/vendor/three/: local Three.js runtime and TransformControls
- server/panorama_server.py: local static server
- start-windows.bat: Windows launcher
- start-macos-linux.sh: macOS/Linux launcher

Usage:
1. Unzip the package.
2. Start the local server:
   - Windows: double-click start-windows.bat
   - macOS/Linux: run sh start-macos-linux.sh
3. Visit http://127.0.0.1:8795/index.html
4. Click the panorama director card, then upload your own 720/equirectangular panorama image or a regular still image in the page.

Director features:
- Add multiple character actors.
- Automatically uses panorama mode for 2:1 equirectangular images and fixed-frame mode for regular images.
- Toggle the director panel from the top toolbar or with the H shortcut when it covers the frame.
- Switch the interface between Chinese and English with the En/中 button beside fullscreen.
- Add a crowd array.
- Set actor color, opacity, size, XYZ position, and XYZ rotation.
- Use translate/rotate/scale transform handles.
- Use shortcuts: S saves the current view, F toggles fullscreen, R resets the camera, and H toggles the director panel.
- Use undo/redo from the History section or shortcuts: Ctrl+Z, Ctrl+Y, and Ctrl+Shift+Z.
- Use Ctrl/Command-click or Shift-click in the object list for multi-select.
- Batch transform, duplicate, and delete the current multi-selection as one group.
- Show XYZ center axes for every selected object so multi-selection is visible in the canvas.
- Add regular cube and sphere objects, separate from occluders.
- Creation limits: up to 100 total objects, 40 characters, and 80 occluders. Crowd arrays add up to 6 characters and use remaining capacity when near the limit.
- Feature 6: Toggle character skeleton visualization for checking joints and poses.
- Apply pose presets: standing, bowing, sitting, crouching, kneeling, supine, prone, walking, pointing.
- Fine tune elbow, knee, head tilt, waist side bend, and thigh-out joints for character posing.
- Use a built-in segmented character with visible front-side facial markers.
- Hide character body parts.
- Add occluder planes, circles, cubes, and spheres for manual foreground blocking.
- Stretch cube occluders with the transform scale axes when you need rectangular blockers.
- Export PNG screenshots.
- Save and load scene JSON, including v1.3 multi-selection and skeleton-display states.

Notes:
- Python is required for the local server.
- Use the local server instead of opening the HTML file directly, because the director uses local ES modules.
- The package does not include sample panorama images, so it stays portable.
- The local server returns 204 for Chrome DevTools' automatic workspace probe to avoid noisy 404 logs.
