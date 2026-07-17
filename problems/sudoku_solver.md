---
id: sudoku_solver
category: Backtracking
difficulty: Hard
englishName: Sudoku Solver
chineseName: 解数独
methodName: sudokuSolver
javascriptFunctionName: sudokuSolver
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Sudoku Solver` in the `Backtracking` track. Use the title and tag `DFS` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Sudoku Solver", "category": "Backtracking", "sample": 1}
Output: {"topic": "Sudoku Solver", "category": "Backtracking", "sample": 1}

### Example 2
Input: inputData = {"topic": "Sudoku Solver", "category": "Backtracking", "sample": 2}
Output: {"topic": "Sudoku Solver", "category": "Backtracking", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def sudokuSolver(self, inputData: Any) -> Any:
        # Input:
        #   inputData: draft payload for this practice page
        # Output:
        #   Return the required result for this problem.
        #
        # This draft page keeps the workflow available while
        # the detailed statement and hidden tests are refined.
        pass
```

## Starter Code - JavaScript

```javascript
function sudokuSolver(inputData) {
  // Input:
  //   inputData: draft payload for this practice page
  // Output:
  //   Return the required result for this problem.
}
```

## Tests

```json
[
  {
    "id": "case-1",
    "input": {
      "inputData": {
        "topic": "Sudoku Solver",
        "category": "Backtracking",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Sudoku Solver",
      "category": "Backtracking",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Sudoku Solver",
        "category": "Backtracking",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Sudoku Solver",
      "category": "Backtracking",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Sudoku Solver",
        "DFS"
      ]
    },
    "expected": [
      "Sudoku Solver",
      "DFS"
    ]
  }
]
```
