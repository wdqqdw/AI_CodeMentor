---
id: daily_temperatures
category: Stack
difficulty: Medium
englishName: Daily Temperatures
chineseName: 每日温度
methodName: dailyTemperatures
javascriptFunctionName: dailyTemperatures
validation: exact
inputParams: temperatures
visibleTestCount: 3
---

## Description

For each day, return how many days must pass until a warmer temperature. Use `0` when no warmer day exists.

## Examples

### Example 1
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
### Example 2
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def dailyTemperatures(self, temperatures: Any) -> Any:
        #   temperatures: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function dailyTemperatures(temperatures) {
  //   temperatures: unknown
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
      "temperatures": [
        73,
        74,
        75,
        71,
        69,
        72,
        76,
        73
      ]
    },
    "expected": [
      1,
      1,
      4,
      2,
      1,
      1,
      0,
      0
    ]
  },
  {
    "id": "case-2",
    "input": {
      "temperatures": [
        30,
        40,
        50,
        60
      ]
    },
    "expected": [
      1,
      1,
      1,
      0
    ]
  },
  {
    "id": "case-3",
    "input": {
      "temperatures": [
        30,
        60,
        90
      ]
    },
    "expected": [
      1,
      1,
      0
    ]
  },
  {
    "id": "case-4",
    "input": {
      "temperatures": [
        90,
        80,
        70
      ]
    },
    "expected": [
      0,
      0,
      0
    ]
  },
  {
    "id": "case-5",
    "input": {
      "temperatures": [
        70
      ]
    },
    "expected": [
      0
    ]
  }
]
```
