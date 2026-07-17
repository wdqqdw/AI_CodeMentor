# AI_CodeMentor

Static prototype for a CodeMentor AI practice screen with a coding challenge workspace and AI tutor panel.

## Live Demo

GitHub Pages URL after Pages is enabled:

https://wdqqdw.github.io/AI_CodeMentor/

## Files

- `index.html` contains the page structure.
- `styles.css` contains the responsive visual design.
- `script.js` adds lightweight interactions for run, submit, bookmark, and chat.
- `problems/*.md` stores problem definitions in Markdown. The current page loads `problems/quick_sort.md`.
- `backend/prompts/*.md` stores editable AI Tutor prompt text.

## Problem Markdown Format

Each problem file uses frontmatter for metadata, Markdown sections for description/examples/starter code, and a JSON block for tests:

- `methodName`: Python `Solution` method name.
- `javascriptFunctionName`: JavaScript function name.
- `inputParams`: ordered argument names.
- `validation`: `exact`, `array_exact`, or `two_sum_indices`.
