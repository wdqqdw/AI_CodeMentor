---
id: merge_intervals
category: Intervals
difficulty: Medium
englishName: Merge Intervals
chineseName: 合并区间
methodName: merge
javascriptFunctionName: merge
validation: array_exact
inputParams: intervals
visibleTestCount: 3
---

## Description

Given an array of intervals where each interval is `[start, end]`, merge all overlapping intervals and return the non-overlapping intervals sorted by start.

## Examples

### Example 1
Input: intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
Output: [[1, 6], [8, 10], [15, 18]]

### Example 2
Input: intervals = [[1, 4], [4, 5]]
Output: [[1, 5]]

## Starter Code - Python

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # Input:
        #   intervals: List[List[int]]
        # Output:
        #   merged non-overlapping intervals
        #
        # Think about sorting by start time first.
        pass
```

## Starter Code - JavaScript

```javascript
function merge(intervals) {
  // Input:
  //   intervals: number[][]
  // Output:
  //   merged non-overlapping intervals
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "intervals": [[1, 3], [2, 6], [8, 10], [15, 18]] }, "expected": [[1, 6], [8, 10], [15, 18]] },
  { "id": "case-2", "input": { "intervals": [[1, 4], [4, 5]] }, "expected": [[1, 5]] },
  { "id": "case-3", "input": { "intervals": [[1, 4], [0, 2], [3, 5]] }, "expected": [[0, 5]] },
  { "id": "case-4", "input": { "intervals": [[1, 4]] }, "expected": [[1, 4]] },
  { "id": "case-5", "input": { "intervals": [] }, "expected": [] },
  { "id": "case-6", "input": { "intervals": [[1, 2], [3, 4]] }, "expected": [[1, 2], [3, 4]] },
  { "id": "case-7", "input": { "intervals": [[5, 7], [1, 3], [2, 4]] }, "expected": [[1, 4], [5, 7]] },
  { "id": "case-8", "input": { "intervals": [[1, 10], [2, 3], [4, 8]] }, "expected": [[1, 10]] },
  { "id": "case-9", "input": { "intervals": [[2, 2], [1, 1], [1, 2]] }, "expected": [[1, 2]] },
  { "id": "case-10", "input": { "intervals": [[0, 0], [1, 4], [2, 3], [5, 7], [6, 8]] }, "expected": [[0, 0], [1, 4], [5, 8]] }
]
```
