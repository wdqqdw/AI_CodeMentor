---
id: minimum_window_substring
category: Sliding Window
difficulty: Hard
englishName: Minimum Window Substring
chineseName: 最小覆盖子串
methodName: minWindow
javascriptFunctionName: minWindow
validation: exact
inputParams: s, t
visibleTestCount: 3
---

## Description

Return the shortest substring of `s` that contains every character in `t` with matching multiplicity. Return an empty string if none exists.

## Examples

### Example 1
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
### Example 2
Input: s = "a", t = "aa"
Output: ""

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def minWindow(self, s: str, t: str) -> Any:
        #   s: str
        #   t: str
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function minWindow(s, t) {
  //   s: string
  //   t: string
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
      "s": "ADOBECODEBANC",
      "t": "ABC"
    },
    "expected": "BANC"
  },
  {
    "id": "case-2",
    "input": {
      "s": "a",
      "t": "aa"
    },
    "expected": ""
  },
  {
    "id": "case-3",
    "input": {
      "s": "a",
      "t": "a"
    },
    "expected": "a"
  },
  {
    "id": "case-4",
    "input": {
      "s": "ab",
      "t": "b"
    },
    "expected": "b"
  },
  {
    "id": "case-5",
    "input": {
      "s": "aa",
      "t": "aa"
    },
    "expected": "aa"
  }
]
```
