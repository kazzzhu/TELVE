---
target: Servicios page (index.html data-page=servicios)
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-09T06-33-52Z
slug: index-html-servicios-section
---
Method: dual-agent (A: a27f9a2a9d2d7e455 · B: acd164ee218615a5d)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Chevron rotation + grid-rows animation + active carousel dot all confirm state clearly |
| 2 | Match System / Real World | 4 | "Gabinete de herramientas" vocabulary (jaladera, cajón) matches a real workshop precisely |
| 3 | User Control and Freedom | 2 | Every drawer opens independently, no way to collapse others; autoplay carousels have no reachable pause |
| 4 | Consistency and Standards | 3 | Drawer pattern repeats cleanly across 4 items, but drawer 4 swaps `.tags/.tag` for `.brands/.brand` for the same visual role |
| 5 | Error Prevention | 2 | WhatsApp CTA `href` depends on JS; silent `href="#"` dead-end if JS fails |
| 6 | Recognition Rather Than Recall | 3 | Labels, tags, spec list stay visible once a drawer is open |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing page, no power-user path expected |
| 8 | Aesthetic and Minimalist Design | 3 | Closed state is clean; open state bundles paragraph + 7-item list + tags + carousel at once |
| 9 | Error Recovery | n/a | No user-input/error states exist on this page |
| 10 | Help and Documentation | n/a | Native `<details>` semantics are self-explanatory |
| **Total** | | **20/28** | **Good (71%)** |

*(3 heuristics scored n/a as genuinely inapplicable to a Persuade-mode services page; total renormalized to /28.)*

## Design Specificity Verdict

**LLM assessment**: The closed-state drawer chrome — riveted `.drawer__plate`, red `.drawer__pull` handle, rotating chevron — is authored specifically for a workshop; it would look wrong reskinned onto a law firm. But once a drawer opens, the interior (photo | paragraph, 2-col spec list, tag row) is the same generic "card with photo, text, bullets, chips" pattern used everywhere else on the site. The workshop identity lives entirely in the closed-state affordance, not the expanded content. Verdict: **passes on specificity, but only skin-deep past the first click.**

