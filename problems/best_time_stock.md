---
id: best_time_stock
category: Sliding Window
difficulty: Easy
englishName: Best Time to Buy and Sell Stock
chineseName: 买卖股票的最佳时机
methodName: maxProfit
javascriptFunctionName: maxProfit
validation: exact
inputParams: prices
visibleTestCount: 3
---

## Description

Given daily stock prices, choose one buy day and one later sell day to maximize profit. Return `0` if no profit is possible.

## Examples

### Example 1
Input: prices = [7, 1, 5, 3, 6, 4]
Output: 5
### Example 2
Input: prices = [7, 6, 4, 3, 1]
Output: 0

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def maxProfit(self, prices: Any) -> Any:
        #   prices: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function maxProfit(prices) {
  //   prices: unknown
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
      "prices": [
        7,
        1,
        5,
        3,
        6,
        4
      ]
    },
    "expected": 5
  },
  {
    "id": "case-2",
    "input": {
      "prices": [
        7,
        6,
        4,
        3,
        1
      ]
    },
    "expected": 0
  },
  {
    "id": "case-3",
    "input": {
      "prices": [
        1,
        2
      ]
    },
    "expected": 1
  },
  {
    "id": "case-4",
    "input": {
      "prices": [
        2,
        4,
        1
      ]
    },
    "expected": 2
  },
  {
    "id": "case-5",
    "input": {
      "prices": [
        3,
        3,
        5,
        0,
        0,
        3,
        1,
        4
      ]
    },
    "expected": 4
  }
]
```
