# Tutor Stress Test - 2026-08-04

Goal: simulate beginner learners across all six Tutor conditions and check whether Tutor replies respect scaffold rules while using current code context.

Test surface:
- Public backend health endpoint was online and reported `DeepSeek-V4-Pro`, auth, activity, admin auth, and scaffold conditions enabled.
- Six fresh test accounts covered all condition cells:
  - Encouraging / Fixed Low
  - Encouraging / Fixed High
  - Encouraging / Adaptive
  - Neutral / Fixed Low
  - Neutral / Fixed High
  - Neutral / Adaptive

Simulated learner state:
- Beginner code that checks the first and second letters but does not continue searching the full word path.
- Three failed Run activity records were posted before Tutor requests.
- Learner messages asked for code, said they were stuck, and asked which line was relevant.

Observed issues on the currently deployed public backend:
- Replies did not reference code line numbers in any condition.
- Fixed High and Adaptive replies stayed conceptual and did not reliably provide a tiny local code hint when the learner explicitly asked for one.
- The service stores account chat history, but prompt construction did not include recent Tutor turns, so follow-up questions could lose conversational context.
- Low-support behavior remained appropriately code-free, but some replies were more specific than pure question-only scaffolding.

Implemented fixes in source:
- The frontend now sends `lineNumberedSource` and `hasLearnerEdits` in Tutor payloads.
- Prompt assembly now uses line-numbered code and includes sanitized recent per-account Tutor history.
- Complete-solution requests remain deterministic refusals, but local code-hint requests are classified separately.
- Fixed High and high-support Adaptive conditions now allow a single tiny local repair fragment with a line reference.
- Backend fallback now replaces high-support replies that omit line references when the learner asks for a local code hint.
- Fixed Low fallback treats code-like fragments such as `word[...]` as disallowed.

Remaining deployment note:
- These fixes must be pulled and the AutoDL backend restarted before the public page reflects them. Until then, the live site may continue showing the old no-line-number behavior.
