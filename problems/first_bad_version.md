---
id: first_bad_version
category: Binary Search
difficulty: Easy
englishName: First Bad Version
chineseName: 第一个错误版本
methodName: firstBadVersion
javascriptFunctionName: firstBadVersion
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `First Bad Version` in the `Binary Search` track. Use the title and tag `Binary Search` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "First Bad Version", "category": "Binary Search", "sample": 1}
Output: {"topic": "First Bad Version", "category": "Binary Search", "sample": 1}

### Example 2
Input: inputData = {"topic": "First Bad Version", "category": "Binary Search", "sample": 2}
Output: {"topic": "First Bad Version", "category": "Binary Search", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def firstBadVersion(self, inputData: Any) -> Any:
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
function firstBadVersion(inputData) {
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
        "topic": "First Bad Version",
        "category": "Binary Search",
        "sample": 1
      }
    },
    "expected": {
      "topic": "First Bad Version",
      "category": "Binary Search",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "First Bad Version",
        "category": "Binary Search",
        "sample": 2
      }
    },
    "expected": {
      "topic": "First Bad Version",
      "category": "Binary Search",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "First Bad Version",
        "Binary Search"
      ]
    },
    "expected": [
      "First Bad Version",
      "Binary Search"
    ]
  }
]
```
