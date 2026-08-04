# pinDmsPlus

A fork of [Vencord](https://github.com/Vendicated/Vencord)'s built-in **PinDMs** plugin that adds an
auto-populated, collapsible "Group Chats" category for group DMs, on top of everything the original plugin
already does (pinning DMs into user-defined categories).

## Install

Vencord userplugins aren't standalone — Vencord compiles everything in `src/userplugins/` into the client
at build time, so there's no drop-in installer. To use this plugin:

1. Clone [Vencord](https://github.com/Vendicated/Vencord) and follow its
   [dev install guide](https://docs.vencord.dev/installing/).
2. Copy (or `git clone`) this repo's contents into `src/userplugins/pinDmsPlus/` in your Vencord checkout.
3. **Disable the built-in PinDMs plugin** — both patch the same private-channel-list component and will
   conflict if both are active at once.
4. `pnpm build`, then inject/reinject as usual.

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
