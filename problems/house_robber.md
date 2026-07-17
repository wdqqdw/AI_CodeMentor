---
id: house_robber
category: Dynamic Programming
difficulty: Medium
englishName: House Robber
chineseName: 打家劫舍
methodName: rob
javascriptFunctionName: rob
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given money in a row of houses, return the maximum amount you can rob without robbing adjacent houses.

## Examples

### Example 1
Input: nums = [1,2,3,1]
Output: 4
### Example 2
Input: nums = [2,7,9,3,1]
Output: 12

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def rob(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function rob(nums) {
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
    "expected": 4
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        2,
        7,
        9,
        3,
        1
      ]
    },
    "expected": 12
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
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        2,
        1,
        1,
        2
      ]
    },
    "expected": 4
  }
]
```
