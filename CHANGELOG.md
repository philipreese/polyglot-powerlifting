# Changelog

## [0.4.3](https://github.com/philipreese/polyglot-powerlifting/compare/v0.4.2...v0.4.3) (2026-03-01)


### Bug Fixes

* automate lockfile synchronization for monorepo release PRs ([62eb18f](https://github.com/philipreese/polyglot-powerlifting/commit/62eb18f1e0a06dd6e48b785600c438fda49ea4ea))
* synchronize lockfile for v0.4.2 release ([9e7fbea](https://github.com/philipreese/polyglot-powerlifting/commit/9e7fbeae20f6701f05d6e1be4b6acad543dd815a))

## [0.4.2](https://github.com/philipreese/polyglot-powerlifting/compare/v0.4.1...v0.4.2) (2026-03-01)


### Bug Fixes

* restore deploy and automate lockfile sync ([43d82ac](https://github.com/philipreese/polyglot-powerlifting/commit/43d82ac69121e620843e3360d16b45af43810d10))
* restore deploy and automate lockfile sync ([ef986be](https://github.com/philipreese/polyglot-powerlifting/commit/ef986be368613db3d376124e349cd182d2b8a877))

## [0.4.1](https://github.com/philipreese/polyglot-powerlifting/compare/v0.4.0...v0.4.1) (2026-03-01)


### Bug Fixes

* synchronize lockfiles for v0.4.0 release ([10dd873](https://github.com/philipreese/polyglot-powerlifting/commit/10dd8738b17328e549b0db6c196c463e3d1f218a))
* synchronize lockfiles for v0.4.0 release ([5dcf0cc](https://github.com/philipreese/polyglot-powerlifting/commit/5dcf0cc4a4d96e300f9ec054796460c39630fa83))

## [0.4.0](https://github.com/philipreese/polyglot-powerlifting/compare/v0.3.0...v0.4.0) (2026-02-27)


### Features

* add Svelte web frontend to release-please configuration ([ed14f8b](https://github.com/philipreese/polyglot-powerlifting/commit/ed14f8b87b40fe4d2d3ecb61d7f31387a7691ffc))
* centralize metric configuration and implement global preferred metric selection ([650ac69](https://github.com/philipreese/polyglot-powerlifting/commit/650ac696c2212c26621193f197f1d37a0ffa8b89))
* implement supabase auth flow and local history sync ([030c794](https://github.com/philipreese/polyglot-powerlifting/commit/030c794e29b7013304720198feabdab6d5873bd8))
* implement supabase auth flow and local history sync ([567c5e3](https://github.com/philipreese/polyglot-powerlifting/commit/567c5e387608b66d55a9808dbc855ae5bf28c515))
* improve test coverage for history state and refine session UX ([7e6d54e](https://github.com/philipreese/polyglot-powerlifting/commit/7e6d54ea899490f287c084cc6eb1b87080d4cc4e))
* improve test coverage for history state and refine session UX ([49d87e0](https://github.com/philipreese/polyglot-powerlifting/commit/49d87e033b9862a6e87b090dc99488744f2c05f2))
* robust sync error handling and improved offline UX ([e23c58e](https://github.com/philipreese/polyglot-powerlifting/commit/e23c58e8fb2a6c64ebc3b3da1fb20bcff0934eae))
* **ui:** add mode-watcher for dark mode syncing ([9e29bf0](https://github.com/philipreese/polyglot-powerlifting/commit/9e29bf089c04bebf3142c03caac1e75521b58c1e))
* **ui:** build responsive calculator layout using reusable svelte 5 components ([046333d](https://github.com/philipreese/polyglot-powerlifting/commit/046333d8ccf659e264250f1f1f96a64f0a02732a))
* **ui:** build ThemeToggle component using ModeWatcher and Lucide-svelte buttons ([6aaf1f7](https://github.com/philipreese/polyglot-powerlifting/commit/6aaf1f7ccb24dd46e04f11330f4faf190f283283))
* **ui:** implement svelte 5 runes class for global calculator state ([8035a78](https://github.com/philipreese/polyglot-powerlifting/commit/8035a78151df101877c2d0e2cc718adcd259786f))
* **ui:** implement zod validation, api service, and modular ui architecture ([9f560aa](https://github.com/philipreese/polyglot-powerlifting/commit/9f560aa21928726e91e267432a675ea80509b6e9))
* **ui:** initialize calculator context in sveltekit root layout ([1f65a50](https://github.com/philipreese/polyglot-powerlifting/commit/1f65a5078b7b3a340e3d36a434a6a34c8af0c230))
* **ui:** initialize empty svelte 5 project ([646e8fb](https://github.com/philipreese/polyglot-powerlifting/commit/646e8fbf7186d103c35fbe3b7033375069f30027))


### Bug Fixes

* dynamic auth redirects and Svelte key duplication ([e9bc5b9](https://github.com/philipreese/polyglot-powerlifting/commit/e9bc5b963d2e4ba37dc2a99a2a87542b6b5e392a))
* finalize production stability with clean and verified code ([bc7ae09](https://github.com/philipreese/polyglot-powerlifting/commit/bc7ae09f81df6bba5a8d8bd621dc247e3fdc6bdc))
* finalize production stability with clean and verified code ([15d95f6](https://github.com/philipreese/polyglot-powerlifting/commit/15d95f61871074a4b1e4e79a4fbc832d0ca76a59))
* force history reload after sync to bypass stability guard ([0829a39](https://github.com/philipreese/polyglot-powerlifting/commit/0829a39c7a9f3b781ec91da8409dac964dbcd76b))
* improve E2E test resilience and add history loading UI ([4a4e7d2](https://github.com/philipreese/polyglot-powerlifting/commit/4a4e7d273557d8d8c69a08ac8a2cae51cb19e8c2))
* linting error ([7b0bff1](https://github.com/philipreese/polyglot-powerlifting/commit/7b0bff1a64e5013b19181e938e12e76424ec45bd))
* prevent redundant history API calls and resolve production crash ([2f77332](https://github.com/philipreese/polyglot-powerlifting/commit/2f7733271cf0faecad667da84422c72e091f7ce8))
* production auth diagnostics and stability improvements ([4e7d161](https://github.com/philipreese/polyglot-powerlifting/commit/4e7d1618d6a8b710891fa2c56c1a6d87dc1481fc))
* production auth diagnostics and stability improvements ([4c91527](https://github.com/philipreese/polyglot-powerlifting/commit/4c9152727096132990712f2cd93537bce1c88c20))
* production stability, env var standardization, and history sorting ([c3ac17a](https://github.com/philipreese/polyglot-powerlifting/commit/c3ac17a3dc9890bd4d94a30384dda89b9a90a72c))
* removed unused import ([d9328ea](https://github.com/philipreese/polyglot-powerlifting/commit/d9328ea221f2c9dc9e268a154da9ada8ed503b77))
* resolve E2E race conditions for CI stability ([00615b5](https://github.com/philipreese/polyglot-powerlifting/commit/00615b5e965e0e9b40c40e0967cab572c140ffa1))
* resolve infinite state loop and CORS configuration mismatch ([8e2d83c](https://github.com/philipreese/polyglot-powerlifting/commit/8e2d83cdeca8a7710c9624c1a645e6619374dea3))
* resolve infinite state loop and CORS configuration mismatch ([e9d5b09](https://github.com/philipreese/polyglot-powerlifting/commit/e9d5b09c54343d76cf3e1e058a86a58aa44ac04e))
* safely handle nullish record IDs in history list ([1a1bd8d](https://github.com/philipreese/polyglot-powerlifting/commit/1a1bd8d8703b8e43889805bcc1bed3afe6e5a621))
* **ui:** upgrade mode-watcher to svelte 5 runes and update learning plan ([5c5d5f2](https://github.com/philipreese/polyglot-powerlifting/commit/5c5d5f23dfe34b722b6f2ffef0c664dbdcd02069))
* **ui:** upgrade mode-watcher usage to native svelte 5 runes syntax ([46d3d8b](https://github.com/philipreese/polyglot-powerlifting/commit/46d3d8b8258452c39344931b6b4c8e73baa642e5))

## [0.3.0](https://github.com/philipreese/polyglot-powerlifting/compare/v0.2.0...v0.3.0) (2026-02-25)


### Features

* **api:** scaffold fastapi app with database init, wilks/dots/gl logic, and run scripts ([9818001](https://github.com/philipreese/polyglot-powerlifting/commit/981800142a3dcdb528f03aadeb793178c6ab3598))

## [0.2.0](https://github.com/philipreese/polyglot-powerlifting/compare/v0.1.0...v0.2.0) (2026-02-25)


### Features

* **spec:** define openapi structure and coefficient math ([55c8673](https://github.com/philipreese/polyglot-powerlifting/commit/55c86739f2724df780d2d5158ec729ee2123af42))
