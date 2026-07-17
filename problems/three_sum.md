---
id: three_sum
category: Two Pointers
difficulty: Medium
englishName: 3Sum
chineseName: 三数之和
methodName: threeSum
javascriptFunctionName: threeSum
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Return all unique triplets `[a, b, c]` such that `a + b + c = 0`. Sort each triplet and sort the list of triplets lexicographically.

## Examples

### Example 1
Input: nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
### Example 2
Input: nums = [0, 1, 1]
Output: []

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def threeSum(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function threeSum(nums) {
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
        -1,
        0,
        1,
        2,
        -1,
        -4
      ]
    },
    "expected": [
      [
        -1,
        -1,
        2
      ],
      [
        -1,
        0,
        1
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        0,
        1,
        1
      ]
    },
    "expected": []
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        0,
        0,
        0
      ]
    },
    "expected": [
      [
        0,
        0,
        0
      ]
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        -2,
        0,
        1,
        1,
        2
      ]
    },
    "expected": [
      [
        -2,
        0,
        2
      ],
      [
        -2,
        1,
        1
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "nums": []
    },
    "expected": []
  }
]
```
