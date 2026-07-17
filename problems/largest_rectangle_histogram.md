---
id: largest_rectangle_histogram
category: Stack
difficulty: Hard
englishName: Largest Rectangle in Histogram
chineseName: 柱状图中最大的矩形
methodName: largestRectangleArea
javascriptFunctionName: largestRectangleArea
validation: exact
inputParams: heights
visibleTestCount: 3
---

## Description

Given histogram bar heights, return the area of the largest rectangle that can be formed.

## Examples

### Example 1
Input: heights = [2,1,5,6,2,3]
Output: 10
### Example 2
Input: heights = [2,4]
Output: 4

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def largestRectangleArea(self, heights: Any) -> Any:
        #   heights: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function largestRectangleArea(heights) {
  //   heights: unknown
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
      "heights": [
        2,
        1,
        5,
        6,
        2,
        3
      ]
    },
    "expected": 10
  },
  {
    "id": "case-2",
    "input": {
      "heights": [
        2,
        4
      ]
    },
    "expected": 4
  },
  {
    "id": "case-3",
    "input": {
      "heights": [
        1,
        1
      ]
    },
    "expected": 2
  },
  {
    "id": "case-4",
    "input": {
      "heights": [
        4,
        2,
        0,
        3,
        2,
        5
      ]
    },
    "expected": 6
  },
  {
    "id": "case-5",
    "input": {
      "heights": [
        6,
        7,
        5,
        2,
        4,
        5,
        9,
        3
      ]
    },
    "expected": 16
  }
]
```
