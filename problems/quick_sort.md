---
id: quick_sort
category: Sorting
difficulty: Medium
englishName: Quick Sort
chineseName: 快速排序
methodName: sortArray
javascriptFunctionName: sortArray
validation: array_exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given an array of integers `nums`, sort the array in ascending order and return the sorted array. Try to implement the idea of quick sort: choose a pivot, partition the remaining values around it, and recursively sort the two sides.

## Examples

### Example 1
Input: nums = [5, 2, 3, 1]
Output: [1, 2, 3, 5]

### Example 2
Input: nums = [5, 1, 1, 2, 0, 0]
Output: [0, 0, 1, 1, 2, 5]

## Starter Code - Python

```python
from typing import List

class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        # Input:
        #   nums: List[int]
        # Output:
        #   List[int] sorted in ascending order
        #
        # Think about how to choose a pivot and partition
        # values smaller/larger than that pivot.
        pass
```

## Starter Code - JavaScript

```javascript
function sortArray(nums) {
  // Input:
  //   nums: number[]
  // Output:
  //   number[] sorted in ascending order
  //
  // Think about how to choose a pivot and partition
  // values smaller/larger than that pivot.
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "nums": [5, 2, 3, 1] }, "expected": [1, 2, 3, 5] },
  { "id": "case-2", "input": { "nums": [5, 1, 1, 2, 0, 0] }, "expected": [0, 0, 1, 1, 2, 5] },
  { "id": "case-3", "input": { "nums": [] }, "expected": [] },
  { "id": "case-4", "input": { "nums": [1] }, "expected": [1] },
  { "id": "case-5", "input": { "nums": [2, 1] }, "expected": [1, 2] },
  { "id": "case-6", "input": { "nums": [-1, 5, 3, 4, 0] }, "expected": [-1, 0, 3, 4, 5] },
  { "id": "case-7", "input": { "nums": [9, 8, 7, 6, 5] }, "expected": [5, 6, 7, 8, 9] },
  { "id": "case-8", "input": { "nums": [1, 2, 3, 4, 5] }, "expected": [1, 2, 3, 4, 5] },
  { "id": "case-9", "input": { "nums": [3, 3, 3, 2, 2, 1] }, "expected": [1, 2, 2, 3, 3, 3] },
  { "id": "case-10", "input": { "nums": [10, -10, 0, 7, -3, 7] }, "expected": [-10, -3, 0, 7, 7, 10] }
]
```
