---
id: last_stone_weight
category: Heap / Priority Queue
difficulty: Easy
englishName: Last Stone Weight
chineseName: 最后一块石头的重量
methodName: lastStoneWeight
javascriptFunctionName: lastStoneWeight
validation: exact
inputParams: stones
visibleTestCount: 3
---

## Description

Repeatedly smash the two heaviest stones. If they differ, the remaining weight goes back in. Return the final stone weight or `0`.

## Examples

### Example 1
Input: stones = [2,7,4,1,8,1]
Output: 1
### Example 2
Input: stones = [1]
Output: 1

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def lastStoneWeight(self, stones: Any) -> Any:
        #   stones: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function lastStoneWeight(stones) {
  //   stones: unknown
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
      "stones": [
        2,
        7,
        4,
        1,
        8,
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-2",
    "input": {
      "stones": [
        1
      ]
    },
    "expected": 1
  },
  {
    "id": "case-3",
    "input": {
      "stones": [
        1,
        1
      ]
    },
    "expected": 0
  },
  {
    "id": "case-4",
    "input": {
      "stones": [
        10,
        4,
        2,
        10
      ]
    },
    "expected": 2
  },
  {
    "id": "case-5",
    "input": {
      "stones": [
        3,
        7,
        8
      ]
    },
    "expected": 2
  }
]
```
