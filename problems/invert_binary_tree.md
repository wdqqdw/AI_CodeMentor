---
id: invert_binary_tree
category: Trees
difficulty: Easy
englishName: Invert Binary Tree
chineseName: 翻转二叉树
methodName: invertTree
javascriptFunctionName: invertTree
validation: exact
inputParams: root
visibleTestCount: 3
---

## Description

A binary tree is represented by a level-order array. Return the level-order array after swapping every left and right child.

## Examples

### Example 1
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
### Example 2
Input: root = [2,1,3]
Output: [2,3,1]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def invertTree(self, root: Any) -> Any:
        #   root: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function invertTree(root) {
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
        4,
        2,
        7,
        1,
        3,
        6,
        9
      ]
    },
    "expected": [
      4,
      7,
      2,
      9,
      6,
      3,
      1
    ]
  },
  {
    "id": "case-2",
    "input": {
      "root": [
        2,
        1,
        3
      ]
    },
    "expected": [
      2,
      3,
      1
    ]
  },
  {
    "id": "case-3",
    "input": {
      "root": []
    },
    "expected": []
  },
  {
    "id": "case-4",
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
    "id": "case-5",
    "input": {
      "root": [
        1,
        2
      ]
    },
    "expected": [
      1,
      null,
      2
    ]
  }
]
```
