---
id: two_sum_ii
category: Two Pointers
difficulty: Easy
englishName: Two Sum II
chineseName: 两数之和 II
methodName: twoSum
javascriptFunctionName: twoSum
validation: exact
inputParams: numbers, target
visibleTestCount: 3
---

## Description

Given a sorted array `numbers`, return the 1-indexed positions of two numbers whose sum equals `target`.

## Examples

### Example 1
Input: numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
### Example 2
Input: numbers = [2, 3, 4], target = 6
Output: [1, 3]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def twoSum(self, numbers: Any, target: int) -> Any:
        #   numbers: Any
        #   target: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function twoSum(numbers, target) {
  //   numbers: unknown
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
      "numbers": [
        2,
        7,
        11,
        15
      ],
      "target": 9
    },
    "expected": [
      1,
      2
    ]
  },
  {
    "id": "case-2",
    "input": {
      "numbers": [
        2,
        3,
        4
      ],
      "target": 6
    },
    "expected": [
      1,
      3
    ]
  },
  {
    "id": "case-3",
    "input": {
      "numbers": [
        -1,
        0
      ],
      "target": -1
    },
    "expected": [
      1,
      2
    ]
  },
  {
    "id": "case-4",
    "input": {
      "numbers": [
        1,
        2,
        3,
        4,
        4,
        9
      ],
      "target": 8
    },
    "expected": [
      4,
      5
    ]
  },
  {
    "id": "case-5",
    "input": {
      "numbers": [
        5,
        25,
        75
      ],
      "target": 100
    },
    "expected": [
      2,
      3
    ]
  }
]
```
