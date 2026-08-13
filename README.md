# mark up down

Read a markdown manuscript one sentence at a time, and note what needs
changing as you go. A reading companion to [By Line](https://github.com/daebhid/byline),
which writes one sentence at a time.

Your document is opened **read-only**. The app holds no permission to write to
it and never touches it. Notes go to a separate markdown file you choose.

## Reading

- **&rarr;** and **&larr;** step forward and back one viewport at a time.
- **&darr;** and **&uarr;** jump, either to the next paragraph or by a set
  number of words. Which one is up to you, in the **&para;** panel.
- The **viewport** is what the screen shows at once: a word, a sentence, or a
  whole paragraph. Change it and you keep your place.
- The top right tells you the chapter you're in, the page you're on, and how
  many words you've read. Pages are counted at 250 words, the standard
  manuscript page.
- Headings appear in the flow as you reach them, so chapter breaks are visible
  while you read. They don't count towards the word or page count.
- The **bookmark** keeps your place between sessions. Switch it off and the
  document always opens at the top.

## Notes

Press **Enter**, or the pencil, to write a note on the sentence you're reading.
Press it again, or **Esc**, to put it away — what you've typed is kept against
that sentence. **Cmd+Enter** saves it.

Notes are anchored to a whole sentence, whatever the viewport is showing, and
appended to a markdown file of your choosing in the order you write them:

```markdown
*Chapter Seven · p.44 · w.10847*

> He walked into the room and it was quiet, too quiet for the hour.

Cut the second clause — "too quiet" does the work twice.

---
```

The locator is the chapter, the manuscript page, and the number of the
sentence's first word in the document. Every note is a single append at the
end of the file, so nothing already written can be damaged by a failed write.

The notes file is asked for the first time you save one, and remembered against
that document. Its name sits in the corner of the note box, and clicking it
lets you change file or carry on with an earlier pass.

## Anything else

- Markdown only (`.md`, `.markdown`). Convert anything else before you read it.
  Headings, paragraphs, blockquotes, list items and scene breaks are understood;
  emphasis markers are stripped so the prose reads clean.
- Nothing is uploaded anywhere; the page has no backend. Your place, your
  settings and your theme are stored in the browser.
- Requires Chrome or Edge (the File System Access API). You can install it as an
  app from the link on the start screen or in the **?** panel, or via Chrome's
  &#8942; menu: Cast, save and share, then Install page as app.
- Appearance (font, size, colours) is editable via the **Aa** button and can be
  saved or shared as a small theme code. The codes are the same format By Line
  uses, so a theme you like works in both.
