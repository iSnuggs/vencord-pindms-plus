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
