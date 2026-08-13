# mark-up-down — Session Notes, 13 August 2026

## Project

**mark-up-down** — a reading and manuscript-review app, built as a sibling to
By Line. Where By Line writes one sentence at a time, mark-up-down reads one
sentence at a time, and lets you attach revision notes to what you read.

Location: `programming/mark-up-down/`.

## Materials referenced

- `programming/byline/index.html` — read in full (1048 lines). Single-file app,
  zero dependencies. File System Access API, IndexedDB handle persistence,
  theme-code appearance system, derived accent colour, mirror-based custom caret,
  sentence-terminator detection (`isFinalAt`, `TITLES`, `inOpenQuote`).
- `programming/byline/README.md`, `TODO.md`, `manifest.webmanifest`, git log.
- `programming/by-line/` — a duplicate of `byline` with its own git repo.
  Identical `index.html` (34203 bytes, both). Which is canonical is unresolved.

## What was discussed

**Original scope** was a reader accepting pdf, docx, rtf, txt and markdown.
Assessed the parsing cost per format: txt/md trivial; rtf a moderate hand-rolled
control-word tokenizer; docx feasible with zero dependencies via Chrome's native
`DecompressionStream('deflate-raw')`; pdf not hand-rollable at acceptable quality,
requiring a vendored pdf.js (~350KB) plus a text-cleanup layer for headers,
footers, column order and hyphenated line breaks.

Presented three scopes (A: text formats only; B: + docx; C: + pdf) and
recommended building C in that order behind a plug-in loader interface.
David chose A first.

**Scope then narrowed further** to markdown only — David will convert source
files before reading them. This eliminates the parsing problem entirely and
keeps the app a single `index.html` with zero dependencies.

**What ports from By Line unchanged:** the appearance system (font/size/bg/fg,
theme codes, `deriveAccent`, `applyAppearance`), layout, corner panels, start
screen, PWA shell, install flow, service worker, `appendToFile`, and the
sentence-terminator logic.

**What doesn't:** the custom caret, the mirror, the `beforeinput` guard that
makes the period final — reading has no "the past is untouchable" constraint.

**Two file handles, not one.** The document opens read-only, so the app cannot
touch the manuscript. The notes file opens read-write, append-only.

## Decisions made

1. **Name:** mark-up-down.
2. **Markdown only.** No pdf, docx, rtf, or plain text parsing.
3. **Navigation:** → next viewport unit, ← previous. ↓ jump forward, ↑ jump back,
   by a single symmetrical jump setting — either "paragraph" or "N words".
4. **Viewport:** per word, per sentence, or per paragraph. Arrows step by the
   selected unit.
5. **Notes anchor to the containing sentence** regardless of viewport.
6. **Notes are chronological append.** Rejected document-order insertion: it
   requires read-modify-write of the whole notes file, and a corrupt write costs
   the entire review pass rather than a single note. Reading is linear by
   default, so in practice the two orders coincide.
7. **Note format** — markdown blockquote of the sentence, revision beneath,
   locator line under that:

   ```markdown
   > He walked into the room and it was quiet, too quiet for the hour.

   Cut the second clause — "too quiet" does the work twice.

   *Chapter Seven · p.43 · w.10847*
   ```

8. **Status line, top left, in order:** header / page / word count. Header is the
   nearest preceding heading, deepest level where headings nest. Page is the
   current page. Word count is words read.
