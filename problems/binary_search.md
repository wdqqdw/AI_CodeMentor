---
id: binary_search
category: Binary Search
difficulty: Easy
englishName: Binary Search
chineseName: 二分查找
methodName: search
javascriptFunctionName: search
validation: exact
inputParams: nums, target
visibleTestCount: 3
---

## Description

Given a sorted array of integers `nums` and an integer `target`, return the index of `target`. If `target` does not exist in the array, return `-1`. Aim for `O(log n)` time.

## Examples

### Example 1
Input: nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4

### Example 2
Input: nums = [-1, 0, 3, 5, 9, 12], target = 2
Output: -1

## Starter Code - Python

```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Input:
        #   nums: sorted List[int]
        #   target: int
        # Output:
        #   index of target, or -1 if missing
        #
        # Think about how left, right, and mid should move.
        pass
```

## Starter Code - JavaScript

```javascript
function search(nums, target) {
  // Input:
  //   nums: sorted number[]
  //   target: number
  // Output:
  //   index of target, or -1 if missing
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "nums": [-1, 0, 3, 5, 9, 12], "target": 9 }, "expected": 4 },
  { "id": "case-2", "input": { "nums": [-1, 0, 3, 5, 9, 12], "target": 2 }, "expected": -1 },
  { "id": "case-3", "input": { "nums": [1], "target": 1 }, "expected": 0 },
  { "id": "case-4", "input": { "nums": [1], "target": 0 }, "expected": -1 },
  { "id": "case-5", "input": { "nums": [1, 3, 5, 7], "target": 1 }, "expected": 0 },
  { "id": "case-6", "input": { "nums": [1, 3, 5, 7], "target": 7 }, "expected": 3 },
  { "id": "case-7", "input": { "nums": [1, 3, 5, 7], "target": 4 }, "expected": -1 },
  { "id": "case-8", "input": { "nums": [-10, -3, 0, 4, 8], "target": -3 }, "expected": 1 },
  { "id": "case-9", "input": { "nums": [], "target": 5 }, "expected": -1 },
  { "id": "case-10", "input": { "nums": [2, 4, 6, 8, 10, 12], "target": 10 }, "expected": 4 }
]
```
