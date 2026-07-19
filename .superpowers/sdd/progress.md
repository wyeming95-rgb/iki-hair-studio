# Iki Hair Studio — SDD Progress Ledger

Plan: docs/superpowers/plans/2026-07-19-iki-hair-studio-site.md
Branch: feat/site-v1
Merge base: master

## Pre-flight notes (known-minor, for final review triage)
- Task 1 smoke test asserts 1+1===2 — trivial by design, deleted in Task 3 Step 9.
- EstimateSummary (Task 7) has two near-identical CTA anchor blocks; plan-mandated duplication.

## Tasks
Task 1: complete (commits 8894d31..65632d1, review clean; minor: report overclaimed computed-style check vs screenshot — wording only, no code impact)
Task 2: complete (commits 65632d1..d2df4a1, review clean after 1 fix round)
  - Reviewer hand-verified all 33 rows vs PROJECT.md §7: zero mismatches.
  - PLAN OVERRIDE (user-approved): plan's Task 2 test spot-checked only 5/33 prices,
    2/33 durations. Added full 33-row independent-transcription assertion table.
    Re-review confirmed 33 entries, unconditional asserts, prior tests kept.
Task 3: complete (commits ea3346e..858d1e0, review clean after 1 fix round)
  - PLAN OVERRIDE (user-approved): plan's buildWhatsAppMessage capped RAW length (900),
    which did not bound the ENCODED URL. Reviewer proved 50x coloring-root-touch qty9
    -> 2033 chars. Fixed to bound encoded length via MAX_URL_LENGTH=1800.
    Re-review measured worst case (all 33 options @ qty999) = 1796. Footer survival
    structurally guaranteed. NOTE: plan doc still shows old MAX_MESSAGE_LENGTH code.
Task 4: complete (commits 02ca6a0..35444bc, review clean after 1 fix round)
  - Fixed: aria-hidden on decorative IKI wordmark; guard for missing IntersectionObserver
    (constructor throw would have stranded content at opacity:0 permanently).
  - Re-review done inline by controller (2-line change, typecheck + 37 tests green).
Task 5: complete (commits 88f4f62..38085d7, review clean after 1 fix round)
  - Reviewer verified all 5 SVG d-paths char-by-char: exact.
  - Fixed: radiogroup had no roving tabindex / arrow keys. Plan's Global Constraints
    require a real radiogroup; plan's code under-implemented it. Constraint governed.
  - MINOR for final triage: LengthPicker tabbableIndex uses sizes.indexOf(value); if
    value is ever absent from sizes it returns -1 and NO button is tabbable (keyboard
    unreachable). Unreachable today because OptionPicker resets size on group change.
Task 6: complete (commits 276f764..62ff9d0, review clean, no fix round)
  - Implementer verified interactively in browser (DOM/console, screenshots timed out).
  - Applied planned deviation: ref callback block body (plan's concise-arrow form
    returns a value, which React rejects).
  - MINOR for final triage: OptionPicker adds group.options[0] for non-size-aware
    groups; safe today (no unsized label has >1 option) but silently unreachable
    if such data is added later.
  - CARRIED TO TASK 7: tabs lack aria-controls -> role="tabpanel" linkage; the panel
    lives in Task 7's container.
Task 7: complete (commits 4eedc9f..ea62796, review clean after 1 fix round)
  - Browser-verified full cart flow: 250/2hr -> 410/3hr -> 570/4hr -> remove -> 250/2hr.
  - Fixed CRITICAL: 6 tabs each pointed aria-controls at their own panel id, but only
    ONE panel renders -> 5 dangling refs. Now all tabs -> stable "calculator-panel".
  - Fixed IMPORTANT: "Book on Tunai" kept a live href when cart empty; pointer-events-none
    + preventDefault do not block context-menu "open in new tab". Now href=undefined when
    empty, symmetric with the WhatsApp CTA. Plan text already required BOTH disabled.
  - Verified: empty cart => 6 tabbable elements, neither CTA focusable.
Task 8: complete (commits 37d822f..0bbddca, review clean, no fix round)
Task 9: complete (commits 0e80d40..687ce44, review clean after 1 fix round)
  - Fixed plan defect: TILES span/ratio were applied to <Placeholder>, but the real grid
    item is the <Reveal> wrapper, so md:row-span-2 was dead code (all 6 wrappers 497.77px).
    Reveal now takes optional className; span moved to it. After: 669/576px for the two
    row-span tiles, 280/373px others. Ratios were already correct on Placeholder.
  - ENV NOTE for Task 11: the Claude_Browser pane does NOT tick compositor frames --
    IntersectionObserver never fires there and screenshots time out. Playwright MCP works
    normally. Use Playwright for any behavioural browser verification from here on.
Task 10: complete (commits ead3f1e..8cee274, review clean after 1 fix round)
  - Fixed JSON-LD accuracy: url pointed at booking.tunai.io (third-party the salon does
    not own). Removed url (no own domain yet), moved Tunai to sameAs. Added
    addressLocality. Verified via Playwright parse: 6 opening-hours entries, Tuesday out.
  - MINOR for final triage: Footer year uses new Date().getFullYear() in a statically
    prerendered Server Component -> bakes in at build time, goes stale after Dec 31
    without a redeploy.
  - CARRIED FORWARD: restore JSON-LD `url` once the site has its own domain.
