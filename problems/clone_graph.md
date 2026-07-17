---
id: clone_graph
category: Graphs
difficulty: Medium
englishName: Clone Graph
chineseName: 克隆图
methodName: cloneGraph
javascriptFunctionName: cloneGraph
validation: exact
inputParams: graph
visibleTestCount: 3
---

## Description

A graph is represented as an adjacency list where index `i` stores neighbors of node `i + 1`. Return a deep-copied adjacency list with the same structure.

## Examples

### Example 1
Input: graph = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
### Example 2
Input: graph = [[]]
Output: [[]]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def cloneGraph(self, graph: Any) -> Any:
        #   graph: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function cloneGraph(graph) {
  //   graph: unknown
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
      "graph": [
        [
          2,
          4
        ],
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          1,
          3
        ]
      ]
    },
    "expected": [
      [
        2,
        4
      ],
      [
        1,
        3
      ],
      [
        2,
        4
      ],
      [
        1,
        3
      ]
    ]
  },
  {
    "id": "case-2",
    "input": {
      "graph": [
        []
      ]
    },
    "expected": [
      []
    ]
  },
  {
    "id": "case-3",
    "input": {
      "graph": []
    },
    "expected": []
  },
  {
    "id": "case-4",
    "input": {
      "graph": [
        [
          2
        ],
        [
          1
        ]
      ]
    },
    "expected": [
      [
        2
      ],
      [
        1
      ]
    ]
  },
  {
    "id": "case-5",
    "input": {
      "graph": [
        [
          2,
          3
        ],
        [
          1
        ],
        [
          1
        ]
      ]
    },
    "expected": [
      [
        2,
        3
      ],
      [
        1
      ],
      [
        1
      ]
    ]
  }
]
```
