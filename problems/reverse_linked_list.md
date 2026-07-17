---
id: reverse_linked_list
category: Linked List
difficulty: Easy
englishName: Reverse Linked List
chineseName: 反转链表
methodName: reverseList
javascriptFunctionName: reverseList
validation: exact
inputParams: head
visibleTestCount: 3
---

## Description

In this practice version, a linked list is represented as an array. Return the values in reversed order.

## Examples

### Example 1
Input: head = [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
### Example 2
Input: head = [1, 2]
Output: [2, 1]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def reverseList(self, head: Any) -> Any:
        #   head: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function reverseList(head) {
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
        4,
        5
      ]
    },
    "expected": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": "case-2",
    "input": {
      "head": [
        1,
        2
      ]
    },
    "expected": [
      2,
      1
    ]
  },
  {
    "id": "case-3",
    "input": {
      "head": []
    },
    "expected": []
  },
  {
    "id": "case-4",
    "input": {
      "head": [
        7
      ]
    },
    "expected": [
      7
    ]
  },
  {
    "id": "case-5",
    "input": {
      "head": [
        0,
        -1,
        3
      ]
    },
    "expected": [
      3,
      -1,
      0
    ]
  }
]
```
