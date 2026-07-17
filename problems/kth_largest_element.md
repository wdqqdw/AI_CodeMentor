---
id: kth_largest_element
category: Heap / Priority Queue
difficulty: Medium
englishName: Kth Largest Element in an Array
chineseName: 数组中的第 K 个最大元素
methodName: findKthLargest
javascriptFunctionName: findKthLargest
validation: exact
inputParams: nums, k
visibleTestCount: 3
---

## Description

Return the `k`th largest value in an unsorted array.

## Examples

### Example 1
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
### Example 2
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def findKthLargest(self, nums: Any, k: int) -> Any:
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
function findKthLargest(nums, k) {
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
        3,
        2,
        1,
        5,
        6,
        4
      ],
      "k": 2
    },
    "expected": 5
  },
  {
    "id": "case-2",
    "input": {
      "nums": [
        3,
        2,
        3,
        1,
        2,
        4,
        5,
        5,
        6
      ],
      "k": 4
    },
    "expected": 4
  },
  {
    "id": "case-3",
    "input": {
      "nums": [
        1
      ],
      "k": 1
    },
    "expected": 1
  },
  {
    "id": "case-4",
    "input": {
      "nums": [
        2,
        1
      ],
      "k": 2
    },
    "expected": 1
  },
  {
    "id": "case-5",
    "input": {
      "nums": [
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ],
      "k": 5
    },
    "expected": 3
  }
]
```
