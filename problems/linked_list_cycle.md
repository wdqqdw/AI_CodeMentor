---
id: linked_list_cycle
category: Linked List
difficulty: Easy
englishName: Linked List Cycle
chineseName: 环形链表
methodName: hasCycle
javascriptFunctionName: hasCycle
validation: exact
inputParams: values, pos
visibleTestCount: 3
---

## Description

A linked list is represented by `values` and `pos`, where `pos` is the index connected by the tail or `-1` if there is no cycle. Return whether a cycle exists.

## Examples

### Example 1
Input: values = [3,2,0,-4], pos = 1
Output: true
### Example 2
Input: values = [1], pos = -1
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def hasCycle(self, values: Any, pos: int) -> Any:
        #   values: Any
        #   pos: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function hasCycle(values, pos) {
  //   values: unknown
  //   pos: number
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
      "values": [
        3,
        2,
        0,
        -4
      ],
      "pos": 1
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "values": [
        1
      ],
      "pos": -1
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "values": [
        1,
        2
      ],
      "pos": 0
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "values": [],
      "pos": -1
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "values": [
        1,
        2,
        3
      ],
      "pos": 2
    },
    "expected": true
  }
]
```
