# Scaffold Condition Balance Evaluation - 2026-08-04

Goal: add three hidden scaffold conditions and keep behavior comparable across Encouraging Tutor and Neutral Tutor.

## Conditions

The backend now crosses visible Tutor style with a hidden scaffold style:

- Encouraging Tutor / Fixed Low Scaffold
- Encouraging Tutor / Fixed High Scaffold
- Encouraging Tutor / Adaptive Scaffold
- Neutral Tutor / Fixed Low Scaffold
- Neutral Tutor / Fixed High Scaffold
- Neutral Tutor / Adaptive Scaffold

The scaffold condition is private experiment metadata. It is stored server-side in `account_metadata.json` and is not exposed through learner-facing user, history, or activity APIs.

## Prompt Design

Active prompt files:

- `backend/prompts/variants/encouraging_tutor_v9.md`
- `backend/prompts/variants/neutral_tutor_v9.md`
- `backend/prompts/scaffolds/fixed_low.md`
- `backend/prompts/scaffolds/fixed_high.md`
- `backend/prompts/scaffolds/adaptive.md`

Shared constraints across all six cells:

- No complete solution.
- No full function, full class, complete DFS, complete Trie, or full ordered implementation plan.
- No hidden testcase inputs, expected outputs, exact hidden-case hints, or exact failing input shapes.
- Similar target length across Encouraging and Neutral modes.
- Code fragments are forbidden in Fixed Low and only allowed as one tiny local repair in high-support cases.

## Stress Tests

Local offline tests used a temporary private data directory and an OpenAI SDK stub so no model call or production account mutation was required.

Checks passed:

- Created 18 accounts across two visible Tutor styles.
- Hidden scaffold assignment balanced exactly: 3 accounts in each of the six cells.
- Existing `account_metadata.json` entries remain authoritative and are not reassigned.
- `public_user` omits scaffold metadata.
- `public_history_entry` omits `raw_prompt`, `messages`, `learner_state`, `scaffold_mode`, `condition_key`, and `condition_label`.
- `public_activity_entry` strips hidden scaffold and raw prompt fields before learner-facing responses.
- Deterministic fallback catches multiline replies, overlong Fixed Low replies, and code-like details.
- Known-good Fixed Low and high-support fallback replies do not trigger unnecessary fallback.

## Live Model Spot Check

A six-cell live check used the same debugging request against every visible Tutor style and scaffold condition.

Observed after backend normalization:

- Fixed Low replies stayed question-only and code-free.
- Fixed High and Adaptive replies stayed within the same broad length range after fallback.
- No reply contained code fences, inline-code formatting, or full implementation details.
- One Adaptive Neutral reply used implementation-adjacent wording such as "for example", "print", and "one line". The backend fallback detector was tightened to treat those patterns as code-detail risk so high-support outputs are more consistent across Tutor styles.

## Bugs Found And Fixed

- Existing account metadata was not forcibly copied back into an in-memory user object if the object already had a scaffold value. The fix makes `account_metadata.json` the authoritative source for hidden scaffold fields.
- Learner activity/history APIs could expose hidden scaffold fields and raw prompt content from older entries. The fix adds learner-facing sanitizers while preserving full private records for admin/debug use.

## Residual Risk

The live model can still occasionally drift before backend fallback is applied. The backend now normalizes replies and replaces outputs that violate length, line-break, fixed-low question-only, or code-detail rules.
