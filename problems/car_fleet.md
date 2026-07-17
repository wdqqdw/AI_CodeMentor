---
id: car_fleet
category: Stack
difficulty: Medium
englishName: Car Fleet
chineseName: 车队
methodName: carFleet
javascriptFunctionName: carFleet
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Car Fleet` in the `Stack` track. Use the title and tag `Stack` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Car Fleet", "category": "Stack", "sample": 1}
Output: {"topic": "Car Fleet", "category": "Stack", "sample": 1}

### Example 2
Input: inputData = {"topic": "Car Fleet", "category": "Stack", "sample": 2}
Output: {"topic": "Car Fleet", "category": "Stack", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def carFleet(self, inputData: Any) -> Any:
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
function carFleet(inputData) {
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
        "topic": "Car Fleet",
        "category": "Stack",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Car Fleet",
      "category": "Stack",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Car Fleet",
        "category": "Stack",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Car Fleet",
      "category": "Stack",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Car Fleet",
        "Stack"
      ]
    },
    "expected": [
      "Car Fleet",
      "Stack"
    ]
  }
]
```
