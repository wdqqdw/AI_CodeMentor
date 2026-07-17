---
id: word_search
category: Backtracking
difficulty: Medium
englishName: Word Search
chineseName: 单词搜索
methodName: exist
javascriptFunctionName: exist
validation: exact
inputParams: board, word
visibleTestCount: 3
---

## Description

Given a 2D board of letters and a word, return whether the word can be built from adjacent cells without reusing a cell.

## Examples

### Example 1
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
### Example 2
Input: board = [["A","B"],["C","D"]], word = "ABCD"
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def exist(self, board: Any, word: str) -> Any:
        #   board: Any
        #   word: str
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function exist(board, word) {
  //   board: unknown
  //   word: string
  // Output:
  //   Return the required result for this problem.
  //
  // Start with the examples, then think about the core pattern.
}
```

## Tests

```json
[
  {
    "id": "case-1",
    "input": {
      "board": [
        [
          "A",
          "B",
          "C",
          "E"
        ],
        [
          "S",
          "F",
          "C",
          "S"
        ],
        [
          "A",
          "D",
          "E",
          "E"
        ]
      ],
      "word": "ABCCED"
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "board": [
        [
          "A",
          "B"
        ],
        [
          "C",
          "D"
        ]
      ],
      "word": "ABCD"
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "board": [
        [
          "A"
        ]
      ],
      "word": "A"
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "board": [
        [
          "A"
        ]
      ],
      "word": "B"
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "board": [
        [
          "C",
          "A",
          "A"
        ],
        [
          "A",
          "A",
          "A"
        ],
        [
          "B",
          "C",
          "D"
        ]
      ],
      "word": "AAB"
    },
    "expected": true
  }
]
```
