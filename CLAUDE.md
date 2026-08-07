# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing website for TELVE, C.A. (Talleres Eléctricos Venezolanos), an electric motor/generator repair shop in Ciudad Bolívar, Venezuela. It is a static, no-build, vanilla HTML/CSS/JS site — no package.json, no bundler, no framework. All content is in Spanish.

Deployment is via GitHub Pages (`.nojekyll` present) — pushing to `main` publishes the site directly. There is no CI/build step; whatever is in `index.html`, `css/styles.css`, and `js/script.js` is exactly what ships.

## Architecture

The entire site is a **single-page app faked with `hidden` attributes**, all living in one `index.html`:

- Each top-level section (`inicio`, `servicios`, `nosotros`, `contacto`) is a `<section class="page" data-page="...">`. Only one is visible at a time; the rest carry the `hidden` attribute.
- Navigation is done via `data-nav="<page-name>"` on any element (nav links, buttons, "ver más" links). `js/script.js`'s `goTo()` toggles `hidden` on the matching `[data-page]` section, updates the active nav link, and writes the current page name to the URL hash (`#servicios`) via `history.replaceState` so a reload stays on the same tab.
- There is no router library and no page reload between sections — treat this as client-side state, not real navigation.

`js/script.js` is organized as a set of small `init*()` functions called once from the `DOMContentLoaded` handler:

- `CONFIG` at the top of the file is the single source of truth for the WhatsApp number, display phone, and default WhatsApp message — edit here, not inline in HTML.
- `urlWhatsapp()` builds `wa.me` links; every element with `data-wa` gets its `href` set from this at load time.
- `initHeroSlider()` / `initServiceCarousels()` — both only animate images that actually loaded (`img.complete && img.naturalWidth > 0`), so missing images degrade gracefully instead of showing broken slides. Hero needs ≥2 loaded images to show slider controls; service carousels need ≥2 loaded slides to rotate.
- `initAnimations()` — scroll-reveal via `IntersectionObserver` (adds `.reveal`/`.is-visible`) and animated number counters for the stats strip (`.specs__num`), parsing a leading integer out of text like `"54+"` while skipping things like `"24/7"`.
- `initNavIndicator()` — moves the sliding red bar under the active/hovered nav link by reading `offsetLeft`/`offsetWidth` of the target link.

## Images: convention over configuration

`img/LEEME - nombres de las fotos.txt` documents the expected filenames (in Spanish, written for a non-technical client). The pattern used throughout `index.html` is:

```html
<img src="img/some-expected-name.jpg" alt="..." onerror="this.remove()">
```

If the client hasn't supplied a photo yet, the `<img>` removes itself on load failure and a `<span class="ph">` placeholder (styled in `css/styles.css` under "Media placeholders") shows instead. **When adding new images to a page, follow this same `onerror="this.remove()"` + sibling `.ph` placeholder pattern** — don't assume the file exists on disk. Client-supplied photos live in `img/` and `Material Miscelanio/` (the latter holds raw/unprocessed source assets, not things referenced by the site).

## Working in this repo

- There is no build/lint/test tooling — verify changes by opening `index.html` directly in a browser or serving the directory statically (e.g. `python -m http.server`).
- `css/styles.css` is organized into clearly delimited comment blocks (Reset, Utilidades, Nav, Hero, Servicios, Contacto, Footer, animations at the bottom, etc.) — match the section a change belongs to rather than appending to the end of the file.
- `TELVE_original_bundle.html.bak` is a legacy single-file bundled snapshot kept for reference; it is not part of the served site and should not be edited as if it were live.
- Commit message style in this repo is informal Spanish with a trailing version-like tag, e.g. `Animaciones Update 0.6`, `Cambios 0.5.3`. Follow that convention for new commits unless told otherwise.
