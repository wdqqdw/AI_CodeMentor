---
id: serialize_deserialize_binary_tree
category: Trees
difficulty: Hard
englishName: Serialize and Deserialize Binary Tree
chineseName: 二叉树的序列化与反序列化
methodName: serializeDeserialize
javascriptFunctionName: serializeDeserialize
validation: exact
inputParams: root
visibleTestCount: 3
---

## Description

A binary tree is represented by a level-order array. Return a stable serialized-deserialized level-order array with trailing `null` values removed.

## Examples

### Example 1
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
### Example 2
Input: root = []
Output: []

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def serializeDeserialize(self, root: Any) -> Any:
        #   root: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function serializeDeserialize(root) {
  //   root: unknown
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
      "root": [
        1,
        2,
        3,
        null,
        null,
        4,
        5
      ]
    },
    "expected": [
      1,
      2,
      3,
      null,
      null,
      4,
      5
    ]
  },
  {
    "id": "case-2",
    "input": {
      "root": []
    },
    "expected": []
  },
  {
    "id": "case-3",
    "input": {
      "root": [
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
      "root": [
        1,
        null,
        2,
        null,
        null,
        3
      ]
    },
    "expected": [
      1,
      null,
      2,
      null,
      null,
      3
    ]
  },
  {
    "id": "case-5",
    "input": {
      "root": [
        1,
        2,
        null,
        null,
        null
      ]
    },
    "expected": [
      1,
      2
    ]
  }
]
```
