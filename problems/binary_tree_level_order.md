---
id: binary_tree_level_order
category: Trees
difficulty: Medium
englishName: Binary Tree Level Order Traversal
chineseName: 二叉树层序遍历
methodName: levelOrder
javascriptFunctionName: levelOrder
validation: exact
inputParams: root
visibleTestCount: 3
---

## Description

A binary tree is represented by a level-order array. Return node values grouped by depth from top to bottom.

## Examples

### Example 1
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
### Example 2
Input: root = [1]
Output: [[1]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def levelOrder(self, root: Any) -> Any:
        #   root: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function levelOrder(root) {
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
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    },
    "expected": [
      [
        3
      ],
      [
        9,
        20
      ],
      [
        15,
        7
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "root": [
        1
      ]
    },
    "expected": [
      [
        1
      ]
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
        1,
        2,
        3,
        4,
        5
      ]
    },
    "expected": [
      [
        1
      ],
      [
        2,
        3
      ],
      [
        4,
        5
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "root": [
        1,
        null,
        2,
        3
      ]
    },
    "expected": [
      [
        1
      ],
      [
        2
      ],
      [
        3
      ]
    ]
  }
]
```