9. **Page formula:** 250 words per page — the standard manuscript convention
   (12pt Courier, double-spaced, 1" margins).
10. **Auto mode is scrapped.** No timed playback, no syllable counting.
11. **Bookmark** — a toggle button in the hint bar beside `Aa` and `?`, so its
    state is visible without opening a panel. On: position saves continuously
    while reading, and reopening resumes there. Off: always opens at the top.
    Persists in localStorage alongside the appearance settings.
12. **Emphasis markers are stripped** — `*italic*`, `**bold**`, `_underline_`
    and inline code render as clean prose. Headings keep their text, lose their
    `#`.
13. **Build order:** (1) markdown parse, display, arrow navigation, counts;
    (2) notes; (3) appearance system.

## Assumptions stated, not blocked on

- Headings appear in the reading flow as their own unit — skipping them would
  make chapter breaks invisible while reading.
- Headings don't count toward word count or page count.
- By Line's top-left slot holds the "Tip Me" link; the status stack takes that
  corner, so tip jar and filename move to the bottom.

## Concerns flagged

- **Paragraph viewport will overflow the screen** on long paragraphs at 30px.
  Auto-shrinking type with a floor is the better feel; a scrollbar is the ugly
  alternative.
- **The note box is modal.** While it's open, arrows must move the text caret,
  not the document. Correct behaviour, but it means no navigating mid-note.
- **"Words read" is really a position indicator.** If you jump around, it isn't
  a record of what you've actually read, and shouldn't pretend to be.
- **Re-noting the same sentence** appends a second entry in v1. Showing the
  existing note on return requires parsing the notes file into an index on load
  — worth doing, but as a later pass.

## Open items

- `byline` vs `by-line` — which repo is live. Asked twice, unresolved. Only
  matters at deploy time.

## Built

Single file, `mark-up-down/index.html`. Zero dependencies, as By Line.

**Step 1 — parse, display, navigation, counts.**

- Markdown: ATX and setext headings, paragraphs, blockquotes, list items,
  scene breaks (`***`), fenced code held whole, YAML front matter skipped.
- Sentence splitting ported from By Line — `Mr. Smith`, `J. K.`, `3.5` and
  `"Run!" she shouted.` survive intact, and a closing quote stays with the
  sentence it closes.
- A single sentence spine, with word/sentence/paragraph viewports derived from
  it. Every unit points back at its sentence, so notes anchor correctly
  whatever the viewport. Changing viewport keeps your place.
- Arrows: →/← one unit, ↓/↑ jump by paragraph or by N words.
- Bookmark toggle in the hint bar, filled when on, hollow when off.
- Document opens read-only. The app holds no write permission on the manuscript.
- Long paragraphs shrink type to fit, floor at half size.

**Step 2 — notes.**

- Pencil button or `Enter` opens a note on the current sentence; pencil again or
  `Esc` hides it; `Cmd+Enter` saves. Modal — arrows don't navigate while open.
- Closing without saving keeps the draft against that sentence for the session.
- In word and paragraph view the anchored sentence is shown above the box.
- Headings and scene breaks refuse notes.
- The notes file is asked for on the first save, suggesting
  `<document>-notes.md`, remembered against that document, and re-permissioned
  on reopen. Its name sits in the box, clickable to change or continue a pass.
- A fresh notes file gets a `# Notes on <document>` header. Every write is one
  append at the end.

**Step 3 — appearance.**

- `Aa` panel ported whole from By Line: font (with the same datalist and
  empty-on-focus behaviour), size slider, background and text colour, theme code
  with copy, reset to defaults.
- Theme codes are interchangeable with By Line — same `font;size;bg;fg` format,
  same derived accent, same guard against a half-set colour pair leaving text
  unreadable on its background.
- Adapted: the accent drives headings and hovers rather than a caret, and a size
  or font change re-runs fit-to-screen rather than By Line's textarea autogrow.
- Panel styles generalised to a shared `.panel` class rather than growing a
  selector list per panel.

## Corrections David made

- Status line moved from top left to **top right**, on **one line**, all in the
  muted colour — the header is not emphasised. Order unchanged: header, page,
  words. Reads `Chapter Seven · page 43 of 361 · 10,847 words`.
- "Tip Me" restored to the top left, as in By Line. Currently points at
  `ko-fi.com/byline` — whether mark-up-down gets its own is unresolved.
- Note entries reordered: locator line **above** the quoted sentence, note
  below it, entries separated by a `---` rule:

  ```markdown
  *Chapter Seven · p.44 · w.10847*

  > He walked into the room and it was quiet, too quiet for the hour.

  Cut the second clause — "too quiet" does the work twice.

  ---
  ```

  The blank line before the rule is load-bearing: without it markdown reads
  `---` as a setext heading underlining the note. Commented in the code so it
  doesn't get tidied away.

## Verification

Headless harness (`node`) running against the real source extracted from the
HTML, not a copy: **41 assertions, all passing**, covering sentence splitting,
inline stripping, block parsing, the spine, all three viewports, note locators,
theme code parsing, the HSL round trip, and the property that the derived accent
stays readable against its background. Evaluating the script also proves it
loads without syntax or reference errors.

Harness lives in the session scratchpad, not the project — it depends on
stubbing the DOM and isn't a permanent fixture yet.

Two bugs the tests caught and fixed:

- `file_name_here` was read as emphasis and collapsed to `filenamehere`.
  Underscores now only open emphasis outside a word.
- Escaped `\*star\*` was read as emphasis. Escapes are now parked out of reach
  before markers are stripped, and restored after.

Not verified: the file pickers, rendering and fit-to-screen need a real browser
and a real document — the File System Access API can't be driven headlessly.

**Finishing — installable, offline, documented.**

- `manifest.webmanifest`, `sw.js` (network-first, same strategy as By Line),
  `README.md`, and install-prompt wiring with the permanent fallback line in the
  keys panel.
- Icons generated, not borrowed: a Node script draws the wordmark's paired
  arrows in the default theme's colours, supersampled for smooth diagonals, and
  encodes the PNG through `zlib` with a hand-written container. Inside the 80%
  maskable safe zone. Script kept in the session scratchpad.
- An unsaved note now warns before the tab closes.

## Repository

`https://github.com/daebhid/mark-up-down` — **private**, branch `main`.

Two commits. `.gitignore` covers `.DS_Store` and `.claude/settings.local.json`
(note that `byline` has `.DS_Store` committed to it; this repo doesn't).

Git has no credential helper configured in this environment — `gh` holds the
token. Pushing needs
`git -c credential.helper='!gh auth git-credential' push`, or a one-time
`gh auth setup-git`, which was not run because it changes global git config.

## What persists

| What | Where |
|---|---|
| Document and notes file handles | IndexedDB (`markupdown` / `kv`) |
| Reading position, per document | localStorage `mud-bookmarks` |
| Viewport, jump mode, jump words, bookmark on/off | localStorage `mud-settings` |
| Font, size, background, text colour | localStorage `mud-appearance` |
| The app itself, for offline use | Cache Storage `markupdown-v1` |

## Next steps

All build steps are done and the app is finished to By Line's standard.

1. David to open it in Chrome with a real manuscript and report. Two things
   expected to want adjusting: the fit-to-screen floor in paragraph view, and
   how prominent the status line should be while reading.
2. **Installing it needs the app served over https.** GitHub Pages doesn't serve
   private repositories on a free plan, so the repo has to go public for the
   By Line arrangement to work. David's call — it's private at his request.
3. Tip jar still points at `ko-fi.com/byline`.
4. `byline` vs `by-line` — both exist on GitHub; `byline` is the one the README
   links to as live. Which is canonical still unconfirmed.
