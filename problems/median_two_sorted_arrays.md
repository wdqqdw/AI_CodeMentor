---
id: median_two_sorted_arrays
category: Binary Search
difficulty: Hard
englishName: Median of Two Sorted Arrays
chineseName: 寻找两个正序数组的中位数
methodName: findMedianSortedArrays
javascriptFunctionName: findMedianSortedArrays
validation: exact
inputParams: nums1, nums2
visibleTestCount: 3
---

## Description

Given two sorted arrays, return the median value of the combined sorted data.

## Examples

### Example 1
Input: nums1 = [1, 3], nums2 = [2]
Output: 2
### Example 2
Input: nums1 = [1, 2], nums2 = [3, 4]
Output: 2.5

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def findMedianSortedArrays(self, nums1: Any, nums2: Any) -> Any:
        #   nums1: Any
        #   nums2: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function findMedianSortedArrays(nums1, nums2) {
  //   nums1: unknown
  //   nums2: unknown
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
      "nums1": [
        1,
        3
      ],
      "nums2": [
        2
      ]
    },
    "expected": 2
  },
  {
    "id": "case-2",
    "input": {
      "nums1": [
        1,
        2
      ],
      "nums2": [
        3,
        4
      ]
    },
    "expected": 2.5
  },
  {
    "id": "case-3",
    "input": {
      "nums1": [],
      "nums2": [
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-4",
    "input": {
      "nums1": [
        0,
        0
      ],
      "nums2": [
        0,
        0
      ]
    },
    "expected": 0
  },
  {
    "id": "case-5",
    "input": {
      "nums1": [
        2
      ],
      "nums2": []
    },
    "expected": 2
  }
]
```
