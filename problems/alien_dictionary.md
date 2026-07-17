---
id: alien_dictionary
category: Graphs
difficulty: Hard
englishName: Alien Dictionary
chineseName: 外星文字典
methodName: alienDictionary
javascriptFunctionName: alienDictionary
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Alien Dictionary` in the `Graphs` track. Use the title and tag `Topological Sort` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Alien Dictionary", "category": "Graphs", "sample": 1}
Output: {"topic": "Alien Dictionary", "category": "Graphs", "sample": 1}

### Example 2
Input: inputData = {"topic": "Alien Dictionary", "category": "Graphs", "sample": 2}
Output: {"topic": "Alien Dictionary", "category": "Graphs", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def alienDictionary(self, inputData: Any) -> Any:
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
function alienDictionary(inputData) {
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
        "topic": "Alien Dictionary",
        "category": "Graphs",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Alien Dictionary",
      "category": "Graphs",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Alien Dictionary",
        "category": "Graphs",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Alien Dictionary",
      "category": "Graphs",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Alien Dictionary",
        "Topological Sort"
      ]
    },
    "expected": [
      "Alien Dictionary",
      "Topological Sort"
    ]
  }
]
```
