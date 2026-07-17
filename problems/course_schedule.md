---
id: course_schedule
category: Graphs
difficulty: Medium
englishName: Course Schedule
chineseName: 课程表
methodName: canFinish
javascriptFunctionName: canFinish
validation: exact
inputParams: numCourses, prerequisites
visibleTestCount: 3
---

## Description

Given courses and prerequisite pairs `[course, prerequisite]`, return whether all courses can be completed.

## Examples

### Example 1
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
### Example 2
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: Any) -> Any:
        #   numCourses: int
        #   prerequisites: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function canFinish(numCourses, prerequisites) {
  //   numCourses: number
  //   prerequisites: unknown
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
      "numCourses": 2,
      "prerequisites": [
        [
          1,
          0
        ]
      ]
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "numCourses": 2,
      "prerequisites": [
        [
          1,
          0
        ],
        [
          0,
          1
        ]
      ]
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "numCourses": 1,
      "prerequisites": []
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "numCourses": 4,
      "prerequisites": [
        [
          1,
          0
        ],
        [
          2,
          1
        ],
        [
          3,
          2
        ]
      ]
    },
    "expected": true
  },
  {
    "id": "case-5",
    "input": {
      "numCourses": 3,
      "prerequisites": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          0
        ]
      ]
    },
    "expected": false
  }
]
```
