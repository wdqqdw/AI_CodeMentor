---
id: flatten_multilevel_list
category: Linked List
difficulty: Medium
englishName: Flatten a Multilevel Doubly Linked List
chineseName: 扁平化多级双向链表
methodName: flattenMultilevelList
javascriptFunctionName: flattenMultilevelList
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Flatten a Multilevel Doubly Linked List` in the `Linked List` track. Use the title and tag `DFS` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Flatten a Multilevel Doubly Linked List", "category": "Linked List", "sample": 1}
Output: {"topic": "Flatten a Multilevel Doubly Linked List", "category": "Linked List", "sample": 1}

### Example 2
Input: inputData = {"topic": "Flatten a Multilevel Doubly Linked List", "category": "Linked List", "sample": 2}
Output: {"topic": "Flatten a Multilevel Doubly Linked List", "category": "Linked List", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def flattenMultilevelList(self, inputData: Any) -> Any:
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
function flattenMultilevelList(inputData) {
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
        "topic": "Flatten a Multilevel Doubly Linked List",
        "category": "Linked List",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Flatten a Multilevel Doubly Linked List",
      "category": "Linked List",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Flatten a Multilevel Doubly Linked List",
        "category": "Linked List",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Flatten a Multilevel Doubly Linked List",
      "category": "Linked List",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Flatten a Multilevel Doubly Linked List",
        "DFS"
      ]
    },
    "expected": [
      "Flatten a Multilevel Doubly Linked List",
      "DFS"
    ]
  }
]
```
