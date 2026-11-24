# REQ-20261124-sharelink-platforms: Sharelink top 20 social + Ask AI, Twitter is X

| Field        | Value                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| Status       | in-progress                                                                                            |
| Owner (dev)  | component-developer                                                                                    |
| Requested by | the user                                                                                               |
| Branch / PR  | `master`: d76cda5, then the follow-up commit                                                           |
| Release      | not released yet (no tag)                                                                              |
| Related docs | `docs/component-conversion.md` (Sharelink), `docs/css-design-system.md` (icons), `docs/change-list.md` |

Written after the fact: no requirement existed before the work.

## Why

Sharelink had 5 platforms and the old Twitter brand. Users expect the most popular apps (TikTok, Instagram, WeChat, RedNote…) and links to ask AI tools about the page.

## Scope

- In: top 20 social platforms by popularity; Ask AI links; Twitter to X; copy link for apps with no web share link; WeChat QR code; label-only items for brands the icon font lacks; brand-color hover with a light lift; lib exports.
- Out: Pocket, Skype (shut down 2025); Mastodon (needs an instance); Gemini app and Grok (no prompt link or icon; Google AI Mode covers Google).

## Requirements

- [x] R1 `SHARELINK_PLATFORM_IDS`: Facebook, WhatsApp, Instagram, TikTok, WeChat, Messenger, Telegram, Snapchat, X, Pinterest, Reddit, LinkedIn, Threads, RedNote, Weibo, QQ, Discord, LINE, Email, SMS.
- [x] R2 `SHARELINK_AI_IDS`: ChatGPT, Google AI, Claude, Perplexity, Copilot. They open in a new tab with `prompt` (default "Summarize this page:") plus the URL, in their own `.sharelink-ai` group.
- [x] R3 Empty `platforms` shows `SHARELINK_DEFAULT_PLATFORMS`: top 5 social (Facebook, WhatsApp, Instagram, TikTok, WeChat) and top 4 AI (was: all 5).
- [x] R4 Instagram, TikTok, Messenger, Snapchat, RedNote, QQ, Discord copy the URL; root class `copied` shows "Link copied. Paste it in …" for 4s.
- [x] R5 WeChat shows a QR code of the URL (root class `qr`), with a close button. `qrcode-generator` loads on click only and is external in the lib build.
- [x] R6 `twitter` is read as `x`; X shares via `x.com/intent/post`. Threads uses `threads.com`.
- [x] R7 Platforms the icon font lacks (X, Threads, LINE, TikTok, Messenger, Discord, RedNote, ChatGPT, Claude, Perplexity) show the label only (`text-only`), on every screen size.
- [x] R8 `client/src/lib/index.ts` exports the three constants; `sharelinkModel.ts` is in `vite.lib.config.ts` `dts.include`.
- [x] R9 Hover and focus fill each item with its brand color (`--color-brand-<id>`; Email, SMS, Share use `--color-link`) and lift it (`translateY(-0.125rem) scale(1.05)`). Reduced motion: no lift.

## Acceptance criteria

- [x] AC1 Sharelink stories pass (`npm run test:storybook`): default shows copy, QR and AI items; `AllPlatforms` shows all 25.
- [x] AC2 `npm run build:vite` and `npm run build:lib` pass; `dist-lib/components/sharelinkModel.d.ts` exists.

For human verification (look and feel, interaction):

- [ ] Brand hover colors and text contrast look right (light and dark); X, Threads and TikTok are black.
- [ ] The lift animation feels light; label-only items line up with icon items.
- [ ] Each default platform opens the right page with URL and text; copy items paste the URL.
- [ ] The WeChat QR code scans in WeChat.

## Design and decisions

- Extend: same component and model; no new component.
- Defaults by popularity (user's choice): 3 of the top 5 only copy or show a QR on desktop (user cut the default from 10 to 5). On mobile, the native Share item reaches every app.
- Brand colors are fixed hex tokens (`--color-brand-*` in `_theme.default.scss`), an exception to the HSL token rule: a brand color can't change per theme.
- Version impact: empty `platforms` changes from all 5 to 9 items. Minor bump; note it in the release.

## Changelog

- 2026-11-24: created after the fact (docs-maintainer)
- 2026-11-24: scope grown to app-only platforms, WeChat QR and Ask AI; dts question answered (no `.d.ts` was emitted; file added to `dts.include`)
- 2026-11-24: drawn mask icons removed (user: label only for missing icons); brand-color hover and lift added
