---
id: employee_free_time
category: Intervals
difficulty: Hard
englishName: Employee Free Time
chineseName: 员工空闲时间
methodName: employeeFreeTime
javascriptFunctionName: employeeFreeTime
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Employee Free Time` in the `Intervals` track. Use the title and tag `Heap` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Employee Free Time", "category": "Intervals", "sample": 1}
Output: {"topic": "Employee Free Time", "category": "Intervals", "sample": 1}

### Example 2
Input: inputData = {"topic": "Employee Free Time", "category": "Intervals", "sample": 2}
Output: {"topic": "Employee Free Time", "category": "Intervals", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def employeeFreeTime(self, inputData: Any) -> Any:
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
function employeeFreeTime(inputData) {
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
        "topic": "Employee Free Time",
        "category": "Intervals",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Employee Free Time",
      "category": "Intervals",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Employee Free Time",
        "category": "Intervals",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Employee Free Time",
      "category": "Intervals",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Employee Free Time",
        "Heap"
      ]
    },
    "expected": [
      "Employee Free Time",
      "Heap"
    ]
  }
]
```
