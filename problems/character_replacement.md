---
id: character_replacement
category: Sliding Window
difficulty: Medium
englishName: Longest Repeating Character Replacement
chineseName: 替换后的最长重复字符
methodName: characterReplacement
javascriptFunctionName: characterReplacement
validation: exact
inputParams: s, k
visibleTestCount: 3
---

## Description

Return the length of the longest substring that can become all one repeated character after changing at most `k` characters.

## Examples

### Example 1
Input: s = "ABAB", k = 2
Output: 4
### Example 2
Input: s = "AABABBA", k = 1
Output: 4

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def characterReplacement(self, s: str, k: int) -> Any:
        #   s: str
        #   k: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function characterReplacement(s, k) {
  //   s: string
  //   k: number
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
      "s": "ABAB",
      "k": 2
    },
    "expected": 4
  },
  {
    "id": "case-2",
    "input": {
      "s": "AABABBA",
      "k": 1
    },
    "expected": 4
  },
  {
    "id": "case-3",
    "input": {
      "s": "AAAA",
      "k": 0
    },
    "expected": 4
  },
  {
    "id": "case-4",
    "input": {
      "s": "ABCDE",
      "k": 1
    },
    "expected": 2
  },
  {
    "id": "case-5",
    "input": {
      "s": "BAAAB",
      "k": 2
    },
    "expected": 5
  }
]
```
