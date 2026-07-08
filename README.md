# AI Blackhole Director Skill

This repository contains the `aiblackhole-director` Codex skill for helping users open, use, test, and troubleshoot the online AI Blackhole Studio panorama director.

Online director:

https://aiblackhole.net/panorama-viewer

## Install

Copy the `aiblackhole-director` folder into your Codex skills directory.

Windows:

```text
C:\Users\<your-name>\.codex\skills\aiblackhole-director
```

macOS / Linux:

```text
~/.codex/skills/aiblackhole-director
```

Restart Codex after copying the folder.

## Use

Ask Codex:

```text
Use $aiblackhole-director to help me open and use the panorama director.
```

or:

```text
Use $aiblackhole-director to troubleshoot why the online director does not load.
```

## What This Skill Covers

- Opening the online panorama director
- Explaining director-stage workflows
- Guiding users through panorama and flat-image modes
- Using characters, objects, occluders, screenshots, shortcuts, and batch selection
- Troubleshooting domain, Cloudflare Pages, browser, and loading issues
- Creating a local import session for local image files when browser upload automation is blocked

## Local Image Import

For local files, use the helper script:

```text
python aiblackhole-director/scripts/local_import.py "C:/path/to/image.png" --web-dir "C:/path/to/director/web" --open
```

The helper copies the image into a local director session and opens a URL like:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

This does not upload the image to the public website.
