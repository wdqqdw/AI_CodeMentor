---
id: validate_bst
category: Trees
difficulty: Medium
englishName: Validate Binary Search Tree
chineseName: 验证二叉搜索树
methodName: isValidBST
javascriptFunctionName: isValidBST
validation: exact
inputParams: root
visibleTestCount: 3
---

## Description

A binary tree is represented by a level-order array. Return whether it satisfies the binary search tree ordering rule.

## Examples

### Example 1
Input: root = [2,1,3]
Output: true
### Example 2
Input: root = [5,1,4,null,null,3,6]
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def isValidBST(self, root: Any) -> Any:
        #   root: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function isValidBST(root) {
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
        2,
        1,
        3
      ]
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "root": [
        5,
        1,
        4,
        null,
        null,
        3,
        6
      ]
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "root": []
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "root": [
        1,
        1
      ]
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "root": [
        5,
        4,
        6,
        null,
        null,
        3,
        7
      ]
    },
    "expected": false
  }
]
```
