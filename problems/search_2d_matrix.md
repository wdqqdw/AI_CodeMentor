---
id: search_2d_matrix
category: Binary Search
difficulty: Medium
englishName: Search a 2D Matrix
chineseName: 搜索二维矩阵
methodName: searchMatrix
javascriptFunctionName: searchMatrix
validation: exact
inputParams: matrix, target
visibleTestCount: 3
---

## Description

Given a matrix where each row is sorted and the first value of each row is greater than the last value of the previous row, return whether `target` exists.

## Examples

### Example 1
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
### Example 2
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def searchMatrix(self, matrix: Any, target: int) -> Any:
        #   matrix: Any
        #   target: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function searchMatrix(matrix, target) {
  //   matrix: unknown
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
      "matrix": [
        [
          1,
          3,
          5,
          7
        ],
        [
          10,
          11,
          16,
          20
        ],
        [
          23,
          30,
          34,
          60
        ]
      ],
      "target": 3
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "matrix": [
        [
          1,
          3,
          5,
          7
        ],
        [
          10,
          11,
          16,
          20
        ],
        [
          23,
          30,
          34,
          60
        ]
      ],
      "target": 13
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "matrix": [
        [
          1
        ]
      ],
      "target": 1
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "matrix": [
        [
          1
        ]
      ],
      "target": 2
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "matrix": [
        [
          1,
          2,
          3
        ],
        [
          4,
          5,
          6
        ]
      ],
      "target": 6
    },
    "expected": true
  }
]
```
