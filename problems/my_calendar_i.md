---
id: my_calendar_i
category: Intervals
difficulty: Medium
englishName: My Calendar I
chineseName: 我的日程安排表 I
methodName: myCalendarI
javascriptFunctionName: myCalendarI
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `My Calendar I` in the `Intervals` track. Use the title and tag `Design` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "My Calendar I", "category": "Intervals", "sample": 1}
Output: {"topic": "My Calendar I", "category": "Intervals", "sample": 1}

### Example 2
Input: inputData = {"topic": "My Calendar I", "category": "Intervals", "sample": 2}
Output: {"topic": "My Calendar I", "category": "Intervals", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def myCalendarI(self, inputData: Any) -> Any:
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
function myCalendarI(inputData) {
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
        "topic": "My Calendar I",
        "category": "Intervals",
        "sample": 1
      }
    },
    "expected": {
      "topic": "My Calendar I",
      "category": "Intervals",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "My Calendar I",
        "category": "Intervals",
        "sample": 2
      }
    },
    "expected": {
      "topic": "My Calendar I",
      "category": "Intervals",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "My Calendar I",
        "Design"
      ]
    },
    "expected": [
      "My Calendar I",
      "Design"
    ]
  }
]
```
