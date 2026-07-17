---
id: basic_calculator
category: Stack
difficulty: Hard
englishName: Basic Calculator
chineseName: 基本计算器
methodName: basicCalculator
javascriptFunctionName: basicCalculator
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Basic Calculator` in the `Stack` track. Use the title and tag `Stack` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Basic Calculator", "category": "Stack", "sample": 1}
Output: {"topic": "Basic Calculator", "category": "Stack", "sample": 1}

### Example 2
Input: inputData = {"topic": "Basic Calculator", "category": "Stack", "sample": 2}
Output: {"topic": "Basic Calculator", "category": "Stack", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def basicCalculator(self, inputData: Any) -> Any:
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
function basicCalculator(inputData) {
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
        "topic": "Basic Calculator",
        "category": "Stack",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Basic Calculator",
      "category": "Stack",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Basic Calculator",
        "category": "Stack",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Basic Calculator",
      "category": "Stack",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Basic Calculator",
        "Stack"
      ]
    },
    "expected": [
      "Basic Calculator",
      "Stack"
    ]
  }
]
```
