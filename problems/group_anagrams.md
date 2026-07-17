---
id: group_anagrams
category: Array & Hashing
difficulty: Medium
englishName: Group Anagrams
chineseName: 字母异位词分组
methodName: groupAnagrams
javascriptFunctionName: groupAnagrams
validation: exact
inputParams: strs
visibleTestCount: 3
---

## Description

Group strings that are anagrams of one another. For deterministic testing, sort words inside each group and sort groups by their first word.

## Examples

### Example 1
Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
### Example 2
Input: strs = [""]
Output: [[""]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def groupAnagrams(self, strs: Any) -> Any:
        #   strs: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function groupAnagrams(strs) {
  //   strs: unknown
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
      "strs": [
        "eat",
        "tea",
        "tan",
        "ate",
        "nat",
        "bat"
      ]
    },
    "expected": [
      [
        "ate",
        "eat",
        "tea"
      ],
      [
        "bat"
      ],
      [
        "nat",
        "tan"
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "strs": [
        ""
      ]
    },
    "expected": [
      [
        ""
      ]
    ]
  },
  {
    "id": "case-3",
    "input": {
      "strs": [
        "a"
      ]
    },
    "expected": [
      [
        "a"
      ]
    ]
  },
  {
    "id": "case-4",
    "input": {
      "strs": [
        "ab",
        "ba",
        "abc",
        "cab",
        "bca"
      ]
    },
    "expected": [
      [
        "ab",
        "ba"
      ],
      [
        "abc",
        "bca",
        "cab"
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "strs": [
        "no",
        "on",
        "is"
      ]
    },
    "expected": [
      [
        "is"
      ],
      [
        "no",
        "on"
      ]
    ]
  }
]
```
