---
id: merge_two_sorted_lists
category: Linked List
difficulty: Easy
englishName: Merge Two Sorted Lists
chineseName: 合并两个有序链表
methodName: mergeTwoLists
javascriptFunctionName: mergeTwoLists
validation: exact
inputParams: list1, list2
visibleTestCount: 3
---

## Description

Two sorted linked lists are represented as arrays. Merge them and return one sorted array.

## Examples

### Example 1
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
### Example 2
Input: list1 = [], list2 = []
Output: []

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def mergeTwoLists(self, list1: Any, list2: Any) -> Any:
        #   list1: Any
        #   list2: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function mergeTwoLists(list1, list2) {
  //   list1: unknown
  //   list2: unknown
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
      "list1": [
        1,
        2,
        4
      ],
      "list2": [
        1,
        3,
        4
      ]
    },
    "expected": [
      1,
      1,
      2,
      3,
      4,
      4
    ]
  },
  {
    "id": "case-2",
    "input": {
      "list1": [],
      "list2": []
    },
    "expected": []
  },
  {
    "id": "case-3",
    "input": {
      "list1": [],
      "list2": [
        0
      ]
    },
    "expected": [
      0
    ]
  },
  {
    "id": "case-4",
    "input": {
      "list1": [
        2
      ],
      "list2": [
        1
      ]
    },
    "expected": [
      1,
      2
    ]
  },
  {
    "id": "case-5",
    "input": {
      "list1": [
        -3,
        0,
        4
      ],
      "list2": [
        -2,
        5
      ]
    },
    "expected": [
      -3,
      -2,
      0,
      4,
      5
    ]
  }
]
```
