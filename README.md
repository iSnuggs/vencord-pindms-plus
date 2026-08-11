<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo-light.svg" alt="isnuggs" height="128">
  </picture>
</p>

# pinDmsPlus

A fork of [Vencord](https://github.com/Vendicated/Vencord)'s built-in **PinDMs** plugin that adds an
auto-populated, collapsible "Group Chats" category for group DMs, on top of everything the original plugin
already does (pinning DMs into user-defined categories).

## Install

> **Be warned: this is not a one-click install.** Vencord builds plugins *into* the client when the
> client itself is built, so there's no "download the file and drop it in a folder" option the way
> BetterDiscord has. To use any userplugin — this one included — you have to build Vencord yourself
> from its source code. That's a genuine time investment, and it's worth knowing that up front rather
> than halfway through.
>
> You do **not** need to know how to code. Every step below is a command you copy and paste. But you
> do need to be willing to use a terminal, and you'll need to redo a short version of this each time
> Vencord updates (see [Keeping it up to date](#keeping-it-up-to-date)).

### Before you start: three things to install

Install these first, in this order. All three are normal installers — click through them.

1. **[Node.js](https://nodejs.org/)** — version **22 or newer**. Take the "LTS" download on the front
   page. This is what actually builds Vencord.
2. **[Git](https://git-scm.com/downloads)** — this is how you download the Vencord source code and,
   later, update it. Accept every default in the installer.
3. **pnpm** — the tool that fetches Vencord's building blocks. It comes bundled with Node, but has to
   be switched on. Open a terminal (see the note below) and run:

   ```
   corepack enable
   ```

> **Opening a terminal.** On **Windows**, press Start, type `powershell`, hit Enter. On **macOS**,
> press Cmd+Space, type `terminal`, hit Enter. On **Linux** you already know. A terminal is just a
> window where you type commands instead of clicking — you'll paste each command below and press Enter.

To check all three worked, run these three commands. Each should print a version number rather than an
error:

```
node --version
git --version
pnpm --version
```

If `node --version` prints something lower than `v22`, install the newer Node before continuing —
the build will fail on older versions.

### Building Vencord with the plugin

Run these one at a time, waiting for each to finish.

1. **Download Vencord's source code.** This creates a `Vencord` folder wherever you currently are:

   ```
   git clone https://github.com/Vendicated/Vencord
   cd Vencord
   ```

2. **Fetch its building blocks.** This takes a few minutes the first time:

   ```
   pnpm install
   ```

3. **Add this plugin.** From inside that `Vencord` folder:

   ```
   git clone https://github.com/iSnuggs/vencord-pindms-plus src/userplugins/pinDmsPlus
   ```

   The folder name matters — Vencord looks for plugins inside `src/userplugins/`.

4. **Build it:**

   ```
   pnpm build
   ```

5. **Install it into Discord.** **Fully quit Discord first** — not just closing the window. On Windows,
   right-click the Discord icon in the system tray (bottom-right, possibly under the `^` arrow) and
   choose Quit. Then:

   ```
   pnpm inject
   ```

   It'll ask which Discord to patch; pick the one you actually use (most people: Stable). Then reopen
   Discord.

6. In Discord, open **Vencord Settings → Plugins**. Find the built-in **PinDMs** and make sure it
   is **off** — both plugins rewrite the same DM list and will fight each other if both are on.
   Then turn on **pinDmsPlus**.

That's it. If the plugin appears in that list, it worked.

### Keeping it up to date

Vencord changes often, and Discord updates can break plugins. When you want the latest version, go back
to your `Vencord` folder and run:

```
git pull
pnpm install
pnpm build
```

Then fully quit and reopen Discord. Your plugins in `src/userplugins/` are left alone by `git pull`, so
you won't lose anything. To update *this plugin* specifically:

```
cd src/userplugins/pinDmsPlus
git pull
cd ../../..
pnpm build
```

**The trade-off worth understanding:** a build-it-yourself Vencord doesn't auto-update the way the normal
installer does. Nothing breaks if you skip updates for a while, but you're now the one deciding when to
run them.

### If it doesn't work

- **Nothing changed after `pnpm inject`.** Discord almost certainly wasn't fully closed. Quit it from the
  system tray (or Task Manager — end every `Discord` process), then run `pnpm inject` again.
- **The plugin isn't in the Plugins list.** It's probably in the wrong folder. It must sit at
  `src/userplugins/pinDmsPlus/` inside your Vencord folder, with the code files directly inside it — not
  nested in a second folder of the same name. Fix it and run `pnpm build` again.
- **`pnpm build` printed errors.** Check `node --version` is 22 or higher. If it is, the error text
  itself is the useful part — open an issue on this repo and paste it in.
- **You want to undo all of this.** Run `pnpm uninject` from the Vencord folder (with Discord fully
  closed) and Discord goes back to normal. Deleting the Vencord folder afterwards removes the rest.

### Already using Vencord?

If you installed Vencord the normal way (the official installer), that version can't load userplugins —
it ships pre-built, and this plugin isn't in it. Running `pnpm inject` above replaces that install with
your own build, which is what you want. Your Vencord settings, themes and enabled plugins are stored
separately and carry over untouched.

## Usage

Everything is driven from the right-click menu in your DM list.

**Pinning a DM into a category**

1. Right-click any DM in the sidebar and open the **Pin DMs** submenu.
2. Choose **Add Category** to create one, or click an existing category to move the DM into it.
3. To remove a DM, right-click it and choose **Unpin DM**.

**Managing categories**

- Right-click a category header for **Edit Category** (name and colour), **Move Up** / **Move Down**, and
  **Delete Category**.
- Click a category header to collapse or expand it.

**Group Chats**

Every group DM you're in is collected automatically into its own collapsible **Group Chats** section — you
don't add these by hand, and the category isn't editable or deletable like a normal one. Turn it off in
settings if you'd rather sort group DMs yourself.

## Settings

Found under Vencord Settings → Plugins → pinDmsPlus.

| Setting | Default | What it does |
| --- | --- | --- |
| **Pin Order** | Most recent message | Sort pinned DMs by latest activity, or set **Custom** to drag/reorder them yourself via right-click → Move Up/Move Down |
| **Group Chats Category** | On | Auto-collect every group DM into its own collapsible section |
| **Can Collapse DM Section** | Off | Lets the uncategorised DM section be collapsed too |

## Note

This is a fork rather than a light wrapper — the original plugin's source is copied in and modified, because
the Group Chats category needs to hook into the same section-index logic the original uses to lay out the
channel list.

## License

Released under the **GNU General Public License v3.0 or later** — see [LICENSE](LICENSE).

This plugin is a fork of the **PinDMs** plugin from [Vencord](https://github.com/Vendicated/Vencord),
Copyright (c) 2024 Vendicated and contributors, which is licensed GPL-3.0-or-later. The original
source is copied into this repository and modified; every file retains its original copyright and
SPDX header. Because the GPL is a copyleft licence, this fork is required to be GPL-3.0-or-later
as well — that is not a preference, it is the licence the original grants redistribution under.

The Group Chats category and the changes around it are the added work; everything else is
Vendicated's and the Vencord contributors'.

The logo in `assets/` is a project mark rather than part of the licensed source, and is
excluded from the GPL grant — please do not reuse it to identify your own project.
