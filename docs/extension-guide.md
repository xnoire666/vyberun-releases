# vyberun extension kit

Write extensions for **vyberun**: add your own spaces to vyberun's sidebar, with cards, buttons,
badges and menu entries, and run things in vyberun's terminal. vyberun itself only knows generic projects; an
extension teaches it about a kind of workspace (Docker Compose stacks, Laravel sites, ...).

The kit is this library, `Vyberun.Extensions` (namespace `Vyberun.Extensions`). Extension API version: **3**.

## ◆ The parts, and their names

vyberun's sidebar is made of **spaces** (a header, then its cards), and each **card** lists its open tabs under it.
Your extension adds spaces of its own, fills them with cards, and adds to the menus around them:

```text
 vyberun   File  View  Terminal  [Extensions]  Help
                                 +-------------------+
                                 | Manage extensions |
                                 | Docker          > |  <-- (12) your menu
                                 +-------------------+
 +- sidebar --------------------------+  +- terminal ------------------------+
 | Pulling images...  40%  ====----   |  | [ compose up ]   Git Bash         |  <-- (11) service tab
 |                    ^ (10) progress |  |                                   |
 | +--------------------------------+ |  | Container shop-db   Started       |
 | | v DOCKER STACKS  2      [+] [R]| |  | web-1 | listening on :8080        |
 | +--------------------------------+ |  +-----------------------------------+
 |   ^ (1) space        (2) buttons^  |
 |   o shop-stack  (running)   [...]  |  <-- (3) card  (4) light  (5) badge  (6) menu
 |   |  >_ compose up            2m   |  <-- (7) tab lines
 |   |  >_ Git Bash              1h   |
 |   o api-stack   (stopped)   [...]  |
 | +--------------------------------+ |
 | | v LARAVEL SITES                | |
 | +--------------------------------+ |
 |   No sites yet: + adds one.        |  <-- (8) empty message
 |                                    |
 | +--------------------------------+ |
 | | o Docker engine running        | |  <-- (9) footer
 | +--------------------------------+ |
 +------------------------------------+
```

| | Part | Added with |
|---|---|---|
| 1 | **Space** | `AddSection(ISidebarSection)` |
| 2 | **Header buttons** (`[R]`: refresh) | `HeaderButtons`, `Refresh` |
| 3 | **Card** | an `IProjectItem`, drawn by `CreateRowView` |
| 4 | **Status light** | vyberun's own: its tabs' activity |
| 5 | **Your badge** | part of your card's view |
| 6 | **⋯ menu** | `GetMenu` (vyberun adds its own entries too) |
| 7 | **Tab lines** | vyberun's own: the card's open tabs |
| 8 | **Empty message** | `EmptyMessage` |
| 9 | **Footer** | `CreateFooter` |
| 10 | **Progress area** | `Busy` |
| 11 | **Service tab** | `Terminals.RunService` |
| 12 | **Your menu** | `AddMenu` (under Extensions) |

4 and 7 are vyberun's: it draws them on every card. Everything else is yours.

The API kept its first names: a **space** is an `ISidebarSection` (added with `AddSection`), and a **card** is an
`IProjectItem`, drawn by `CreateRowView` (its ⋯ menu: `GetMenu`, `ShowRowMenu`). A card's status light and its tab lines
are vyberun's: it draws them on every card, from the card's tabs. Everything else in a card (its name, badges, details)
is your own view.

## ▶ The easiest way: build it with Claude Code

We recommend writing extensions with a coding agent such as **Claude Code**: you describe what you want, it
writes the C#, builds it and fixes the errors. You don't need to know C# or .NET to start.

1. In vyberun: **Extensions ▸ Manage extensions… ▸ New extension…**. Give it a name. vyberun creates a
   ready-to-build folder and opens a terminal there.
2. Type `claude` and describe your extension, for example:

   > Make this extension list my Docker Compose stacks (every folder under C:\src with a compose.yaml) as cards.
   > Each card's menu: Up, Down, Logs. Show a green dot on cards whose stack is running.

   (A whole example, step by step: the tutorial below, Ports.)

3. Claude builds it (`dotnet build` installs it by itself). Restart vyberun (**File ▸ Restart vyberun**) to load
   it, try it, and tell Claude what to change.

The folder has a **`CLAUDE.md`** (and an **`AGENTS.md`** that points other agents to it): the commands, where the API's
documentation is, the rules below and the common mistakes. The agent reads it before writing code, so what it
builds stays within the rules.

