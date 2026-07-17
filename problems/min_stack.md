---
id: min_stack
category: Stack
difficulty: Medium
englishName: Min Stack
chineseName: 最小栈
methodName: minStack
javascriptFunctionName: minStack
validation: exact
inputParams: operations, values
visibleTestCount: 3
---

## Description

Simulate a stack that supports push, pop, top, and getMin. Return the outputs for `top` and `getMin` operations in order.

## Examples

### Example 1
Input: operations = ["push", "push", "push", "getMin", "pop", "top", "getMin"], values = [-2, 0, -3, null, null, null, null]
Output: [-3, 0, -2]
### Example 2
Input: operations = ["push", "getMin"], values = [1, null]
Output: [1]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def minStack(self, operations: Any, values: Any) -> Any:
        #   operations: Any
        #   values: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function minStack(operations, values) {
  //   operations: unknown
  //   values: unknown
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
      "operations": [
        "push",
        "push",
        "push",
        "getMin",
        "pop",
        "top",
        "getMin"
      ],
      "values": [
        -2,
        0,
        -3,
        null,
        null,
        null,
        null
      ]
    },
    "expected": [
      -3,
      0,
      -2
    ]
  },
  {
    "id": "case-2",
    "input": {
      "operations": [
        "push",
        "getMin"
      ],
      "values": [
        1,
        null
      ]
    },
    "expected": [
      1
    ]
  },
  {
    "id": "case-3",
    "input": {
      "operations": [
        "push",
        "push",
        "top",
        "getMin"
      ],
      "values": [
        2,
        1,
        null,
        null
      ]
    },
    "expected": [
      1,
      1
    ]
  },
  {
    "id": "case-4",
    "input": {
      "operations": [
        "push",
        "push",
        "pop",
        "getMin"
      ],
      "values": [
        5,
        3,
        null,
        null
      ]
    },
    "expected": [
      5
    ]
  },
  {
    "id": "case-5",
    "input": {
      "operations": [
        "push",
        "push",
        "push",
        "getMin"
      ],
      "values": [
        0,
        -1,
        -2,
        null
      ]
    },
    "expected": [
      -2
    ]
  }
]
```
