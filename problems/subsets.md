---
id: subsets
category: Backtracking
difficulty: Medium
englishName: Subsets
chineseName: 子集
methodName: subsets
javascriptFunctionName: subsets
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Return all subsets of distinct numbers. Sort each subset and sort the list of subsets by length, then lexicographically.

## Examples

### Example 1
Input: nums = [1,2,3]
Output: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
### Example 2
Input: nums = [0]
Output: [[],[0]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def subsets(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function subsets(nums) {
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
      [],
      [
        1
      ],
      [
        2
      ],
      [
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        1,
        2,
        3
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        0
      ]
    },
    "expected": [
      [],
      [
        0
      ]
    ]
  },
  {
    "id": "case-3",
    "input": {
      "nums": []
    },
    "expected": [
      []
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        1,
        2
      ]
    },
    "expected": [
      [],
      [
        1
      ],
      [
        2
      ],
      [
        1,
        2
      ]
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
      [],
      [
        2
      ],
      [
        3
      ],
      [
        2,
        3
      ]
    ]
  }
]
```