> [!IMPORTANT]
> You need the **.NET 10 SDK** to build (`dotnet --version` says 10.x): <https://dotnet.microsoft.com/download>.

## ★ Tutorial: your first extension, Ports

A complete example, start to finish, in about ten minutes: a **Ports** space that shows what's listening on which
port on your PC ("who's using port 3000?"), and lets you open it in the browser or stop it. It's useful on any PC,
needs no setup, and uses most of the parts in the picture above. You won't write any C#: you describe it, Claude
Code writes it.

### 1. Create it

**Extensions ▸ Manage extensions… ▸ New extension…**. Name: `Ports`. Leave the folder as it is
(`Documents\vyberun extensions`) and click **Create**. vyberun makes a ready-to-build folder and opens a terminal
tab in it.

### 2. Describe it to Claude

In that tab, type `claude`, then paste this (the copy button is at the code block's top right):

```text
Make this extension a "Ports" space in vyberun's sidebar: one card per TCP port that something is listening on, on this PC.
- Each card: the port number, the program's name (node.exe, httpd.exe…), and, when the program runs from inside one of my project folders, that folder's name. A green status dot.
- Header button ⟳: refresh. Also refresh by itself every 10 seconds.
- Empty message: "Nothing is listening right now."
- ⋯ menu per card: "Open in browser" (http://localhost:PORT), "Copy URL", "Open the program's folder", then a red "Stop process…" that asks for confirmation first, naming the program and port.
- Footer: "N ports in use · checked Xs ago".
- A "Ports" menu in the menu bar with "Refresh" and "Who's using port…?" (asks for a port number and selects its card, or says nobody is).
- Read-only except Stop. No admin rights needed: skip what Windows won't show without them.
- Follow the rules in CLAUDE.md.
```

Claude reads the folder's `CLAUDE.md` first (the rules, and where this guide and the API are), writes the code and
runs `dotnet build`, which installs the extension into vyberun by itself. A failed build: it reads the errors and
tries again.

### 3. Load it

**File ▸ Restart vyberun** (or Ctrl+Shift+F5). The **Ports** space is in the sidebar: one card per port.

### 4. Change it

> [!TIP]
> Tell Claude what you'd like different, let it build, restart vyberun again. Some to try:
>
> - *"Make the cards one line: port, program, project."*
> - *"For cards with a project, list the project's folder in Folders"*: those cards then get vyberun's own
>   **Open in VS Code / Open Folder / Open in Terminal** (the others, a port of svchost.exe, rightly don't).
> - *"Add Copy PID to the ⋯ menu."*
> - *"Show a badge on ports that are open to the network, not only to this PC."*

### 5. What Claude built, part by part

Match it to the picture at the top:

| In the sidebar | In the code |
|---|---|
| The **Ports** space, its ⟳ and its empty message | a class implementing `ISidebarSection`, added with `AddSection`; `HeaderButtons`, `EmptyMessage` |
| A **card** per port | an `IProjectItem` (its `Key` unique, for example `yourid.ports:3000`), drawn by `CreateRowView` |
| The card's **⋯ menu** | `GetMenu`: Open in browser, Copy URL, …, and Stop as an `IsDanger` entry |
| The **footer** | `CreateFooter` |
| The **Ports** menu in the menu bar | `AddMenu` |
| Refreshing | `Refresh`, and raising `ItemsChanged` when the list changed |

### 6. Put it away, or share it

- Hide its space: **Settings ▸ Sidebar ▸ Ports**. Turn it off altogether: **Extensions ▸ Manage extensions…**.
- Share it: zip its folder (with `extension.json`); someone else adds it with **Manage extensions… ▸ Add .zip…**.
  vyberun shows them who made it and asks before running it.

## § The rule: open for extension, closed for modification

> [!IMPORTANT]
> An extension **adds** to vyberun. It never **changes** vyberun. Everything below follows from that one rule.

> [!TIP]
> **Not sure an idea is allowed?** Ask Claude in your extension's folder before it writes anything. Its `CLAUDE.md`
> tells it where this guide is, so it can check the idea against the lists below and say which one it falls under (and,
> if it's not allowed, what you could do instead):
>
> ```text
> Is this allowed for a vyberun extension: <your idea>? Check it against the section "The rule: open for extension, closed for modification" in the extension guide (where CLAUDE.md says), say whether it is Allowed, Allowed but say so, Not allowed or Not possible yet, and why. If it is not allowed, suggest the closest way that is.
> ```

### ✔ Allowed

What the kit offers, and only that:

| You can | With |
|---|---|
| Add your own space to the sidebar: a header with your buttons, your cards, an empty message, a footer | `AddSection` and `ISidebarSection` |
| Draw your own cards (inside vyberun's card container, with its selection and hover) | `ISidebarSection.CreateRowView` |
| Add entries to your cards' ⋯ menu (submenus, checkmarks, red "danger" entries) | `ISidebarSection.GetMenu` |
| Add your own menu, under vyberun's **Extensions** menu | `AddMenu` |
| Run a long-lived command in a tab of its own (a server, a build, a watcher) | `Terminals.RunService` |
| Open a shell, or run a command in one of your cards' tabs | `Terminals.OpenShell`, `Terminals.RunInShell` |
| See which tabs are open and running; close the tabs inside a folder you're about to delete | `Terminals.Tabs`, `Terminals.CloseTabsIn` |
| Show progress in the sidebar's progress area | `Busy` |
| Know, change and show the selected card and its menu | `SelectedItem`, `Select`, `ShowRowMenu` |
| Stop your services gracefully when vyberun closes | `OnClosing` |
| Keep your own settings and files, write to vyberun's log | `DataDirectory`, `Log` |
| Open your own windows and dialogs (owned by vyberun's window) | `MainWindow` as their `Owner` |
| Use any .NET library inside your own code: web APIs, databases, files, programs | your own dependencies, in your extension's folder |

### ⚠ Allowed, but say so

> [!WARNING]
> These are fine, but users must know. Write them in your `extension.json`'s `description`, and ask in your own
> dialog before anything that can't be undone:

- Sending anything over the network (which server, and what for).
- Reading or writing files outside your `DataDirectory`.
- Starting programs (prefer `RunService` / `RunInShell`, so they run in a tab the user can see and stop).
- Deleting anything: ask first, and prefer the Recycle Bin.

### ✖ Not allowed

> [!CAUTION]
> Each of these breaks the one rule above. Don't, even when it would be easier.

- **Changing vyberun:** hiding, moving, restyling or replacing anything of vyberun's own (its menus, buttons,
  sidebar spaces, tabs, title bar, settings, shortcuts, theme). `MainWindow` is only for owning your dialogs:
  don't walk or change its contents, and don't change vyberun's application resources.
- **Reaching inside vyberun:** reflection into vyberun's types, or anything that isn't in `Vyberun.Extensions`.
- **Taking over input:** global keyboard or mouse hooks, or catching keys before vyberun does.
- **Typing into tabs you didn't start**, or reading what's in them.
- **Touching other extensions:** their code, their windows, their `DataDirectory`.
- **Touching vyberun's own files:** its settings, its log (other than through `Log`), its data folder outside
  your `DataDirectory`.
- **Collecting data quietly:** vyberun collects nothing about its users, and extensions mustn't either. No
  tracking, no analytics, no sending the user's data anywhere they didn't ask for.
- **Hiding work:** no background processes the user can't see or stop. Long-running work goes in a tab
  (`RunService`), or shows in `Busy`.

### ■ How the rules are kept

- **By the kit:** an extension only gets what `IVyberunHost` offers. Most of "not allowed" has no way in.
- **By the user:** vyberun asks before running an extension it hasn't seen, and the user can turn any extension
  off or remove it at any time (**Extensions ▸ Manage extensions…**).
- **Not yet checked by vyberun itself:** an extension is .NET code running with the user's rights, so vyberun
  can't stop every rule being broken today. An extension that breaks them may stop working with any vyberun
  update, and won't be listed or supported. Checks and per-extension permissions are planned.

### … Not possible yet

If your idea needs one of these, it can't be built as an extension today. Ask for it: vyberun adds new doors
when an idea needs one, and every extension can use them after that.

- Commands with keyboard shortcuts of their own
- Results in the title bar's search (`Ctrl+Shift+P`)
- Marks on tabs, and terminal events (a command finished, Claude waiting for you)
- A page in Settings or in Help
- Windows notifications through vyberun
- Themes
- Panels inside vyberun's window (only windows of your own today)

## ▣ How an extension is loaded

1. vyberun looks for extension folders in `<vyberun folder>\extensions\` and `%LOCALAPPDATA%\Vyberun\extensions\`.
2. Each extension folder has an `extension.json` and the extension's DLL (plus its own dependencies):

   ```json
   {
     "id": "acme.docker",
     "name": "Docker projects",
     "version": "1.0.0",
     "author": "Acme",
     "description": "Docker Compose stacks: start, stop, logs.",
     "apiVersion": 3,
     "assembly": "Acme.VyberunDocker.dll"
   }
   ```

3. The first time vyberun sees an extension it asks the user whether to enable it (an extension runs code with the
   user's rights). The answer is remembered in `%LOCALAPPDATA%\Vyberun\extensions.json`.
4. vyberun loads the DLL into an `AssemblyLoadContext` of its own: your dependencies can't clash with vyberun's
   or another extension's. `Vyberun.Extensions` and the .NET / WPF framework are shared with vyberun.
5. It creates the one public class implementing `IVyberunExtension` and calls `Initialize(host)` on the UI thread.

An extension's exceptions (in `Initialize`, while drawing cards, in menu actions, in your own event handlers)
are logged to `%LOCALAPPDATA%\Vyberun\vyberun.log` and shown to the user; vyberun keeps running.

## ▤ The project

**New extension…** writes this for you. By hand: the kit is **`Vyberun.Extensions.dll`** in vyberun's own folder
(where `vyberun.exe` is), with its documentation next to it (**`Vyberun.Extensions.xml`**, every member
explained). Reference it; don't ship it.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0-windows10.0.19041.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <EnableDynamicLoading>true</EnableDynamicLoading>
    <VyberunDir>C:\path\to\vyberun</VyberunDir>                                   <!-- where vyberun.exe is -->
    <InstallDir>$(LOCALAPPDATA)\Vyberun\extensions\acme.docker</InstallDir>   <!-- your extension's id -->
  </PropertyGroup>
  <ItemGroup>
    <!-- compile against the kit, but don't ship it: vyberun provides it -->
    <Reference Include="Vyberun.Extensions">
      <HintPath>$(VyberunDir)\Vyberun.Extensions.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <None Include="extension.json" CopyToOutputDirectory="PreserveNewest" />
  </ItemGroup>
  <!-- every build installs itself where vyberun loads it from -->
  <Target Name="InstallIntoVyberun" AfterTargets="Build">
    <ItemGroup>
      <ExtensionFiles Include="$(OutDir)**\*" Exclude="$(OutDir)Vyberun.Extensions.*" />
    </ItemGroup>
    <Copy SourceFiles="@(ExtensionFiles)" DestinationFiles="@(ExtensionFiles->'$(InstallDir)\%(RecursiveDir)%(Filename)%(Extension)')" SkipUnchangedFiles="true" />
  </Target>
</Project>
```

## ⚙ Build, install, test

1. **Build:** `dotnet build` in your extension's folder. Fix every error and warning.
2. **Install:** the build copies itself into `InstallDir` (your extensions folder). Without that step, copy the
   build output (without `Vyberun.Extensions.*`) into a folder under one of the extension folders above.
3. **Load:** restart vyberun (**File ▸ Restart vyberun**, or `Ctrl+Shift+F5`). The first time, vyberun asks
   whether to turn your extension on. vyberun loads an extension's code once, so restart after every build.
4. **Check:** **Extensions ▸ Manage extensions…** shows it, with any problem loading it. vyberun's log
   (`%LOCALAPPDATA%\Vyberun\vyberun.log`) has your `host.Log(…)` lines, prefixed with your id, and your errors
   with their stack traces.

## ✖ Common mistakes

- **Blocking the UI thread, or touching the UI from another one:** vyberun freezes, or WPF crashes. Do slow work
  (disk, network, processes) in `Task.Run` / `async`, then update the UI on its thread:
  `host.MainWindow.Dispatcher.Invoke(…)`.
- **Changing the cards without raising `ItemsChanged`:** replace the list, then raise it.
- **A card `Key` that isn't unique, or changes:** its terminal tabs get mixed up. Prefix it with your id.
- **Timers and loops left running after `Shutdown()`:** stop them there. Poll in seconds, not milliseconds.
- **Shipping `Vyberun.Extensions.dll`:** keep `<Private>false</Private>` on its reference.
- **Hard-coded colours:** use vyberun's resources (below) so your cards follow the user's theme.
- **Errors in menu actions:** catch what you can, and say what went wrong in plain words.

## ✎ A minimal extension

```csharp
using System.Windows;
using System.Windows.Controls;
using Vyberun.Extensions;

public sealed class DockerExtension : IVyberunExtension
{
    public void Initialize(IVyberunHost host) => host.AddSection(new StacksSection(host));
}

sealed record Stack(string Name, string Directory) : IProjectItem
{
    public string Key => "docker:" + Directory;          // unique: the row's terminal tabs are grouped by it
    public IReadOnlyList<ProjectFolder> Folders => [];   // [] = vyberun's Open in … use Directory
}

sealed class StacksSection(IVyberunHost host) : ISidebarSection
{
    private List<Stack> _stacks = [new("shop", @"C:\src\shop")];

    public string Title => "Docker";
    public IReadOnlyList<IProjectItem> Items => _stacks;
    public event Action? ItemsChanged;
    public string? EmptyMessage => _stacks.Count == 0 ? "No stacks found." : null;

    public FrameworkElement CreateRowView(IProjectItem item) =>
        new TextBlock { Text = item.Name, Foreground = System.Windows.Media.Brushes.White, Margin = new Thickness(12, 8, 8, 8) };

    public IEnumerable<MenuEntry> GetMenu(IProjectItem item)
    {
        var stack = (Stack)item;
        yield return new MenuEntry
        {
            Icon = "\uE768", Text = "docker compose up",
            Click = _ => host.Terminals.RunService($"compose · {stack.Name}", "docker compose up", stack.Directory)
        };
    }

    public void Refresh() => ItemsChanged?.Invoke();
}
```

## ★ Good to know

Every member is explained in `Vyberun.Extensions.xml`; the **Allowed** table above says which one does what.
What it doesn't say:

- `RunService` tabs show for every card; `RunInShell` runs in that card's own tabs (running indicator, Ctrl+C,
  history).
- `AddMenu` adds a submenu under vyberun's **Extensions** menu (the menu bar stays the same however many
  extensions there are), built each time it opens.
- `Busy` runs one action at a time.
- `OnClosing` isn't called when the tabs keep running in the background (on a restart, or when the user chooses
  to keep them).
- vyberun adds **Open in (your editor) / Open Folder / Open in Terminal** to a card's menu by itself, for the
  folders in its `IProjectItem.Folders`; your `GetMenu` entries come below them. A card that isn't a folder (a
  port, a service, a ticket) leaves `Folders` empty and gets none of them; one that is a single folder lists it
  (`[new("Project", Directory)]`). **Color** and **Links** are on every card.
