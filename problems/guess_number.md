---
id: guess_number
category: Binary Search
difficulty: Easy
englishName: Guess Number Higher or Lower
chineseName: 猜数字大小
methodName: guessNumber
javascriptFunctionName: guessNumber
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Guess Number Higher or Lower` in the `Binary Search` track. Use the title and tag `Binary Search` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Guess Number Higher or Lower", "category": "Binary Search", "sample": 1}
Output: {"topic": "Guess Number Higher or Lower", "category": "Binary Search", "sample": 1}

### Example 2
Input: inputData = {"topic": "Guess Number Higher or Lower", "category": "Binary Search", "sample": 2}
Output: {"topic": "Guess Number Higher or Lower", "category": "Binary Search", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def guessNumber(self, inputData: Any) -> Any:
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
function guessNumber(inputData) {
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
        "topic": "Guess Number Higher or Lower",
        "category": "Binary Search",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Guess Number Higher or Lower",
      "category": "Binary Search",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Guess Number Higher or Lower",
        "category": "Binary Search",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Guess Number Higher or Lower",
      "category": "Binary Search",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Guess Number Higher or Lower",
        "Binary Search"
      ]
    },
    "expected": [
      "Guess Number Higher or Lower",
      "Binary Search"
    ]
  }
]
```
