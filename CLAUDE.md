# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing website for TELVE, C.A. (Talleres Eléctricos Venezolanos), an electric motor/generator repair shop in Ciudad Bolívar, Venezuela. It is a static, no-build site — no package.json, no bundler, no framework. Source content is in Spanish; the site ships four languages (see "Multi-language" below).

Deployment is via GitHub Pages (`.nojekyll` present) — pushing to `main` publishes the site directly. There is no CI/build step; whatever is in `index.html`, `css/styles.css` and `js/*.js` is exactly what ships.

The one server-side dependency is Supabase, used only by the "Equipos en venta" catalog (see below). Everything else works offline-of-backend.

## Architecture

The entire site is a **single-page app faked with `hidden` attributes**, all living in one `index.html`:

- Each top-level section (`inicio`, `servicios`, `equipos`, `nosotros`, `contacto`) is a `<section class="page" data-page="...">`. Only one is visible at a time; the rest carry the `hidden` attribute.
- Navigation is done via `data-nav="<page-name>"` on any element (nav links, buttons, "ver más" links). `js/script.js`'s `goTo()` toggles `hidden` on the matching `[data-page]` section, updates the active nav link, and writes the current page name to the URL hash (`#servicios`) via `history.replaceState` so a reload stays on the same tab.
- There is no router library and no page reload between sections — treat this as client-side state, not real navigation.

Three scripts load in order at the bottom of `index.html`, plus an inline script in `<head>`:

- **inline `<head>` script** — reads `telve-motion` / `telve-lang` from `localStorage` and stamps `data-motion` / `data-lang` on `<html>` *before first paint*, so there is no flash of animation or of the wrong language. It must stay inline; an external file would arrive too late.
- **`js/equipos.js`** — self-contained IIFE for the equipment catalog and login (Supabase).
- **`js/i18n.js`** — translation dictionaries only, no logic. Exposes `window.TELVE_I18N`.
- **`js/script.js`** — everything else, organized as small `init*()` functions called once from the `DOMContentLoaded` handler.

`js/script.js` notes:

- `CONFIG` at the top of the file is the single source of truth for the WhatsApp number, display phone, and default WhatsApp message — edit here, not inline in HTML.
- `urlWhatsapp()` builds `wa.me` links; every element with `data-wa` gets its `href` set from this at load time.
- `initHeroSlider()` / `initServiceCarousels()` — both only animate images that actually loaded (`img.complete && img.naturalWidth > 0`), so missing images degrade gracefully instead of showing broken slides. Hero needs ≥2 loaded images to show slider controls; service carousels need ≥2 loaded slides to rotate.
- `initAnimations()` — scroll-reveal via `IntersectionObserver` (adds `.reveal`/`.is-visible`) and animated number counters for the stats strip (`.specs__num`), parsing a leading integer out of text like `"54+"` while skipping things like `"24/7"`.
- `initNavIndicator()` — moves the sliding red bar under the active/hovered nav link by reading `offsetLeft`/`offsetWidth` of the target link.
- `initPrefs()` — the settings cloud: reduced-motion toggle and language picker, both persisted in `localStorage`. Motion **defaults to full** by client decision, deliberately ignoring `prefers-reduced-motion` on first visit; the commented-out alternative is in the inline `<head>` script.
- `prefiereMenosMovimiento()` reads `data-motion` on every tick rather than caching it, so toggling motion takes effect without restarting the carousels. Any new animation should call it the same way.

## Multi-language

Four languages: **es (base) / en / pt / it**. The mechanism is unusual and easy to break:

