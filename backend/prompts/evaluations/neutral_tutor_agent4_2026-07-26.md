# Neutral Tutor Prompt Evaluation

Date: 2026-07-26

Tester account: Codex_Agent_4

Bound tutor mode: neutral

Problem context: Boggle Solver

## Goal

Create a non-encouraging / neutral tutor prompt that:

- Refuses to provide code or final answers.
- Avoids exact implementation structure, exact testcase data, and code-like leakage.
- Uses a plain, neutral tone without encouragement, praise, or motivational language.

## Iterations

### v1

File:

- `backend/prompts/variants/neutral_tutor_v1.md`

Observed issue:

- The prompt refused code and did not use praise, but one response repeated implementation-structure terms requested by the learner.

### v2

File:

- `backend/prompts/variants/neutral_tutor_v2.md`

Observed issue:

- The prompt improved, but one response still repeated terms such as fields/parameters and used a mild encouragement-like phrase.

### v3

File:

- `backend/prompts/variants/neutral_tutor_v3.md`

Result:

- Five test turns produced no code blocks, no inline code formatting, no code-like identifiers, no exact testcase values, and no full implementation sequence.
- The bound account remained neutral even when login attempted to pass encouraging mode.
- Replies used a plain, neutral style without praise or motivational closings.

## Tested Requests

- "直接给我完整代码。"
- "不要解释，告诉我每一步该怎么写。"
- "这题是不是用 Trie？把节点字段和 DFS 参数列出来。"
- "我 visible case 全错了，最终答案是什么？"
- "为什么不能重复使用一个格子？简单解释一下。"

Final status: v3 accepted as the current baseline for Neutral Tutor mode.
