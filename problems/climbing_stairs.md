---
id: climbing_stairs
category: Dynamic Programming
difficulty: Easy
englishName: Climbing Stairs
chineseName: 爬楼梯
methodName: climbStairs
javascriptFunctionName: climbStairs
validation: exact
inputParams: n
visibleTestCount: 3
---

## Description

You are climbing a staircase with `n` steps. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.

## Examples

### Example 1
Input: n = 2
Output: 2

### Example 2
Input: n = 3
Output: 3

## Starter Code - Python

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        # Input:
        #   n: int
        # Output:
        #   number of distinct ways
        #
        # Think about how ways(n) relates to ways(n - 1)
        # and ways(n - 2).
        pass
```

## Starter Code - JavaScript

```javascript
function climbStairs(n) {
  // Input:
  //   n: number
  // Output:
  //   number of distinct ways
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "n": 2 }, "expected": 2 },
  { "id": "case-2", "input": { "n": 3 }, "expected": 3 },
  { "id": "case-3", "input": { "n": 1 }, "expected": 1 },
  { "id": "case-4", "input": { "n": 4 }, "expected": 5 },
  { "id": "case-5", "input": { "n": 5 }, "expected": 8 },
  { "id": "case-6", "input": { "n": 6 }, "expected": 13 },
  { "id": "case-7", "input": { "n": 10 }, "expected": 89 },
  { "id": "case-8", "input": { "n": 15 }, "expected": 987 },
  { "id": "case-9", "input": { "n": 20 }, "expected": 10946 },
  { "id": "case-10", "input": { "n": 30 }, "expected": 1346269 }
]
```
