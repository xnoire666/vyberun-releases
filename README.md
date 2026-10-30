<p align="center">
  <img src="Assets/vyberun-logo.png" width="96" alt="vyberun logo">
</p>

<h1 align="center">vyberun</h1>

<p align="center"><b>The agentic terminal workspace for Windows.</b></p>

<p align="center">
  Projects, terminals and servers in one place, with AI agents that work side by side.
</p>

<p align="center">
  <a href="https://github.com/xnoire666/vyberun-releases/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/xnoire666/vyberun-releases?include_prereleases&label=download"></a>
  <img alt="Status: alpha" src="https://img.shields.io/badge/status-alpha-orange">
  <img alt="Windows 10 and 11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?logo=windows&logoColor=white">
  <img alt="Renderer" src="https://img.shields.io/badge/renderer-Windows%20Terminal-2AF0E0">
</p>

---

## Overview

vyberun is a terminal workspace for Windows. Each project and server gets a card in the sidebar, and each card keeps its own terminal tabs. Click a card and its terminals are there as you left them, still running, even after vyberun has been closed or restarted.

It is built for working with AI coding agents such as Claude Code. Several agents can run side by side in their own tabs, each with a role, aware of one another, and you can see at a glance which one is working, which one needs you, and which one has finished.

vyberun is a native Windows application. The terminal is drawn by the same renderer as Windows Terminal, and nothing needs to be installed on your servers.

## Key features

| Feature | What it does |
|---|---|
| Spaces and cards | Organise projects, terminals and servers into spaces (for example, one per ticket). Each card keeps its own tabs. |
| Sessions that keep running | Tabs keep running when vyberun closes or restarts, and come back with their output. Server work can keep running on the server. |
| A team of AI agents | Give each tab a role (backend, frontend, QA). Agents know their teammates, hand work to each other and reply. |
| Agents read other tabs | An agent can read another tab, such as a server log or a failing build, when you ask it to. Read-only, with your permission. |
| Status at a glance | Every tab shows whether its agent is working, waiting for you, or finished while you were elsewhere. |
| Long screenshots | Capture a whole conversation, a long output or a server's history as one image, then annotate and share it. |
| Servers | Connect over SSH with a key, a password or a saved PuTTY session. Passwords are kept by Windows Credential Manager. |

## Typical uses

**One ticket, several agents.** The backend agent adds an API field and tells the frontend agent its exact shape. The frontend agent builds the screen against it, and the QA agent checks the result against the ticket. You review instead of relaying messages.

**Finding the cause of an error.** Your dev server's tab shows a stack trace. Ask the agent to read that tab, and it goes straight to the problem without any copy and paste.

**Several tasks at once.** While you review one agent's work, the sidebar shows which agent is waiting for an answer and which one has just finished.

**Sharing a result.** Capture a long error or a full answer as one image, highlight the important line, and paste it into the ticket or a chat.

**Long jobs on a server.** Start a job on a server, close the tab with *Leave it running*, shut down your PC, and rejoin it the next morning.

## Features in detail

### Workspace

- Every project, terminal and server is a card. Cards live in spaces: *General* holds new cards, and you can create your own spaces (New space…) and move cards between them.
- Filter the sidebar by recent work: the last hour, today, the last 7 days, or a date range. Cards can also be sorted by recent activity.
- Each tab shows when it was last used, and cards not used today are dimmed.
- Archive a space when its work is done. View ▸ Archived spaces… searches the archive and restores a space.
- Pin, colour and attach links to cards and spaces. A link icon next to the name opens them.
- Rearrange cards and spaces with Ctrl+drag. Search the sidebar from the box at the top.

### Projects

- Any folder can be a project. vyberun shows its type (Laravel, React, Node, .NET, Python…) and its git branch.
- Run a project's commands from its menu: npm scripts, artisan, dotnet and more.
- Open a project in your editor (VS Code, Cursor, PhpStorm…), in File Explorer or in a new terminal.
- Combine related folders, such as a backend and its frontend, into one card.

### Terminals

- Git Bash, PowerShell, Command Prompt or Ubuntu (WSL), chosen per tab.
- Split panes, zoom a pane, and move panes between tabs. A new pane opens in the current folder.
- Group tabs to show them side by side.
- Tabs keep running in the background when vyberun closes. Detach a tab to hide it without stopping it.
- Closing a tab, or choosing Stop everything when vyberun closes, first ends running programs the normal way (Ctrl+C), so nothing is cut off mid-write.
- Ctrl+click links and file paths to open them. Drop or paste files to insert their paths.
- Search a tab's whole history, jump between commands, and copy a single command's output.

