---
id: ransom_note
category: Array & Hashing
difficulty: Easy
englishName: Ransom Note
chineseName: 赎金信
methodName: ransomNote
javascriptFunctionName: ransomNote
validation: exact
inputParams: inputData
visibleTestCount: 2
---

## Description

This is a draft practice page for `Ransom Note` in the `Array & Hashing` track. Use the title and tag `Hash Map` as the problem clue. The detailed statement and stronger tests can be refined later while the page remains clickable and usable in the tutor workflow.

## Examples

### Example 1
Input: inputData = {"topic": "Ransom Note", "category": "Array & Hashing", "sample": 1}
Output: {"topic": "Ransom Note", "category": "Array & Hashing", "sample": 1}

### Example 2
Input: inputData = {"topic": "Ransom Note", "category": "Array & Hashing", "sample": 2}
Output: {"topic": "Ransom Note", "category": "Array & Hashing", "sample": 2}

## Starter Code - Python

```python
from typing import Any

class Solution:
    def ransomNote(self, inputData: Any) -> Any:
        # Input:
        #   inputData: draft payload for this practice page
        # Output:
        #   Return the required result for this problem.
        #
        # This draft page keeps the workflow available while
        # the detailed statement and hidden tests are refined.
        pass
```

## Starter Code - JavaScript

```javascript
function ransomNote(inputData) {
  // Input:
  //   inputData: draft payload for this practice page
  // Output:
  //   Return the required result for this problem.
}
```

## Tests

```json
[
  {
    "id": "case-1",
    "input": {
      "inputData": {
        "topic": "Ransom Note",
        "category": "Array & Hashing",
        "sample": 1
      }
    },
    "expected": {
      "topic": "Ransom Note",
      "category": "Array & Hashing",
      "sample": 1
    }
  },
  {
    "id": "case-2",
    "input": {
      "inputData": {
        "topic": "Ransom Note",
        "category": "Array & Hashing",
        "sample": 2
      }
    },
    "expected": {
      "topic": "Ransom Note",
      "category": "Array & Hashing",
      "sample": 2
    }
  },
  {
    "id": "case-3",
    "input": {
      "inputData": [
        "Ransom Note",
        "Hash Map"
      ]
    },
    "expected": [
      "Ransom Note",
      "Hash Map"
    ]
  }
]
```
