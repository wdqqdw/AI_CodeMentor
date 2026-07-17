---
id: longest_substring_without_repeating
category: Sliding Window
difficulty: Medium
englishName: Longest Substring Without Repeating Characters
chineseName: 无重复字符的最长子串
methodName: lengthOfLongestSubstring
javascriptFunctionName: lengthOfLongestSubstring
validation: exact
inputParams: s
visibleTestCount: 3
---

## Description

Return the length of the longest substring of `s` that contains no repeated characters.

## Examples

### Example 1
Input: s = "abcabcbb"
Output: 3
### Example 2
Input: s = "bbbbb"
Output: 1

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> Any:
        #   s: str
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function lengthOfLongestSubstring(s) {
  //   s: string
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
      "s": "abcabcbb"
    },
    "expected": 3
  },
  {
    "id": "case-2",
    "input": {
      "s": "bbbbb"
    },
    "expected": 1
  },
  {
    "id": "case-3",
    "input": {
      "s": "pwwkew"
    },
    "expected": 3
  },
  {
    "id": "case-4",
    "input": {
      "s": ""
    },
    "expected": 0
  },
  {
    "id": "case-5",
    "input": {
      "s": "dvdf"
    },
    "expected": 3
  }
]
```
