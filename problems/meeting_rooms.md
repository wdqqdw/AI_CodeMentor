---
id: meeting_rooms
category: Intervals
difficulty: Easy
englishName: Meeting Rooms
chineseName: 会议室
methodName: meetingRooms
javascriptFunctionName: meetingRooms
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Meeting Rooms` in the `Intervals` track. Use the title and tag `Intervals` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Meeting Rooms", "category": "Intervals", "sample": 1}
Output: {"topic": "Meeting Rooms", "category": "Intervals", "sample": 1}

### Example 2
Input: inputData = {"topic": "Meeting Rooms", "category": "Intervals", "sample": 2}
Output: {"topic": "Meeting Rooms", "category": "Intervals", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def meetingRooms(self, inputData: Any) -> Any:
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
function meetingRooms(inputData) {
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
        "topic": "Meeting Rooms",
        "category": "Intervals",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Meeting Rooms",
      "category": "Intervals",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Meeting Rooms",
        "category": "Intervals",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Meeting Rooms",
      "category": "Intervals",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Meeting Rooms",
        "Intervals"
      ]
    },
    "expected": [
      "Meeting Rooms",
      "Intervals"
    ]
  }
]
```
