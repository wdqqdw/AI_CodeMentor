---
id: find_median_stream
category: Heap / Priority Queue
difficulty: Hard
englishName: Find Median from Data Stream
chineseName: 数据流的中位数
methodName: medianStream
javascriptFunctionName: medianStream
validation: exact
inputParams: nums
visibleTestCount: 3
---

## Description

Given a stream of numbers as an array, return the median after each insertion.

## Examples

### Example 1
Input: nums = [1, 2, 3]
Output: [1, 1.5, 2]
### Example 2
Input: nums = [5, 15, 1, 3]
Output: [5, 10, 5, 4]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def medianStream(self, nums: Any) -> Any:
        #   nums: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function medianStream(nums) {
  //   nums: unknown
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
      "nums": [
        1,
        2,
        3
      ]
    },
    "expected": [
      1,
      1.5,
      2
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        5,
        15,
        1,
        3
      ]
    },
    "expected": [
      5,
      10,
      5,
      4
    ]
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        2
      ]
    },
    "expected": [
      2
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        2,
        1
      ]
    },
    "expected": [
      2,
      1.5
    ]
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        10,
        20,
        30,
        40
      ]
    },
    "expected": [
      10,
      15,
      20,
      25
    ]
  }
]
```
