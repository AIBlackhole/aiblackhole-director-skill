# AI Blackhole Director Skill

This repository contains local AI Blackhole Studio director skills for Codex and Claude Code.

The skill is designed for local use: it copies a local image into a temporary local director session, starts a local static server, and opens a URL such as:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

The Codex skill is:

```text
aiblackhole-director/
```

The Claude Code skill is:

```text
aiblackhole-director-cc/
```

## Codex Install

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

## Claude Code Install

Copy the `aiblackhole-director-cc` folder into your Claude Code skills directory.

macOS / Linux:

```text
~/.claude/skills/aiblackhole-director-cc
```

Windows:

```text
C:\Users\<your-name>\.claude\skills\aiblackhole-director-cc
```

Restart Claude Code after copying the folder.

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

Ask Claude Code:

```text
Use /aiblackhole-director-cc to open the director.
```

or:

```text
Use /aiblackhole-director-cc to open this local panorama image in the director.
```

## What This Skill Covers

- Deploying the bundled director package locally
- Creating local director sessions
- Importing local image files without browser file-picker automation
- Explaining director-stage workflows
- Guiding users through panorama and flat-image modes
- Using characters, objects, occluders, screenshots, shortcuts, and batch selection

## Local Image Import

For Codex local files, use the helper script:

```text
python aiblackhole-director/scripts/local_import.py "C:/path/to/image.png" --open
```

For Claude Code local files, use:

```text
python aiblackhole-director-cc/scripts/local_import.py "C:/path/to/image.png" --open
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
