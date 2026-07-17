---
id: permutations
category: Backtracking
difficulty: Medium
englishName: Permutations
chineseName: 全排列
methodName: permute
javascriptFunctionName: permute
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Return all permutations of distinct numbers, sorted lexicographically.

## Examples

### Example 1
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
### Example 2
Input: nums = [0,1]
Output: [[0,1],[1,0]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def permute(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function permute(nums) {
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
        3
      ]
    },
    "expected": [
      [
        1,
        2,
        3
      ],
      [
        1,
        3,
        2
      ],
      [
        2,
        1,
        3
      ],
      [
        2,
        3,
        1
      ],
      [
        3,
        1,
        2
      ],
      [
        3,
        2,
        1
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        0,
        1
      ]
    },
    "expected": [
      [
        0,
        1
      ],
      [
        1,
        0
      ]
    ]
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        1
      ]
    },
    "expected": [
      [
        1
      ]
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": []
    },
    "expected": [
      []
    ]
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        2,
        3
      ]
    },
    "expected": [
      [
        2,
        3
      ],
      [
        3,
        2
      ]
    ]
  }
]
```
