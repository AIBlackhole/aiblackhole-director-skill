# AI Blackhole Director Skill

This repository contains the `aiblackhole-director` Codex skill for helping users create, open, use, test, and troubleshoot local AI Blackhole Studio panorama director sessions.

The skill is designed for local use: it copies a local image into a temporary local director session, starts a local static server, and opens a URL such as:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

The director web app is bundled inside the skill:

```text
aiblackhole-director/assets/panorama-director-deploy-v1.2.zip
```

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

For general installation and startup instructions, see:

```text
INSTALL.md
```

Ask Codex:

```text
Use $aiblackhole-director to help me open and use the panorama director.
```

or:

```text
Use $aiblackhole-director to open this local panorama image in the director.
```

## What This Skill Covers

- Deploying the bundled director package locally
- Creating local director sessions
- Importing local image files without browser file-picker automation
- Explaining director-stage workflows
- Guiding users through panorama and flat-image modes
- Using characters, objects, occluders, screenshots, shortcuts, and batch selection
- Troubleshooting local static server, browser, asset, and loading issues

## Local Image Import

For local files, use the helper script:

```text
python aiblackhole-director/scripts/local_import.py "C:/path/to/image.png" --open
```

The helper copies the image into a local director session and opens a URL like:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

This does not upload the image to the public website.

To open the local director without importing an image:

```text
python aiblackhole-director/scripts/local_import.py --open
```

`--web-dir` is optional. If omitted, the helper first checks common local folders, then falls back to the bundled deployment package in `assets/`.

Windows users can also run:

```text
run-director-windows.bat "C:\path\to\panorama.png"
```

macOS / Linux users can run:

```bash
./run-director-macos-linux.sh "/path/to/panorama.png"
```
