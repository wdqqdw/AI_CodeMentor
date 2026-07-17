---
id: product_except_self
category: Array & Hashing
difficulty: Medium
englishName: Product of Array Except Self
chineseName: 除自身以外数组的乘积
methodName: productExceptSelf
javascriptFunctionName: productExceptSelf
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Return an array where each position contains the product of all numbers in `nums` except the number at that position. Do not use division.

## Examples

### Example 1
Input: nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]
### Example 2
Input: nums = [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def productExceptSelf(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function productExceptSelf(nums) {
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
        4
      ]
    },
    "expected": [
      24,
      12,
      8,
      6
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        -1,
        1,
        0,
        -3,
        3
      ]
    },
    "expected": [
      0,
      0,
      9,
      0,
      0
    ]
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        2,
        3
      ]
    },
    "expected": [
      3,
      2
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        0,
        0
      ]
    },
    "expected": [
      0,
      0
    ]
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        5,
        1,
        2
      ]
    },
    "expected": [
      2,
      10,
      5
    ]
  }
]
```
