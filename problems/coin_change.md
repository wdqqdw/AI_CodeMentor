---
id: coin_change
category: Dynamic Programming
difficulty: Medium
englishName: Coin Change
chineseName: 零钱兑换
methodName: coinChange
javascriptFunctionName: coinChange
validation: exact
inputParams: coins, amount
visibleTestCount: 3
---

## Description

Given coin denominations and an amount, return the fewest coins needed to make that amount. Return `-1` if impossible.

## Examples

### Example 1
Input: coins = [1,2,5], amount = 11
Output: 3
### Example 2
Input: coins = [2], amount = 3
Output: -1

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def coinChange(self, coins: Any, amount: int) -> Any:
        #   coins: Any
        #   amount: int
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function coinChange(coins, amount) {
  //   coins: unknown
  //   amount: number
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
      "coins": [
        1,
        2,
        5
      ],
      "amount": 11
    },
    "expected": 3
  },
  {
    "id": "case-2",
    "input": {
      "coins": [
        2
      ],
      "amount": 3
    },
    "expected": -1
  },
  {
    "id": "case-3",
    "input": {
      "coins": [
        1
      ],
      "amount": 0
    },
    "expected": 0
  },
  {
    "id": "case-4",
    "input": {
      "coins": [
        1
      ],
      "amount": 2
    },
    "expected": 2
  },
  {
    "id": "case-5",
    "input": {
      "coins": [
        2,
        5,
        10,
        1
      ],
      "amount": 27
    },
    "expected": 4
  }
]
```
