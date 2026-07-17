---
id: number_of_islands
category: Graphs
difficulty: Medium
englishName: Number of Islands
chineseName: 岛屿数量
methodName: numIslands
javascriptFunctionName: numIslands
validation: exact
inputParams: grid
visibleTestCount: 3
---

## Description

Given a grid of `"1"` land and `"0"` water, count connected islands using horizontal and vertical adjacency.

## Examples

### Example 1
Input: grid = [["1","1","1"],["0","1","0"],["1","1","1"]]
Output: 1
### Example 2
Input: grid = [["1","0","1"],["0","1","0"],["1","0","1"]]
Output: 5

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def numIslands(self, grid: Any) -> Any:
        #   grid: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function numIslands(grid) {
  //   grid: unknown
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
      "grid": [
        [
          "1",
          "1",
          "1"
        ],
        [
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "1",
          "1"
        ]
      ]
    },
    "expected": 1
  },
  {
    "id": "case-2",
    "input": {
      "grid": [
        [
          "1",
          "0",
          "1"
        ],
        [
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "1"
        ]
      ]
    },
    "expected": 5
  },
  {
    "id": "case-3",
    "input": {
      "grid": []
    },
    "expected": 0
  },
  {
    "id": "case-4",
    "input": {
      "grid": [
        [
          "0"
        ]
      ]
    },
    "expected": 0
  },
  {
    "id": "case-5",
    "input": {
      "grid": [
        [
          "1",
          "1",
          "0"
        ],
        [
          "0",
          "1",
          "0"
        ],
        [
          "1",
          "0",
          "1"
        ]
      ]
    },
    "expected": 3
  }
]
```
