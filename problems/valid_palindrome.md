---
id: valid_palindrome
category: Two Pointers
difficulty: Easy
englishName: Valid Palindrome
chineseName: 验证回文串
methodName: isPalindrome
javascriptFunctionName: isPalindrome
validation: exact
inputParams: s
visibleTestCount: 3
---

## Description

Return `true` if `s` is a palindrome after converting letters to lowercase and removing non-alphanumeric characters.

## Examples

### Example 1
Input: s = "A man, a plan, a canal: Panama"
Output: true
### Example 2
Input: s = "race a car"
Output: false

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def isPalindrome(self, s: str) -> Any:
        #   s: str
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function isPalindrome(s) {
  //   s: string
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
      "s": "A man, a plan, a canal: Panama"
    },
    "expected": true
  },
  {
    "id": "case-2",
    "input": {
      "s": "race a car"
    },
    "expected": false
  },
  {
    "id": "case-3",
    "input": {
      "s": " "
    },
    "expected": true
  },
  {
    "id": "case-4",
    "input": {
      "s": "0P"
    },
    "expected": false
  },
  {
    "id": "case-5",
    "input": {
      "s": "No lemon, no melon"
    },
    "expected": true
  }
]
```
