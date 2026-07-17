---
id: insert_interval
category: Intervals
difficulty: Medium
englishName: Insert Interval
chineseName: 插入区间
methodName: insert
javascriptFunctionName: insert
validation: exact
inputParams: intervals, newInterval
visibleTestCount: 3
---

## Description

Given sorted non-overlapping intervals, insert `newInterval`, merge overlaps, and return the sorted interval list.

## Examples

### Example 1
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
### Example 2
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def insert(self, intervals: Any, newInterval: Any) -> Any:
        #   intervals: Any
        #   newInterval: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function insert(intervals, newInterval) {
  //   intervals: unknown
  //   newInterval: unknown
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
      "intervals": [
        [
          1,
          3
        ],
        [
          6,
          9
        ]
      ],
      "newInterval": [
        2,
        5
      ]
    },
    "expected": [
      [
        1,
        5
      ],
      [
        6,
        9
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "intervals": [
        [
          1,
          2
        ],
        [
          3,
          5
        ],
        [
          6,
          7
        ],
        [
          8,
          10
        ],
        [
          12,
          16
        ]
      ],
      "newInterval": [
        4,
        8
      ]
    },
    "expected": [
      [
        1,
        2
      ],
      [
        3,
        10
      ],
      [
        12,
        16
      ]
    ]
  },
  {
    "id": "case-3",
    "input": {
      "intervals": [],
      "newInterval": [
        5,
        7
      ]
    },
    "expected": [
      [
        5,
        7
      ]
    ]
  },
  {
    "id": "case-4",
    "input": {
      "intervals": [
        [
          1,
          5
        ]
      ],
      "newInterval": [
        2,
        3
      ]
    },
    "expected": [
      [
        1,
        5
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "intervals": [
        [
          1,
          5
        ]
      ],
      "newInterval": [
        6,
        8
      ]
    },
    "expected": [
      [
        1,
        5
      ],
      [
        6,
        8
      ]
    ]
  }
]
```
