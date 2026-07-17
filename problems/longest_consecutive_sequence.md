---
id: longest_consecutive_sequence
category: Array & Hashing
difficulty: Medium
englishName: Longest Consecutive Sequence
chineseName: 最长连续序列
methodName: longestConsecutive
javascriptFunctionName: longestConsecutive
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given an unsorted array, return the length of the longest sequence of consecutive integer values.

## Examples

### Example 1
Input: nums = [100, 4, 200, 1, 3, 2]
Output: 4
### Example 2
Input: nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def longestConsecutive(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function longestConsecutive(nums) {
  //   nums: unknown
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
      "nums": [
        100,
        4,
        200,
        1,
        3,
        2
      ]
    },
    "expected": 4
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        0,
        3,
        7,
        2,
        5,
        8,
        4,
        6,
        0,
        1
      ]
    },
    "expected": 9
  },
  {
    "id": "case-3",
    "input": {
      "nums": []
    },
    "expected": 0
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        1,
        2,
        0,
        1
      ]
    },
    "expected": 3
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        -2,
        -1,
        0,
        2
      ]
    },
    "expected": 3
  }
]
```