- **Spanish is not in `i18n.js`.** `index.html` is the source of truth; each language block holds a `text` map *keyed by the exact Spanish string* (plus `meta`, `attrs`, and the `auth`/`equipos` maps used by `equipos.js`). Switching back to `es` restores the original DOM text.
- `cacharTextos()` (in `script.js`) walks the DOM once at load and snapshots every text node and translatable attribute (`alt`, `aria-label`, `title`, `placeholder`). **Text inserted into the DOM after that walk is never translated by it.**
- Consequence 1: if you edit a Spanish phrase in `index.html`, its key in `i18n.js` stops matching and that phrase silently stays in Spanish. Nothing breaks. Load the site in English with the console open to see the list of untranslated strings.
- Consequence 2: JS-generated text (equipment cards, auth modal messages) can't use the walker, so `equipos.js` looks translations up live via its own `diccionario()` / `tAuth()` / `tEquipos()` helpers against `window.TELVE_I18N`. Follow that pattern for any new dynamic text. Where practical, prefer putting a hidden element in `index.html` and just unhiding it — then the normal walker translates it for free.
- Adding a language: add it to the `idiomas` list in `i18n.js` and copy a whole dictionary block. `index.html` needs no changes; the dropdown builds itself. Flags are files (`img/bandera-<code>.png`, 40×28 PNG) — emoji flags are not used because Windows doesn't render them.
- The English translation was drafted by the assistant, not by TELVE, and is still **pending review** by the client for technical terms.

## Equipos en venta (Supabase)

`js/equipos.js` powers the `equipos` page: public login/registration, and an admin-only form to add or delete equipment (motors, pumps, generators), with type-dependent fields and a photo lightbox.

- The Supabase URL and publishable key are hardcoded in the file — that is intentional, they are public-by-design client keys.
- **Authorization is enforced by database RLS policies**, not by this file. The UI check against `ADMIN_EMAIL` only mirrors the same rule so it doesn't show a button the database would reject. Never rely on client-side checks here for access control.
- The Supabase library loads from a jsDelivr CDN. If it fails to load, the script unhides `#equiposOffline` in `index.html` and returns; the rest of the site is unaffected.

- Signup errors are translated by **error code** (`ERRORES_REGISTRO` in `equipos.js`), never by matching Supabase's English message text, which is not stable across library versions. Anything unmapped falls back to a generic translated line — the raw English error is never shown to a visitor.
- **Half of this flow is dashboard config, not code**: Site URL, the redirect allow-list, SMTP, and the email templates. All of it is written down in `supabase/README.md`, along with the known gaps (no "forgot password" screen, no way to resend a confirmation email). Read that file before debugging anything about registration or confirmation emails.

## Images: convention over configuration

`img/LEEME - nombres de las fotos.txt` documents the expected filenames (in Spanish, written for a non-technical client). The pattern used throughout `index.html` is:

```html
<img src="img/some-expected-name.jpg" alt="..." onerror="this.remove()">
```

If the client hasn't supplied a photo yet, the `<img>` removes itself on load failure and a `<span class="ph">` placeholder (styled in `css/styles.css` under "Media placeholders") shows instead. **When adding new images to a page, follow this same `onerror="this.remove()"` + sibling `.ph` placeholder pattern** — don't assume the file exists on disk. Client-supplied photos live in `img/` and `Material Miscelanio/` (the latter holds raw/unprocessed source assets, not things referenced by the site).

Several service photos (`img/servicio-*-1..3.jpg`), `nosotros-fachada.jpg` and `equipo-gianpier.jpg` are referenced but not yet delivered by the client — that is expected, not a bug. GitHub Pages is case-sensitive, so filename case must match exactly.

## Working in this repo

- There is no build/lint/test tooling — verify changes by opening `index.html` directly in a browser or serving the directory statically (e.g. `python -m http.server`).
- **Bump the `?v=` query string** on `css/styles.css` and the three `js/*.js` tags in `index.html` whenever you publish. GitHub Pages serves these with `max-age=600`; without the bump, returning visitors get old CSS against new HTML and the page looks broken.
- `css/styles.css` is organized into clearly delimited comment blocks (Reset, Utilidades, Nav, Hero, Servicios, Contacto, Footer, animations at the bottom, etc.) — match the section a change belongs to rather than appending to the end of the file.
- `PRODUCT.md` and `DESIGN.md` are the product brief and the design system of record (Impeccable-generated). `DESIGN.md` documents the type ramp, palette and the industrial-workshop direction — read it before making visual changes. Note its scope rule: this is a **restyle, not a rebrand** — brand name, logo, colors and existing Spanish copy are not to be rewritten.
- Impeccable lives as a global plugin, not vendored here (see `.gitignore`).
- Commit message style in this repo is informal Spanish with a trailing version-like tag, e.g. `Animaciones Update 0.6`, `Ajustes mobile 2.8`. Follow that convention for new commits unless told otherwise.
