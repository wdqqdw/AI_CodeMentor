---
id: search_insert_position
category: Binary Search
difficulty: Easy
englishName: Search Insert Position
chineseName: 搜索插入位置
methodName: searchInsert
javascriptFunctionName: searchInsert
validation: exact
inputParams: nums, target
visibleTestCount: 3
---

## Description

Given a sorted array and a target, return the index if found. Otherwise return the index where it should be inserted.

## Examples

### Example 1
Input: nums = [1, 3, 5, 6], target = 5
Output: 2
### Example 2
Input: nums = [1, 3, 5, 6], target = 2
Output: 1

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def searchInsert(self, nums: Any, target: int) -> Any:
        #   nums: Any
        #   target: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function searchInsert(nums, target) {
  //   nums: unknown
  //   target: number
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
        3,
        5,
        6
      ],
      "target": 5
    },
    "expected": 2
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 2
    },
    "expected": 1
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 7
    },
    "expected": 4
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 0
    },
    "expected": 0
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        1
      ],
      "target": 1
    },
    "expected": 0
  }
]
```
