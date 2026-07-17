---
id: online_stock_span
category: Stack
difficulty: Medium
englishName: Online Stock Span
chineseName: 股票价格跨度
methodName: onlineStockSpan
javascriptFunctionName: onlineStockSpan
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Online Stock Span` in the `Stack` track. Use the title and tag `Monotonic Stack` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Online Stock Span", "category": "Stack", "sample": 1}
Output: {"topic": "Online Stock Span", "category": "Stack", "sample": 1}

### Example 2
Input: inputData = {"topic": "Online Stock Span", "category": "Stack", "sample": 2}
Output: {"topic": "Online Stock Span", "category": "Stack", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def onlineStockSpan(self, inputData: Any) -> Any:
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
function onlineStockSpan(inputData) {
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
        "topic": "Online Stock Span",
        "category": "Stack",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Online Stock Span",
      "category": "Stack",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Online Stock Span",
        "category": "Stack",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Online Stock Span",
      "category": "Stack",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Online Stock Span",
        "Monotonic Stack"
      ]
    },
    "expected": [
      "Online Stock Span",
      "Monotonic Stack"
    ]
  }
]
```
