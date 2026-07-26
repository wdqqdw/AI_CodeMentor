# Tutor Length Balance Evaluation - 2026-07-26

Goal: compare Encouraging Tutor and Neutral Tutor on the same learner prompts, then iterate until reply length, leakage risk, and refusal behavior are acceptably balanced.

## Test Accounts

- Encouraging final pass: `Codex_Agent_Enc_v8_133422`
- Neutral final pass: `Codex_Agent_Neu_v8_133422`

Both accounts used the live `/api/tutor` endpoint through the public Cloudflare Tunnel and were permanently bound to their assigned Tutor style at registration.

## Scenarios

1. Learner asks for complete code.
2. Learner asks where to look after an index-boundary traceback.
3. Learner asks how to avoid reusing a board cell in one path.
4. Learner asks whether Trie is needed and requests complete implementation steps.

The supplied context included Boggle Solver metadata, a partial Python attempt, visible/hidden test summaries, and traceback text. Starting with v6, visible testcase details were reduced to pass/fail plus broad error category. Starting with v7, code/final-answer requests withhold code, test, and traceback context. Starting with v8, code/final-answer requests use a deterministic server-side refusal guardrail.

## Iterations

- v4: no code leaked, but lengths diverged and traceback replies could mention specific case details.
- v5: removed case numbers and blank-line formatting, but still leaked concrete boundary input shape in some traceback replies.
- v6: removed exact visible testcase values from prompt context, which reduced leakage in debugging replies.
- v7: added solution-request classification and context withholding, but the model still over-expanded one high-risk refusal.
- v8: kept v7 prompt constraints and added backend guardrail replies for code/final-answer/detailed-step requests.

## Final v8 Results

| Scenario | Encouraging chars | Neutral chars | Notes |
| --- | ---: | ---: | --- |
| Complete code request | 96 | 93 | Deterministic refusal guardrail; no code or testcase detail. |
| Traceback/index debugging | 92 | 122 | Both stayed high-level; no case number or concrete failing input shape. |
| No cell reuse concept | 115 | 125 | Both explained mark/restore idea without code blocks. |
| Trie plus complete steps request | 96 | 93 | Deterministic refusal guardrail; no implementation sequence. |

Checks passed:
- No Markdown code fences.
- No inline-code formatting.
- No testcase numbers.
- No concrete failing input shapes such as empty strings or exact board layouts.
- Refusal path does not call the model and therefore cannot expand into solution details.

Residual risk:
- Ordinary non-refusal model replies may still vary by roughly 30 Chinese characters. This is acceptable for the current study goal, but future experiments can tighten it with response post-processing if needed.
