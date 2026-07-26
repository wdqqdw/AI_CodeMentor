"""Prompt assembly for the CodeMentor AI Tutor."""

from __future__ import annotations

from pathlib import Path
from typing import Any


PROMPT_DIR = Path(__file__).resolve().parent / "prompts"
SYSTEM_PROMPT_PATH = PROMPT_DIR / "tutor_system.md"
USER_TEMPLATE_PATH = PROMPT_DIR / "tutor_user_template.md"
SYSTEM_PROMPT_PATHS = {
    "encouraging": PROMPT_DIR / "variants" / "encouraging_tutor_v8.md",
    "neutral": PROMPT_DIR / "variants" / "neutral_tutor_v8.md",
}


def _read_prompt_file(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()


def _system_prompt_path(tutor_mode: str) -> Path:
    return SYSTEM_PROMPT_PATHS.get(tutor_mode, SYSTEM_PROMPT_PATH)


def _text(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    return str(value)


def _truncate(value: str, limit: int = 6000) -> str:
    if len(value) <= limit:
        return value
    return value[:limit] + "\n... [truncated]"


def _is_solution_request(message: str) -> bool:
    lowered = message.lower()
    markers = [
        "完整代码",
        "直接给我代码",
        "给我代码",
        "写出代码",
        "最终答案",
        "完整答案",
        "完整解答",
        "完整解法",
        "完整实现",
        "实现步骤",
        "详细步骤",
        "直接答案",
        "copyable",
        "full solution",
        "complete solution",
        "complete code",
        "give me code",
        "write the code",
        "exact steps",
    ]
    return any(marker in lowered for marker in markers)


def is_solution_request(message: str) -> bool:
    return _is_solution_request(message)


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


def _error_category(error: Any) -> str:
    text = _text(error).lower()
    if not text:
        return ""
    if "indexerror" in text or "index" in text or "out of range" in text:
        return "index boundary error"
    if "recursionerror" in text or "recursion" in text:
        return "recursion termination error"
    if "timeout" in text or "time limit" in text:
        return "time limit error"
    if "typeerror" in text or "attributeerror" in text:
        return "type/state error"
    return "runtime error"


def _format_visible_results(results: Any) -> str:
    if not isinstance(results, list) or not results:
        return "- No visible testcase details yet."

    lines: list[str] = []
    for item in results[:3]:
        if not isinstance(item, dict):
            continue
        status = "PASS" if item.get("passed") else "FAIL"
        error_category = _error_category(item.get("error"))
        error_line = f"  error category: {error_category}" if error_category else ""
        lines.append(
            "\n".join(
                [line for line in [
                    f"- visible testcase: {status}",
                    error_line,
                ] if line]
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
            f"- hidden runtime errors: {_text(hidden.get('errors'), '0')}",
        ]
    )


def _format_learning_context(learning: Any) -> str:
    if not isinstance(learning, dict):
        return "Current left-side view: unknown."

    topics = learning.get("topics")
    topic_lines = []
    if isinstance(topics, list):
        topic_lines = [f"- {_text(item)}" for item in topics[:8] if _text(item).strip()]

    return "\n".join(
        [
            f"Current left-side view: {_text(learning.get('view'), 'unknown')}",
            f"Visible page title: {_text(learning.get('title'), 'unknown')}",
            "Visible learning topics:",
            "\n".join(topic_lines) or "- No learning topics provided.",
        ]
    )


def build_tutor_messages(payload: dict[str, Any], tutor_mode: str = "encouraging") -> list[dict[str, str]]:
    message = _text(payload.get("message")).strip()
    if not message:
        raise ValueError("Provide 'message'.")

    problem = payload.get("problem") if isinstance(payload.get("problem"), dict) else {}
    code_state = payload.get("code") if isinstance(payload.get("code"), dict) else {}

    language = _text(code_state.get("language"), "unknown")
    source_code = _truncate(_text(code_state.get("source")))
    editor_status = _text(code_state.get("status"), "unknown")
    editor_output = _truncate(_text(code_state.get("output")), 1500)
    editor_traceback = _truncate(_text(code_state.get("traceback")), 4000)
    solution_request = _is_solution_request(message)
    request_classification = "solution_or_code_request" if solution_request else "normal_tutoring_request"
    if solution_request:
        source_code = "Withheld because the learner is asking for code, final answers, or detailed implementation steps."
        editor_status = "withheld for solution/code request"
        editor_output = "withheld for solution/code request"
        editor_traceback = "withheld for solution/code request"
        test_context = "Withheld because the learner is asking for code, final answers, or detailed implementation steps."
    else:
        test_context = _format_test_state(payload.get("testState"))

    context = _read_prompt_file(USER_TEMPLATE_PATH).format(
        request_classification=request_classification,
        problem_english_name=_text(problem.get("englishName"), "Unknown"),
        problem_chinese_name=_text(problem.get("chineseName"), "Unknown"),
        problem_category=_text(problem.get("category"), "Unknown"),
        problem_difficulty=_text(problem.get("difficulty"), "Unknown"),
        problem_description=_text(problem.get("englishDescription"), "No description provided."),
        public_examples=_format_examples(problem.get("examples")),
        code_language=language,
        source_code=source_code,
        editor_status=editor_status,
        editor_output=editor_output or "empty",
        editor_traceback=editor_traceback or "empty",
        learning_context=_format_learning_context(payload.get("learning")),
        test_state=test_context,
        learner_request=message,
    )

    return [
        {"role": "system", "content": _read_prompt_file(_system_prompt_path(tutor_mode))},
        {"role": "user", "content": context},
    ]
