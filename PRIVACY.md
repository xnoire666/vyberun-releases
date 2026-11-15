# Privacy policy

Effective: 16 November 2026

This policy describes how vyberun handles your information. It covers the vyberun program from the Microsoft Store and from https://github.com/xnoire666/vyberun-releases, and its updates. "We" means the author of vyberun.

## In short

vyberun runs on your computer. It doesn't collect your data, it doesn't send anything to us, and it has no account or sign-in of its own. There is no tracking, no analytics and no advertising.

## What vyberun keeps on your computer

vyberun saves what it needs to work, on your computer only:

- Your settings, spaces, cards, servers, snippets and the list of open tabs, in `%LOCALAPPDATA%\vyberun`.
- Two log files in the same folder (`vyberun.log` and `session-host.log`). They record what vyberun did, such as tabs started or a server connected, to help with problems. They stay on your computer. You can read or delete them.
- Passwords you choose to remember for a server. These are kept by Windows Credential Manager, encrypted by Windows for your account, never in vyberun's files.
- Small copies of images you pick as card icons.

None of this is sent to us. We can't see it.

## What vyberun reads

To show what runs in your tabs, vyberun reads the text in those tabs and the folders they're in. If you use Claude Code in a tab, vyberun reads Claude Code's own files on your computer (in `%USERPROFILE%\.claude`) to show its progress and its agents. This reading happens on your computer and nothing is sent anywhere.

When you ask it to, in Help, vyberun adds its tools and shortcuts to Claude Code's settings in the same folder.

## Other programs and services

vyberun starts programs you choose: shells such as PowerShell, Command Prompt and Git Bash, ssh or PuTTY's plink to reach your servers, and tools such as Claude Code. Those programs and the servers and services they connect to handle your data under their own terms and privacy policies, not this one. For example, Claude Code sends your prompts to its provider.

Extensions are programs written by others. vyberun asks you before an extension runs for the first time. An extension handles data under its own author's terms.

## Microsoft Store

If you install vyberun from the Microsoft Store, Microsoft may collect information about the installation and its updates under Microsoft's privacy statement. We may see the summary reports the Store gives developers, such as numbers of installs or crashes. They don't identify you.

## Children

vyberun is a tool for developers. It doesn't knowingly collect information from anyone, including children.

## Removing your data

Uninstalling vyberun doesn't delete your settings, so they're there if you install it again. To remove everything:

1. Delete the folder `%LOCALAPPDATA%\vyberun`.
2. In Windows Credential Manager, under Windows Credentials, remove the entries whose names start with "vyberun server".

## Changes

If this policy changes, the new version will be published at the same address with a new effective date.

## Contact

For questions about this policy, open an issue at https://github.com/xnoire666/vyberun-releases/issues.
