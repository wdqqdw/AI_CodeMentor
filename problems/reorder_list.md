---
id: reorder_list
category: Linked List
difficulty: Medium
englishName: Reorder List
chineseName: 重排链表
methodName: reorderList
javascriptFunctionName: reorderList
validation: exact
inputParams: head
visibleTestCount: 3
---

## Description

A linked list is represented as an array. Reorder it as first, last, second, second-last, and so on, then return the reordered values.

## Examples

### Example 1
Input: head = [1, 2, 3, 4]
Output: [1, 4, 2, 3]
### Example 2
Input: head = [1, 2, 3, 4, 5]
Output: [1, 5, 2, 4, 3]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def reorderList(self, head: Any) -> Any:
        #   head: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function reorderList(head) {
  //   head: unknown
  // Output:
  //   Return the required result for this problem.
  //
  // Start with the examples, then think about the core pattern.
}
```

## Tests

```json
[
  {
    "id": "case-1",
    "input": {
      "head": [
        1,
        2,
        3,
        4
      ]
    },
    "expected": [
      1,
      4,
      2,
      3
    ]
  },
  {
    "id": "case-2",
    "input": {
      "head": [
        1,
        2,
        3,
        4,
        5
      ]
    },
    "expected": [
      1,
      5,
      2,
      4,
      3
    ]
  },
  {
    "id": "case-3",
    "input": {
      "head": [
        1
      ]
    },
    "expected": [
      1
    ]
  },
  {
    "id": "case-4",
    "input": {
      "head": []
    },
    "expected": []
  },
  {
    "id": "case-5",
    "input": {
      "head": [
        1,
        2
      ]
    },
    "expected": [
      1,
      2
    ]
  }
]
```
