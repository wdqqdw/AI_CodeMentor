---
id: valid_parentheses
category: Stack
difficulty: Easy
englishName: Valid Parentheses
chineseName: 有效括号
methodName: isValid
javascriptFunctionName: isValid
validation: exact
inputParams: s
visibleTestCount: 3
---

## Description

Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[` and `]`, determine whether the brackets are valid. A valid string closes brackets in the correct order.

## Examples

### Example 1
Input: s = "()[]{}"
Output: true

### Example 2
Input: s = "(]"
Output: false

## Starter Code - Python

```python
class Solution:
    def isValid(self, s: str) -> bool:
        # Input:
        #   s: str containing bracket characters
        # Output:
        #   bool indicating whether brackets are valid
        #
        # Think about what a stack should remember.
        pass
```

## Starter Code - JavaScript

```javascript
function isValid(s) {
  // Input:
  //   s: string containing bracket characters
  // Output:
  //   boolean indicating whether brackets are valid
}
```

## Tests

```json
[
  { "id": "case-1", "input": { "s": "()[]{}" }, "expected": true },
  { "id": "case-2", "input": { "s": "(]" }, "expected": false },
  { "id": "case-3", "input": { "s": "([{}])" }, "expected": true },
  { "id": "case-4", "input": { "s": "(((" }, "expected": false },
  { "id": "case-5", "input": { "s": "" }, "expected": true },
  { "id": "case-6", "input": { "s": "{[]}" }, "expected": true },
  { "id": "case-7", "input": { "s": "([)]" }, "expected": false },
  { "id": "case-8", "input": { "s": "]" }, "expected": false },
  { "id": "case-9", "input": { "s": "(([]){})" }, "expected": true },
  { "id": "case-10", "input": { "s": "({[})]" }, "expected": false }
]
```
