---
id: find_min_rotated_sorted_array
category: Binary Search
difficulty: Medium
englishName: Find Minimum in Rotated Sorted Array
chineseName: 寻找旋转排序数组中的最小值
methodName: findMin
javascriptFunctionName: findMin
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given a rotated sorted array with distinct values, return its minimum value.

## Examples

### Example 1
Input: nums = [3, 4, 5, 1, 2]
Output: 1
### Example 2
Input: nums = [4, 5, 6, 7, 0, 1, 2]
Output: 0

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def findMin(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function findMin(nums) {
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
        3,
        4,
        5,
        1,
        2
      ]
    },
    "expected": 1
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        4,
        5,
        6,
        7,
        0,
        1,
        2
      ]
    },
    "expected": 0
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        11,
        13,
        15,
        17
      ]
    },
    "expected": 11
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        2,
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        1
      ]
    },
    "expected": 1
  }
]
```
