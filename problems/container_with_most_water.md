---
id: container_with_most_water
category: Two Pointers
difficulty: Medium
englishName: Container With Most Water
chineseName: 盛最多水的容器
methodName: maxArea
javascriptFunctionName: maxArea
validation: exact
inputParams: height
visibleTestCount: 3
---

## Description

Given vertical line heights, choose two lines that form a container holding the most water and return that maximum area.

## Examples

### Example 1
Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49
### Example 2
Input: height = [1, 1]
Output: 1

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def maxArea(self, height: Any) -> Any:
        #   height: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function maxArea(height) {
  //   height: unknown
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
      "height": [
        1,
        8,
        6,
        2,
        5,
        4,
        8,
        3,
        7
      ]
    },
    "expected": 49
  },
  {
    "id": "case-2",
    "input": {
      "height": [
        1,
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-3",
    "input": {
      "height": [
        4,
        3,
        2,
        1,
        4
      ]
    },
    "expected": 16
  },
  {
    "id": "case-4",
    "input": {
      "height": [
        1,
        2,
        1
      ]
    },
    "expected": 2
  },
  {
    "id": "case-5",
    "input": {
      "height": [
        2,
        3,
        4,
        5,
        18,
        17,
        6
      ]
    },
    "expected": 17
  }
]
```
