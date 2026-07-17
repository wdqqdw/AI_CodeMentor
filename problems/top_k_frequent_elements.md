---
id: top_k_frequent_elements
category: Array & Hashing
difficulty: Medium
englishName: Top K Frequent Elements
chineseName: 前 K 个高频元素
methodName: topKFrequent
javascriptFunctionName: topKFrequent
validation: exact
inputParams: nums, k
visibleTestCount: 3
---

## Description

Return the `k` most frequent numbers. If two numbers have the same frequency, return the smaller number first.

## Examples

### Example 1
Input: nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]
### Example 2
Input: nums = [1], k = 1
Output: [1]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def topKFrequent(self, nums: Any, k: int) -> Any:
        #   nums: Any
        #   k: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function topKFrequent(nums, k) {
  //   nums: unknown
  //   k: number
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
        1,
        1,
        2,
        2,
        3
      ],
      "k": 2
    },
    "expected": [
      1,
      2
    ]
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        1
      ],
      "k": 1
    },
    "expected": [
      1
    ]
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        4,
        4,
        4,
        6,
        6,
        7
      ],
      "k": 2
    },
    "expected": [
      4,
      6
    ]
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        3,
        0,
        1,
        0
      ],
      "k": 1
    },
    "expected": [
      0
    ]
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        5,
        2,
        5,
        3,
        3,
        2
      ],
      "k": 3
    },
    "expected": [
      2,
      3,
      5
    ]
  }
]
```
