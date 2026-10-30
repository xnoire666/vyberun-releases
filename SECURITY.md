# Security policy

## Reporting a vulnerability

Please do not report security problems in public issues, discussions or pull requests.

Report them privately through GitHub instead:

1. Open the repository's **Security** tab.
2. Choose **Report a vulnerability**.
3. Describe the problem, how to reproduce it, and what an attacker could do with it.

You will get an answer as soon as possible. Once a fix is released, the report can be made public, with credit to you if you wish.

## Supported versions

vyberun is in alpha. Security fixes go into the latest release only, so please check that the problem still exists there before reporting it.

## What is in scope

vyberun runs terminals, connects to servers and works with AI agents, so these areas matter most:

- **Commands built from untrusted text.** Output from a server, a terminal or a file should never be able to run a command on your computer, for example through a crafted shell prompt or a file name.
- **The local connections** between vyberun, its session host and its Claude helper. Other programs and other Windows users should not be able to read your tabs or type into them.
- **Saved passwords.** A server password should only ever be typed into that server's own sign-in prompt, and never be written to disk in plain text or to the log.
- **Reading other tabs.** An agent should only read another tab after you allow it, and always ask for a production server.
- **Extensions and skills.** Installing one should never write outside its own folder, and a changed or replaced extension should be asked about again before it runs.

Problems that need someone to already control your Windows account (for example to change vyberun's files directly) are generally out of scope.
