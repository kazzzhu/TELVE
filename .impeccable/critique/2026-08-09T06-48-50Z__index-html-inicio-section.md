---
target: Inicio page (index.html data-page=inicio)
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-09T06-48-50Z
slug: index-html-inicio-section
---
Method: dual-agent (A: a6a457a9629ad9cd8 · B: ad5e45a9025ffc7d2)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hero dots/nav indicator show position; slider has no elapsed/paused indicator |
| 2 | Match System / Real World | 4 | Plain Spanish, real technical vocabulary matching both audiences |
| 3 | User Control and Freedom | 2 | Hero autoplay (5s) has no pause control beyond OS reduced-motion — violates WCAG 2.2.2 spirit |
| 4 | Consistency and Standards | 2 | Dots are `<span>` not `<button>`; 3 different "go elsewhere" styles for one action |
| 5 | Error Prevention | 3 | Hero slides degrade silently (opacity:0 default + naturalWidth filter), no broken-image flash |
| 6 | Recognition Rather Than Recall | 3 | CTAs clearly labeled, no ambiguous icons |
| 7 | Flexibility and Efficiency | n/a | Marketing homepage, no power-user path to accelerate |
| 8 | Aesthetic and Minimalist Design | 3 | 6 stacked zones is a lot for one "page", but each is color-banded and separable |
| 9 | Error Recovery | n/a | No form/input exists on this page (WhatsApp deep-link only) |
| 10 | Help and Documentation | n/a | Not applicable to a persuade-mode static homepage |
| **Total** | | **20/28** | **Good (71%)** |

*(3 heuristics scored n/a as genuinely inapplicable to a Persuade-mode homepage; total renormalized to /28.)*

## Design Specificity Verdict

**LLM assessment**: Genuinely authored for TELVE, not a reskinnable template. The specs strip hard-codes real capability numbers (700 HP, 500 KVA, 54+ años), the hero eyebrow says "desde 1972," the services-preview cards name actual test equipment (Megger, Ducter, Hi-Pot, Baker) and distributed brands (WEG, VOGES, PEARL, CALPEDA), and the clients band uses real institutional logos (SIDOR, Corpoelec, Bauxilum). A generic HVAC/plumber site could copy the layout skeleton but not the content specificity that makes it convincing.

**Deterministic scan**: `detect.mjs --json index.html` returned exit code 0, **zero findings**, confirmed again with `--no-config`. B independently verified the detector isn't silently swallowing anything (ran a throwaway test file with an obvious anti-pattern to confirm the tool actually fires) and clarified scope: this detector catches visual/AI-slop patterns (gradient-text, nested-cards, bounce-easing…), not accessibility/semantic-HTML issues — so a clean scan here says nothing about the keyboard/ARIA gaps found manually below.

**Visual overlays**: Not available this session (Chrome extension disconnected) — both assessments worked from static code reading.

## Overall Impression

Inicio does its job as a front door: real numbers, real client logos, and workshop-specific copy land credibility fast for an industrial buyer doing quick triage. The single biggest opportunity is that **the exact same accessibility gap flagged and fixed on Servicios this session — carousel dots built as unlabeled, unfocusable `<span>`s — exists here too, and it's worse**, because this is the very first interactive control on the entire site, not the third page in. A second, quieter issue: the services-preview cards visually promise a click (`.card` styling) they don't deliver (`.card--plain` strips hover/href), teaching visitors within the first screen that clickable-looking things on this site sometimes aren't.

## What's Working

- **Real capability numbers instead of vague copy**: "700 HP", "500 KVA" give an industrial buyer something concrete to evaluate against, in the first screen.
- **Graceful hero degradation**: `.hero__slide{opacity:0}` default plus the `naturalWidth>0` filter in `initHeroSlider` means even zero loaded images leaves a clean gradient background, never a broken-image flash.
- **Real client-logo band** (SIDOR, Corpoelec, Bauxilum) is third-party social proof most local competitors can't replicate — both assessments independently called this the strongest trust moment on the page.

## Priority Issues

**[P0] Hero slider dots are keyboard/screen-reader dead ends — and they're the site's first interactive control.**
Why it matters: `initHeroSlider` (js/script.js:587) creates each dot via `document.createElement("span")` with only a `click` listener — no `role`, `tabindex`, `aria-label`, or keydown handler — and the wrapper `<div class="hero__dots" aria-hidden="true">` (index.html:122) hides the whole control from assistive tech on top of that. This is the identical gap fixed on the Servicios carousel earlier this session, still present on the very first thing a visitor's screen reader or Tab key encounters.
Fix: mirror the Servicios fix — `<button type="button" aria-label="Ir a la diapositiva N">`, drop `aria-hidden` from the wrapper (or move it to `aria-hidden` only on decorative dot glyphs, not the interactive wrapper), toggle `aria-current="true"` on the active dot.
Suggested command: `/impeccable audit`