### Servers

- One-click SSH connections using a key (.pem, .ppk, OpenSSH), a password, or a saved PuTTY session.
- Work can keep running on the server after you disconnect, using the server's own tmux. Nothing is installed.
- Splitting a server tab opens a new connection in the same folder.
- A server tab's full history can be brought into vyberun for searching and screenshots.
- Saved command snippets, with placeholders filled in each time.

### Claude Code and other agents

- Each tab shows the agent's state: working, waiting for you (a question or a permission request), or finished.
- Windows notifications when an agent needs you or a long task completes.
- Search a whole conversation, and capture long answers as one screenshot.
- Roles: give a tab a role from its menu. The role is shown on the tab and in the sidebar, and the agent is told its role and its teammates'.
- Saved agents (Settings ▸ Agents): each with its own instructions, Claude Code settings, a guard script that blocks unwanted commands, and skills. Start one on any card in one click.
- Handovers: choose whether agents pass work to each other only when asked, after suggesting it, on their own, or all the way to the end of a task.
- A loop guard stops agents that keep messaging each other without you.
- Move an agent's conversation to another tab or card.
- Works with Claude Code, and roles also work with other command-line agents such as Gemini CLI and Codex.

### General

- Search files and folders on your PC, and everything in vyberun, with Ctrl+Shift+P.
- Screenshots with annotation: pen, highlighter, boxes, circles and crop.
- Themes, from plain and minimal to glass and glow.
- Extensions can add their own spaces, cards and menus. The extension guide includes a step-by-step tutorial.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+Shift+P | Search everything |
| Ctrl+Shift+R | Recent cards |
| Ctrl+Shift+F | Find in the current tab |
| Ctrl+Shift+W / A / S / D | Split up / left / down / right |
| Alt+Arrow keys | Move between panes |
| Ctrl+Shift+Z | Zoom the current pane |
| Ctrl+Shift+X | Detach the current tab |
| Ctrl+Shift+G | Group the selected tabs |
| Ctrl+Shift+I | Screenshot of the selection |
| Ctrl+Shift+K | Long screenshot |
| Ctrl+Shift+B | Show or hide the sidebar |
| Ctrl+Shift+F5 | Restart vyberun |

## Download and install

1. Install the [.NET 10 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/10.0) (x64), once per PC. If it's missing, vyberun's first start offers the download.
2. Download the latest `vyberun-<version>-win-x64.zip` from [Releases](https://github.com/xnoire666/vyberun-releases/releases).
3. Unzip it anywhere, for example `C:\Tools`, and run `vyberun\vyberun.exe`.

No installer is needed. To update, close vyberun (*Keep running* is fine) and unzip the new version over the old one. Your settings, spaces and servers are kept in `%LOCALAPPDATA%\vyberun`, not in the program folder.

Releases are marked as pre-release while vyberun is in alpha. The builds are not signed yet, so Windows may show "Windows protected your PC". Choose **More info**, then **Run anyway**. Each release lists a SHA-256 checksum for its zip.

## Requirements

- Windows 10 (version 1809 or later) or Windows 11, 64-bit
- [.NET 10 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/10.0)
- Optional: Git for Windows (Git Bash tabs), WSL (Ubuntu tabs), PuTTY (saved PuTTY sessions), Claude Code (agent features)

## Extensions

vyberun can be extended with your own spaces, cards and menus. The [extension guide](docs/extension-guide.md) explains how, with a step-by-step tutorial.

## Feedback and support

- Found a bug or have an idea? [Open an issue](https://github.com/xnoire666/vyberun-releases/issues/new/choose).
- Found a security problem? Please report it privately, as described in [SECURITY.md](SECURITY.md).

This repository holds vyberun's releases, documentation and issue tracker. The source code is not public.

## License

vyberun is proprietary software. All rights reserved.

`Assets/conpty/` (ConPTY and OpenConsole) and `Assets/nativeterm/` (the Windows Terminal renderer) in each release are Microsoft's, from the [Windows Terminal](https://github.com/microsoft/terminal) project, under its MIT license. See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
