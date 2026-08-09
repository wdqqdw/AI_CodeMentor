---
id: single_letter_finder
category: Warm-up
difficulty: Quiz
englishName: Single Letter Finder
chineseName: 单字母查找
methodName: findLetters
javascriptFunctionName: findLetters
validation: string_set
inputParams: board, words
visibleTestCount: 3
---

## Description

**English description**

This short quiz checks the basic skills needed before Boggle Solver. You receive a 2D board of lowercase letters and a list of candidate `words`. Your task is to return every candidate word that has length exactly `1` and appears somewhere on the board.

Rules:

- Only words with length exactly `1` can be returned.
- A one-letter word is found if that letter appears in any board cell.
- Return each found word once, even if it appears multiple times in `words` or on the board.
- The output order does not matter.
- Ignore empty strings and words longer than `1`.

**中文说明**

这个小测验用于检查做 Boggle Solver 前最基础的编程能力。输入包含一个小写字母组成的二维棋盘 `board`，以及一个候选单词列表 `words`。你的任务是返回所有“长度正好为 1，并且出现在棋盘中”的候选词。

规则：

- 只有长度正好为 `1` 的字符串可以被返回。
- 如果某个单字母字符串的字母出现在棋盘任意格子里，就算找到。
- 同一个答案只返回一次，即使它在 `words` 或棋盘里出现多次。
- 输出顺序不重要。
- 空字符串和长度大于 `1` 的字符串都要忽略。

## Examples

### Example 1
Input: board = [["a","b"],["c","d"]], words = ["a", "d", "z", "ab"]
Output: ["a", "d"]

### Example 2
Input: board = [["x","x"],["y","z"]], words = ["x", "x", "y", "", "zz"]
Output: ["x", "y"]

## Starter Code - Python

```python
from typing import List

class Solution:
    def findLetters(self, board: List[List[str]], words: List[str]) -> List[str]:
        # Input:
        #   board: List[List[str]]
        #   words: List[str]
        # Output:
        #   Every one-letter word that appears on the board.
        #
        # Think about:
        #   1. How to visit every cell in a 2D board.
        #   2. How to check whether a candidate word has length 1.
        #   3. How to avoid returning duplicates.
        return []
```

## Starter Code - JavaScript

```javascript
function findLetters(board, words) {
  // Input:
  //   board: string[][]
  //   words: string[]
  // Output:
  //   Every one-letter word that appears on the board.
  return [];
}
```

## Tests

```json
[
  {"id":"quiz-1","input":{"board":[["a","b"],["c","d"]],"words":["a","d","z","ab"]},"expected":["a","d"]},
  {"id":"quiz-2","input":{"board":[["x","x"],["y","z"]],"words":["x","x","y","","zz"]},"expected":["x","y"]},
  {"id":"quiz-3","input":{"board":[["m","n","o"]],"words":["m","o","p","mo",""]},"expected":["m","o"]},
  {"id":"quiz-4","input":{"board":[["q"],["r"],["s"]],"words":["q","s","t","qr"]},"expected":["q","s"]},
  {"id":"quiz-5","input":{"board":[["a","a"],["a","b"]],"words":["a","b","a","aa","c"]},"expected":["a","b"]},
  {"id":"quiz-6","input":{"board":[],"words":["a","b"]},"expected":[]},
  {"id":"quiz-7","input":{"board":[[]],"words":["a",""]},"expected":[]},
  {"id":"quiz-8","input":{"board":[["h","e","l","l","o"]],"words":["h","e","l","o","hello"]},"expected":["e","h","l","o"]},
  {"id":"quiz-9","input":{"board":[["c","o"],["d","e"],["x","y"]],"words":["c","d","e","x","y","code",""]},"expected":["c","d","e","x","y"]},
  {"id":"quiz-10","input":{"board":[["u","v","w"],["x","y","z"]],"words":["a","u","v","w","x","y","z","uv"]},"expected":["u","v","w","x","y","z"]}
]
```
