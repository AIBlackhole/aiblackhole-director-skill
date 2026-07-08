# Install And Use AI Blackhole Director

This repository works in three ways:

- Codex users can install `aiblackhole-director` as a Codex skill.
- Claude Code users can install `aiblackhole-director-cc` as a Claude Code skill.
- Claude Code and other agents can use the same bundled local director through the helper scripts.

The director web app is bundled in:

```text
aiblackhole-director/assets/panorama-director-deploy-v1.2.zip
```

No separate director download is required.

## Requirements

- Python 3
- A modern browser

## Quick Start

Windows:

```text
run-director-windows.bat "C:\path\to\panorama.png"
```

macOS / Linux:

```bash
chmod +x ./run-director-macos-linux.sh
./run-director-macos-linux.sh "/path/to/panorama.png"
```

Open the director without importing an image:

```text
run-director-windows.bat
```

```bash
./run-director-macos-linux.sh
```

The script creates a local session and opens a URL like:

```text
http://127.0.0.1:8766/panorama-viewer.html?image=imports/imported-image.png
```

## Codex Install

Copy this folder:

```text
aiblackhole-director
```

into your Codex skills directory.

Windows:

```text
C:\Users\<your-name>\.codex\skills\aiblackhole-director
```

macOS / Linux:

```text
~/.codex/skills/aiblackhole-director
```

Restart Codex.

Then ask:

```text
Use $aiblackhole-director to open this local panorama image.
```

## Claude Code Use

For skill installation, copy this folder:

```text
aiblackhole-director-cc
```

into your Claude Code skills directory.

macOS / Linux:

```text
~/.claude/skills/aiblackhole-director-cc
```

Windows:

```text
C:\Users\<your-name>\.claude\skills\aiblackhole-director-cc
```

Restart Claude Code.

Then ask:

```text
Use /aiblackhole-director-cc to open this local panorama image.
```

You can also open this repository in Claude Code. It should read `CLAUDE.md`.

You can also ask Claude Code:

```text
Read CLAUDE.md and use the local import helper to open this panorama image.
```

## Direct Helper Use

Import an image:

```bash
python aiblackhole-director/scripts/local_import.py "C:/path/to/image.png" --open
```

Claude Code skill helper:

```bash
python aiblackhole-director-cc/scripts/local_import.py "C:/path/to/image.png" --open
```

Deploy/open without an image:

```bash
python aiblackhole-director/scripts/local_import.py --open
```

For automation tests, omit browser opening:

```bash
python aiblackhole-director/scripts/local_import.py "C:/path/to/image.png"
```

## Stop A Local Session

The helper prints a process ID:

```json
{
  "pid": 12345,
  "stop_hint": "Stop-Process -Id 12345"
}
```

Windows:

```powershell
Stop-Process -Id 12345
```

macOS / Linux:

```bash
kill 12345
```

## Notes

- Local images are copied into a temporary local session.
- Images are not uploaded to any public website.
- If a port is already in use, the helper automatically tries the next available port.
