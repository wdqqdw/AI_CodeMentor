---
id: two_sum
category: Array & Hashing
difficulty: Easy
englishName: Two Sum
chineseName: 两数之和
methodName: twoSum
javascriptFunctionName: twoSum
validation: two_sum_indices
inputParams: nums, target
visibleTestCount: 3
---

## Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input has exactly one solution, and you may not use the same element twice.

## Examples

### Example 1
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]

### Example 2
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]

## Starter Code - Python

```python
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Input:
        #   nums: List[int]
        #   target: int
        # Output:
        #   List[int] with the two indices
        #
        # Think about what information you need to remember
        # while scanning nums.
        pass
```

## Starter Code - JavaScript

```javascript
function twoSum(nums, target) {
  // Input:
  //   nums: number[]
  //   target: number
  // Output:
  //   number[] with the two indices
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1] },
  { "id": "case-2", "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2] },
  { "id": "case-3", "input": { "nums": [3, 3], "target": 6 }, "expected": [0, 1] },
  { "id": "case-4", "input": { "nums": [0, 4, 3, 0], "target": 0 }, "expected": [0, 3] },
  { "id": "case-5", "input": { "nums": [-1, -2, -3, -4, -5], "target": -8 }, "expected": [2, 4] },
  { "id": "case-6", "input": { "nums": [1, 5, 3, 9, 2], "target": 11 }, "expected": [3, 4] },
  { "id": "case-7", "input": { "nums": [10, -3, 4, 7], "target": 1 }, "expected": [1, 2] },
  { "id": "case-8", "input": { "nums": [100, 20, 30, 40], "target": 70 }, "expected": [2, 3] },
  { "id": "case-9", "input": { "nums": [5, 75, 25], "target": 100 }, "expected": [1, 2] },
  { "id": "case-10", "input": { "nums": [1, 2, 3, 4, 5, 6], "target": 10 }, "expected": [3, 5] }
]
```
