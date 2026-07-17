---
id: contains_duplicate
category: Array & Hashing
difficulty: Easy
englishName: Contains Duplicate
chineseName: 存在重复元素
methodName: containsDuplicate
javascriptFunctionName: containsDuplicate
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given an integer array `nums`, return `true` if any value appears at least twice. Return `false` if every value is distinct.

## Examples

### Example 1
Input: nums = [1, 2, 3, 1]
Output: true
### Example 2
Input: nums = [1, 2, 3, 4]
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def containsDuplicate(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function containsDuplicate(nums) {
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
        1,
        2,
        3,
        1
      ]
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        1,
        2,
        3,
        4
      ]
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        1,
        1,
        1,
        3,
        3,
        4,
        3,
        2,
        4,
        2
      ]
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "nums": []
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        0
      ]
    },
    "expected": false
  },
  {
    "id": "case-6",
    "input": {
      "nums": [
        -1,
        0,
        1,
        -1
      ]
    },
    "expected": true
  }
]
```
