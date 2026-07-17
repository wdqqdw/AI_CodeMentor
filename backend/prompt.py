"""Prompt assembly for the CodeMentor AI Tutor."""

from __future__ import annotations

from typing import Any


SYSTEM_PROMPT = """You are CodeMentor AI, an interactive programming tutor inside a coding practice page.

Core behavior:
- Help the learner reason through the current algorithm problem instead of jumping straight to a complete answer.
- Be concise, practical, and friendly.
- Match the learner's language. If the learner writes Chinese, reply in Chinese.
- Use the current problem, code, language, and test state as your context.
- If the learner asks for debugging help, point to the most likely issue and suggest the next small change.
- Do not reveal hidden testcase inputs, hidden expected outputs, or private judge data.
- You may describe hidden testcase outcomes only at a summary level, such as how many passed or failed.
- If the learner explicitly asks for the full solution, you may provide it, but prefer explaining the idea first.
- Do not claim to have run code yourself unless the provided test state says so.
"""


def _text(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    return str(value)


def _truncate(value: str, limit: int = 6000) -> str:
    if len(value) <= limit:
        return value
    return value[:limit] + "\n... [truncated]"


def _format_examples(examples: Any) -> str:
    if not isinstance(examples, list) or not examples:
        return "- No public examples provided."

    lines: list[str] = []
    for index, example in enumerate(examples[:3], start=1):
        if not isinstance(example, dict):
            continue
        lines.append(
            f"- Example {index}: input: {_text(example.get('input'))}; output: {_text(example.get('output'))}"
        )
    return "\n".join(lines) or "- No public examples provided."


def _format_visible_results(results: Any) -> str:
    if not isinstance(results, list) or not results:
        return "- No visible testcase details yet."

    lines: list[str] = []
    for item in results[:3]:
        if not isinstance(item, dict):
            continue
        status = "PASS" if item.get("passed") else "FAIL"
        lines.append(
            "\n".join(
                [
                    f"- Case {item.get('index', '?')}: {status}",
                    f"  input: nums = {_text(item.get('nums'))}, target = {_text(item.get('target'))}",
                    f"  expected: {_text(item.get('expected'))}",
                    f"  actual: {_text(item.get('actual'))}",
                ]
            )
        )
    return "\n".join(lines) or "- No visible testcase details yet."


def _format_test_state(test_state: Any) -> str:
    if not isinstance(test_state, dict) or test_state.get("scope") == "none":
        return "The learner has not run tests yet."

    hidden = test_state.get("hidden") if isinstance(test_state.get("hidden"), dict) else {}
    return "\n".join(
        [
            f"Latest run scope: {_text(test_state.get('scope'), 'unknown')}",
            f"Overall score: {_text(test_state.get('passed'), '0')}/{_text(test_state.get('total'), '0')} passed",
            "Visible testcase details:",
            _format_visible_results(test_state.get("visible")),
            "Hidden testcase summary only:",
            f"- hidden total: {_text(hidden.get('total'), '0')}",
            f"- hidden passed: {_text(hidden.get('passed'), '0')}",
            f"- hidden failed: {_text(hidden.get('failed'), '0')}",
        ]
    )


def build_tutor_messages(payload: dict[str, Any]) -> list[dict[str, str]]:
    message = _text(payload.get("message")).strip()
    if not message:
        raise ValueError("Provide 'message'.")

    problem = payload.get("problem") if isinstance(payload.get("problem"), dict) else {}
    code_state = payload.get("code") if isinstance(payload.get("code"), dict) else {}

    language = _text(code_state.get("language"), "unknown")
    source_code = _truncate(_text(code_state.get("source")))
    editor_status = _text(code_state.get("status"), "unknown")
    editor_output = _truncate(_text(code_state.get("output")), 1500)

    context = f"""Current learner context:

Problem:
- English name: {_text(problem.get('englishName'), 'Unknown')}
- Chinese name: {_text(problem.get('chineseName'), 'Unknown')}
- Category: {_text(problem.get('category'), 'Unknown')}
- Difficulty: {_text(problem.get('difficulty'), 'Unknown')}
- Description: {_text(problem.get('englishDescription'), 'No description provided.')}

Public examples:
{_format_examples(problem.get('examples'))}

Current code:
```{language}
{source_code}
```

Editor/test status:
- status label: {editor_status}
- output panel: {editor_output or 'empty'}

Test state:
{_format_test_state(payload.get('testState'))}

Learner request:
{message}
"""

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": context},
    ]