- Terminal tabs (yours included) run in vyberun's session host, a background program: they can outlive vyberun,
  and come back with their output when it starts again. So when your extension starts, `Terminals.Tabs` may
  already hold tabs (and running services) from before: look at what's running instead of assuming nothing is.

## ‖ Turned off while vyberun runs

Users can turn extensions on and off (and add or remove them) in **Extensions ▸ Manage extensions…** without
restarting. When yours is turned off, vyberun removes its spaces, footers and menus and calls
`IVyberunExtension.Shutdown()`: stop your timers and background work there. Turned on again, vyberun creates a new
instance of your extension class and calls `Initialize` again. Your DLL is loaded from memory (its files are
never locked), but a new version only replaces the loaded one when vyberun restarts.

## ◐ Looking like vyberun

Card views go inside vyberun's card container (selection highlight, hover, the theme's outline). Use vyberun's
resources so your cards follow whichever theme the user picks:

- Brushes (`{DynamicResource …}`): `Theme.Accent`, `Theme.AccentGradient`, `Theme.HeaderText`,
  `Theme.Divider`, `Theme.ChipBackground`, `Theme.PullDot`, `Theme.LinkedIcon`, `Theme.PanelBackground`,
  `Theme.TerminalBackground`, `Theme.DialogBackground`, `Theme.MenuBackground`, `Theme.WindowBorder`
- Styles (`{StaticResource …}`): `IconButton` (round icon button, Segoe MDL2 glyph as content),
  `DialogButton`, `CloseButton` (dialog title bar)
- Icons: `LaravelIcon`, `ReactIcon`, `ClaudeCodeIcon` (geometries) with `LaravelBrush`, `ReactBrush`, `ClaudeBrush`
- Text: `Ink.FF` for names, `Ink.99` / `Ink.59` for secondary lines (they follow the theme), 9.5–13 px

## # Versioning

`extension.json`'s `apiVersion` must match vyberun's (`ExtensionApi.Version`). New members are added without
changing it; a change that would break existing extensions gets a new version, and vyberun tells the user
which extensions need updating instead of loading them.
