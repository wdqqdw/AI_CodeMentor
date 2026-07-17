---
id: word_ladder
category: Graphs
difficulty: Hard
englishName: Word Ladder
chineseName: 单词接龙
methodName: ladderLength
javascriptFunctionName: ladderLength
validation: exact
inputParams: beginWord, endWord, wordList
visibleTestCount: 3
---

## Description

Return the length of the shortest transformation from `beginWord` to `endWord`, changing one letter at a time and using only words from `wordList`.

## Examples

### Example 1
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
### Example 2
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0

## Starter Code - Python

```python
from typing import Any, List

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: Any) -> Any:
        #   beginWord: str
        #   endWord: str
        #   wordList: Any
        # Output:
        #   Return the required result for this problem.
        #
        # Start with the examples, then think about the core pattern.
        pass
```

## Starter Code - JavaScript

```javascript
function ladderLength(beginWord, endWord, wordList) {
  //   beginWord: string
  //   endWord: string
  //   wordList: unknown
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
      "beginWord": "hit",
      "endWord": "cog",
      "wordList": [
        "hot",
        "dot",
        "dog",
        "lot",
        "log",
        "cog"
      ]
    },
    "expected": 5
  },
  {
    "id": "case-2",
    "input": {
      "beginWord": "hit",
      "endWord": "cog",
      "wordList": [
        "hot",
        "dot",
        "dog",
        "lot",
        "log"
      ]
    },
    "expected": 0
  },
  {
    "id": "case-3",
    "input": {
      "beginWord": "a",
      "endWord": "c",
      "wordList": [
        "a",
        "b",
        "c"
      ]
    },
    "expected": 2
  },
  {
    "id": "case-4",
    "input": {
      "beginWord": "hot",
      "endWord": "dog",
      "wordList": [
        "hot",
        "dog"
      ]
    },
    "expected": 0
  },
  {
    "id": "case-5",
    "input": {
      "beginWord": "red",
      "endWord": "tax",
      "wordList": [
        "ted",
        "tex",
        "red",
        "tax",
        "tad",
        "den",
        "rex",
        "pee"
      ]
    },
    "expected": 4
  }
]
```
