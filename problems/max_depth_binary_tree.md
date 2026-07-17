---
id: max_depth_binary_tree
category: Trees
difficulty: Easy
englishName: Maximum Depth of Binary Tree
chineseName: 二叉树的最大深度
methodName: maxDepth
javascriptFunctionName: maxDepth
validation: exact
inputParams: root
visibleTestCount: 3
---

## Description

A binary tree is represented by level-order array values with `null` for missing nodes. Return the maximum depth.

## Examples

### Example 1
Input: root = [3,9,20,null,null,15,7]
Output: 3
### Example 2
Input: root = [1,null,2]
Output: 2

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def maxDepth(self, root: Any) -> Any:
        #   root: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function maxDepth(root) {
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
    "expected": 3
  },
  {
    "id": "case-2",
    "input": {
      "root": [
        1,
        null,
        2
      ]
    },
    "expected": 2
  },
  {
    "id": "case-3",
    "input": {
      "root": []
    },
    "expected": 0
  },
  {
    "id": "case-4",
    "input": {
      "root": [
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-5",
    "input": {
      "root": [
        1,
        2,
        3,
        4,
        null,
        null,
        5
      ]
    },
    "expected": 3
  }
]
```
