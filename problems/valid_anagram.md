---
id: valid_anagram
category: Array & Hashing
difficulty: Easy
englishName: Valid Anagram
chineseName: 有效字母异位词
methodName: isAnagram
javascriptFunctionName: isAnagram
validation: exact
inputParams: s, t
visibleTestCount: 3
---

## Description

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`. Otherwise return `false`.

## Examples

### Example 1
Input: s = "anagram", t = "nagaram"
Output: true
### Example 2
Input: s = "rat", t = "car"
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def isAnagram(self, s: str, t: str) -> Any:
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
function isAnagram(s, t) {
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
      "s": "anagram",
      "t": "nagaram"
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "s": "rat",
      "t": "car"
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "s": "",
      "t": ""
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "s": "a",
      "t": "ab"
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "s": "listen",
      "t": "silent"
    },
    "expected": true
  },
  {
    "id": "case-6",
    "input": {
      "s": "aacc",
      "t": "ccac"
    },
    "expected": false
  }
]
```
