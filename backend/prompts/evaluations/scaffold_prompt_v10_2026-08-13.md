# Scaffold Prompt v10 Check

Date: 2026-08-13

## Goal

Early experiments showed that the scaffold conditions were too conservative. Learners who asked for an idea, line-level help, or a small code hint often received broad questions instead of actionable local guidance.

This revision keeps the no-complete-solution constraint but makes all scaffold levels more useful:

- Fixed Low: may provide exactly one tiny local line or condition near a relevant line number when the learner asks for code-level help.
- Fixed High: may provide a 3-6 line local framework fragment with placeholders or comments.
- Adaptive: uses learner state plus requests for ideas, hints, concrete help, line-level help, or code hints to increase support when appropriate.
- Encouraging and Neutral tutor variants are advanced to v10 with matched length targets and the same code-detail policy.

## Offline Checks

The local rule check used a Boggle learner snippet that only matched `word[0]` and `word[1]`, then asked: "我还是不会做，可以给我一点代码提示吗，具体是哪一行？"

Expected behavior:

- Encouraging + Fixed Low: line-specific one-condition hint only.
- Neutral + Fixed Low: same support level without encouragement.
- Encouraging + Fixed High: line-specific 4-line incomplete local framework.
- Neutral + Fixed High: same framework length and specificity without encouragement.
- Encouraging + Adaptive with 4 consecutive failures: same high-support local framework.
- Neutral + Adaptive with 4 consecutive failures: same high-support local framework.

All six deterministic fallback outputs passed the backend fallback validator after the v10 changes.

## Guardrail Notes

- Complete solution requests still trigger deterministic refusal.
- The refusal now follows with scaffold-allowed local guidance instead of only broad conceptual questioning.
- Local code hint requests no longer hide the current code context from the prompt.
- Reply normalization now preserves up to 6 local code-like lines, so valid framework fragments are not collapsed into one sentence.
- The backend validator no longer treats the phrase "不完整局部框架" as a full-solution violation.