**[P1] Hero autoplay has no reachable pause control (WCAG 2.2.2).**
Why it matters: The only way to stop the 5-second auto-advance is the OS-level `prefers-reduced-motion` setting — there's no on-page pause, and a visitor reading the lead paragraph can lose their place mid-sentence when the slide changes under them.
Fix: pause the interval on `:hover`/`:focus-within` of `.hero--slider`, or add a small play/pause toggle beside `.hero__dots`.
Suggested command: `/impeccable harden`

**[P1] Services-preview cards look clickable but are dead ends.**
Why it matters: `.card--plain` (services-preview grid, Inicio) keeps the bordered/headed look of the site's real interactive `.card` component but explicitly strips the hover shadow (`!important`) and carries no `data-nav`/href. A visitor's first assumption — "this looks like the same card I can click on Servicios" — is wrong here, and gets zero feedback confirming it's inert.
Fix: either make the whole card a real nav target (`data-nav="servicios"`, matching the visual invitation), or flatten its styling further so it visually reads as static info rather than a disabled interactive component.
Suggested command: `/impeccable clarify`

**[P2] Hero title/lead legibility over the slider photo is contrast-indeterminate.**
Why it matters: `.hero__overlay` is a gradient from `rgba(20,45,45,.86)` down to only `rgba(36,77,77,.60)` composited over an unpredictable photo. White heading text sits safely over the 86%-opaque end, but wherever the lead paragraph or lower content lands over the 60% end, a bright region in that particular slide's photo could drop effective contrast below WCAG thresholds — this can't be confirmed deterministically from code alone (no browser session this run).
Fix: raise the overlay's minimum opacity at the text-bearing end (e.g. floor around .70-.75), or re-verify visually once a browser session is available.
Suggested command: `/impeccable audit`

**[P3] Card titles are full sentences, and 3 different "go elsewhere" link styles do the same job.**
Why it matters: `.card__title` text ("Reparación general y rebobinado de equipos eléctricos rotativos") functions as a heading but reads as a sentence, forcing sentence-level parsing instead of a scannable label — but copy is locked per PRODUCT.md, so this is a note for the client, not a stylable fix. Separately, `.btn--ghost` (hero) and `.link-arrow` (×2, elsewhere) all mean "go look at more," with no shared visual language.
Fix: flag the heading-copy pattern to the client for future content; consolidate the "go elsewhere" links into one component style.
Suggested command: `/impeccable clarify`

## Persona Red Flags

**Sam (Accessibility-Dependent)**: The hero dots (see P0) are the first interactive control on the entire site and fail a basic operable-by-keyboard test — worse than the same gap on Servicios, because there's no later page to recover trust before this one is encountered.

**Jordan (First-Timer, anxious residential customer)**: Faces a ~450-character `.hero__lead` paragraph before reaching either CTA, then a services grid whose cards look clickable but aren't (`.card--plain`) — the "what do I click" moment is muddier than it should be for someone who just wants to message about a dead motor.

**Riley (Stress-Tester)**: Repeated clicking on `.card--plain` produces zero feedback (no cursor:pointer, no hover, no navigation) — a stress-tester will read this as the cards being *broken*, not intentionally decorative.

## Minor Observations

- `.specs__num`'s count-up animation correctly preserves suffixes ("54+") and skips non-numeric labels ("24/7") — solid as-is, no action needed.
- `.client--dark` (Ciudad Orinoco logo tile) is the only dark-background exception in an otherwise uniform white-tile clients row — a small rhythm inconsistency.
- `.map__btn` hover swaps to `var(--red)` — correctly scoped as an action accent per the Signal Red Rule, not background use.
- Hero images (`hero-1/2/3.jpeg`) carry empty `alt=""` — defensible for purely decorative slides given the adjacent title/lead already carries the meaning, not flagged as a defect.
- Page ends on a low-energy note (embedded map + "Cómo llegar") after the strong clients-band peak, with no WhatsApp CTA reinforcement afterward — a mild violation of the peak-end rule's "end strong" half.

## Questions to Consider

- If the services-preview cards aren't clickable, why do they use the exact same visual component (`.card`) as the interactive cards elsewhere in the design system?
- Is a 6-zone single-page "Inicio" (hero, specs, services, why-us, clients, map) actually a homepage, or is it doing the job of three pages at once and diluting all three?
- Would the 24/7-emergency audience (someone with a dead motor right now) be better served by the WhatsApp CTA reappearing after the clients band, instead of the page trailing off into a map?
