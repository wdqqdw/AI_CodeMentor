---
id: combination_sum
category: Backtracking
difficulty: Medium
englishName: Combination Sum
chineseName: 组合总和
methodName: combinationSum
javascriptFunctionName: combinationSum
validation: exact
inputParams: candidates, target
visibleTestCount: 3
---

## Description

Return unique combinations where candidate numbers sum to `target`. A candidate can be reused. Sort each combination and sort the list lexicographically.

## Examples

### Example 1
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
### Example 2
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def combinationSum(self, candidates: Any, target: int) -> Any:
        #   candidates: Any
        #   target: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function combinationSum(candidates, target) {
  //   candidates: unknown
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
      "candidates": [
        2,
        3,
        6,
        7
      ],
      "target": 7
    },
    "expected": [
      [
        2,
        2,
        3
      ],
      [
        7
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "candidates": [
        2,
        3,
        5
      ],
      "target": 8
    },
    "expected": [
      [
        2,
        2,
        2,
        2
      ],
      [
        2,
        3,
        3
      ],
      [
        3,
        5
      ]
    ]
  },
  {
    "id": "case-3",
    "input": {
      "candidates": [
        2
      ],
      "target": 1
    },
    "expected": []
  },
  {
    "id": "case-4",
    "input": {
      "candidates": [
        1
      ],
      "target": 2
    },
    "expected": [
      [
        1,
        1
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "candidates": [
        2,
        7,
        6,
        3,
        5,
        1
      ],
      "target": 9
    },
    "expected": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        3
      ],
      [
        1,
        1,
        1,
        1,
        1,
        2,
        2
      ],
      [
        1,
        1,
        1,
        1,
        2,
        3
      ],
      [
        1,
        1,
        1,
        1,
        5
      ],
      [
        1,
        1,
        1,
        2,
        2,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        1,
        6
      ],
      [
        1,
        1,
        2,
        2,
        3
      ],
      [
        1,
        1,
        2,
        5
      ],
      [
        1,
        1,
        7
      ],
      [
        1,
        2,
        2,
        2,
        2
      ],
      [
        1,
        2,
        3,
        3
      ],
      [
        1,
        2,
        6
      ],
      [
        1,
        3,
        5
      ],
      [
        2,
        2,
        2,
        3
      ],
      [
        2,
        2,
        5
      ],
      [
        2,
        7
      ],
      [
        3,
        3,
        3
      ],
      [
        3,
        6
      ]
    ]
  }
]
```
