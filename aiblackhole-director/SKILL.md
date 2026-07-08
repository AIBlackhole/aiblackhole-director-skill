---
name: aiblackhole-director
description: Use when Codex needs to help users open, use, explain, test, troubleshoot, locally import images into, or customize the AI Blackhole Studio panorama director at https://aiblackhole.net/panorama-viewer, including panorama image viewing, flat image director mode, local image sessions, character placement, occluders, objects, screenshots, shortcuts, Cloudflare Pages/domain troubleshooting, and user workflow guidance.
---

# AI Blackhole Director

Use this skill to help users work with the online AI Blackhole Studio panorama director.

## Entry Point

The online director is available at:

https://aiblackhole.net/panorama-viewer

Prefer the public website. Do not assume users need local installation unless they explicitly ask for source edits, local hosting, custom deployment, or offline packaging.

## Core Workflow

1. Open the director URL, or ask the user to open it when browser control is unavailable.
2. Identify the user's task:
   - use the director
   - learn a feature
   - troubleshoot a loading or browser issue
   - customize or redeploy the site
3. For feature guidance, read `references/feature-guide.md`.
4. For automatic local image import, read `references/local-import.md` and use `scripts/local_import.py`.
5. For loading, domain, DNS, Cloudflare Pages, route, or HTTPS issues, read `references/troubleshooting.md`.
6. Keep instructions practical and user-facing. Prefer steps that work on the online site unless a local file must be opened automatically.

## Browser Checks

When browser control is available, verify:

1. `https://aiblackhole.net/panorama-viewer` loads.
2. The upload state appears before an image is loaded.
3. The director tools appear after loading an image.
4. The main interactions work: add character, add object, add occluder, transform selection, hide/show sidebar, save screenshot.

## Public URL Fallback

If the custom domain fails, test the Cloudflare Pages fallback if known:

https://panorama-director.pages.dev/panorama-viewer

Only use fallback URLs for diagnosis unless the user asks to switch links.

## Local Image Import

When the user gives a local image path and wants it opened automatically, use the local import helper instead of trying to force-upload into the public site:

```bash
python <skill-dir>/scripts/local_import.py "<image-path>" --web-dir "<director-web-dir>" --open
```

Use the helper output URL to open the local session. Explain that the image is copied into a temporary local web session and is not uploaded to the public website.

## Do Not

- Do not package the web app into the skill by default.
- Do not tell users to install the director locally unless they ask for local deployment.
- Do not modify a live deployment without explicit user approval.
- Do not assume errors are caused by the app before checking route, DNS, certificate, cache, and browser console basics.