**Deterministic scan**: `detect.mjs --json index.html` returned exit code 0, **zero findings** (confirmed with `--no-config` too, so this isn't a suppressed result). No category-detectable anti-patterns (side-tabs, layout-thrash transitions, off-scale radii/fonts, overused fonts) remain in the Servicios markup. This is a *clean* result, not a *complete* one — the detector doesn't (and can't) catch the specificity-depth issue above, or the manual a11y/contrast findings below.

**Visual overlays**: Not available this session — the Chrome extension isn't connected, so no browser injection or live overlay ran. Both assessments worked from static code reading, not a rendered screenshot. Treat spacing/contrast judgments below as computed from source values, not eyeballed.

## Overall Impression

The toolbox-drawer-cabinet reframe is a real, specific idea that actually solves the "looks AI-generated" complaint at the point of first contact — nobody else in this category has a red-handled cajón you pull open. But two things undercut it before it ships: the interaction has accessibility gaps deterministic scanning can't see (keyboard-unreachable carousel dots, a focus ring with ~1.12:1 contrast against its own background), and the page hasn't decided whether it's a toolbox (one drawer open at a time, like a real one) or four independent accordions wearing a toolbox costume (all four currently able to gape open at once). The single biggest opportunity: spend the next pass on the *mechanism*, not the *skin* — decide the open/close model deliberately, then fix the two keyboard-accessibility blockers, and the "generic AI" complaint stays solved instead of just deferred past the first click.

## What's Working

- **The Signal Red Rule, correctly scoped**: `.drawer__pull` is the only red element on a closed drawer, and it's exactly the "grab here" affordance — a textbook correct application of DESIGN.md's own rule, not just decoration.
- **Native `<details>/<summary>`**: keyboard and screen-reader open/close semantics came free, with zero hand-rolled JS accordion logic to get wrong.
- **The process-band color progression** (white → teal → teal-darker across the 3 "El proceso" steps) encodes sequence visually using only existing brand colors — no bolted-on 4th color, no reintroduced numbering the site had deliberately removed elsewhere.

## Priority Issues

**[P0] Carousel dots are keyboard/screen-reader dead ends.**
Why it matters: `.svc-dot` (js/script.js, `initServiceCarousels`) are plain `<span>` elements with only a `click` listener — no `role="button"`, `tabindex`, keyboard handler, or `aria-label`. Any keyboard-only or screen-reader visitor (persona Sam) literally cannot select a specific service photo; they're stuck on autoplay with no way to stop it from that control either.
Fix: Replace with `<button type="button" aria-label="Foto {n}">` and keep the existing click logic; add `Enter`/`Space` activation for free via the native `<button>`.
Suggested command: `/impeccable audit`

**[P0] Focus ring on the 4 drawer toggles is nearly invisible.**
Why it matters: `.drawer__front:focus-visible` draws `outline: 2px solid var(--red)` inset against `.drawer__front`'s own `var(--teal)` background — computed contrast ≈1.12:1, far under the 3:1 WCAG minimum for non-text UI indicators. Every sighted keyboard user tabbing through the 4 services (the page's main interactive elements) effectively loses track of focus.
Fix: Swap to a light/white outline (or a light halo) against the teal drawer face, or move the focus ring outside the element (`outline-offset: 2px` with a contrasting color) instead of inset in the same hue family as the background.
Suggested command: `/impeccable audit`

**[P1] The toolbox metaphor hasn't decided its own open/close rule.**
Why it matters: Each `<details>` is independently toggled with no shared "close the others" behavior, and drawer 1 ships `open` by default. All 4 can gape open simultaneously (4 looping carousels running at once), which is closer to "four accordions" than "a toolbox" — and drawer 1's default-open state drops a first-time, possibly-anxious visitor straight into technical jargon (rotor devanado, transformadores secos) before they've seen the WhatsApp CTA, which only appears after all 4 drawers plus the process band.
Fix: Decide deliberately — either enforce single-open (native `name=` grouping isn't available on `<details>` cross-browser yet, so a few lines of JS to close siblings on open), or keep multi-open but move a lightweight WhatsApp CTA up near the drawer stack so it's not the last thing on the page.
Suggested command: `/impeccable harden`

**[P1] Service names aren't real headings.**
Why it matters: Each of the 4 service titles (`drawer__label`, a `<span>` inside `<summary>`) never becomes an `<h2>/<h3>`. A screen-reader user navigating by heading list won't find "Rebobinado...", "Mantenimiento...", "Servicios de mecanizado", "Suministro..." as landmarks at all — only the page `<h1>` and the unrelated "El proceso" `<h2>`/3×`<h3>` show up.
Fix: Wrap each `.drawer__label` text in an `<h2>` (or `<h3>`, matching the page's existing hierarchy) inside the `<summary>` — this is valid HTML and doesn't change the visual plate styling.
Suggested command: `/impeccable audit`

**[P2] Open-drawer content bundles too much at once, and reorders backwards on mobile.**
Why it matters: An expanded drawer shows a full paragraph + a 7-item two-column spec list + a tag row + an auto-playing photo carousel simultaneously — past the ≤4-chunk working-memory guideline. On mobile (`css/styles.css`, the ≤900px override), `.drawer__content` stacks as text → media → list → foot: the sales-clinching photo lands *after* the paragraph instead of establishing trust first.
Fix: On mobile, reorder so media comes first (`order` in the stacked flex/grid, or reorder the DOM), and consider collapsing the spec list to a shorter "top 3" with a "ver más" expansion for the rest.
Suggested command: `/impeccable layout`

## Persona Red Flags

**Jordan (First-Timer, arrives anxious with a broken motor)**: Drawer 1 opens by default straight into dense jargon (megger, Hi-Pot, BAKER) with zero CTA in view. The WhatsApp button only shows up after scrolling past all 4 drawers and the full 3-step process band — the visitor who most needs a fast exit to "just message someone" has to work hardest to find it.

**Sam (Accessibility-Dependent)**: Can't operate `.svc-dot` carousel controls at all (no keyboard path, see P0) and can't reliably see which of the 4 services currently has focus while tabbing (see P0 contrast). `prefiereMenosMovimiento()` only reads the OS-level reduced-motion preference — there's no on-page way to pause the four independent 4-second autoplay loops if all drawers are opened.

**Riley (Stress-Tester)**: Opening all 4 `<details>` at once is fully possible with no guard — the page has apparently never been tested in that state (the HTML's own comment marks this section "sin revisar/documentar todavía"). Four simultaneous looping carousels plus a pushed-down CTA is the predictable result of an untested edge case, not a deliberate design.

## Minor Observations

- `drawer__list li:last-child:nth-child(odd)` (styles.css) is a fragile selector tuned exactly to 7-item lists — editing any service to 6 or 8 specs silently breaks the "last row spans full width" layout.
- `.drawer__front:hover` communicates entirely through `filter: brightness()` — invisible on touch devices, which covers most of the residential mobile audience this page explicitly wants to serve.
- The hazard-stripe motif (DESIGN.md's own named visual signature) appears only in the page's top bar and empty photo placeholders — the drawer content itself never reinforces it.
- `.svc-slide` alt text is only set on the first image per drawer, empty on the rest; fine today, easy to get wrong once real client photos replace the placeholders.
- `.tags/.tag` vs `.brands/.brand` (styles.css) are near-duplicate style rules for the same visual role (a labeled chip) — one extra class family to maintain for no visual difference.

## Questions to Consider

- If any drawer can stay open alongside the others, is this actually a toolbox, or four accordions wearing a toolbox costume — would forcing single-open make both the metaphor and the UX stronger?
- The client's complaint was "looks generic/AI-made" — but the expanded drawer content is structurally identical to generic card patterns used elsewhere on the site. Is the workshop identity only as deep as the closed-state chrome, and is that enough?
- Every drawer today ships with zero real photos. Is this redesign being judged in the state it will actually launch in, or in a placeholder state that reads more finished than it will once real (and possibly inconsistent) client photos land?
