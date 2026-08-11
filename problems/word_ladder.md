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

**English description**

You are given two words, `beginWord` and `endWord`, and a dictionary `wordList`. Your task is to return the length of the shortest valid transformation sequence from `beginWord` to `endWord`.

A valid transformation sequence must follow these rules:

- The first word is `beginWord`.
- The last word is `endWord`.
- Each step changes exactly one character.
- Every intermediate word must appear in `wordList`.
- `beginWord` does not need to appear in `wordList`.
- If `endWord` is not in `wordList`, return `0`.
- Only words with the same length as `beginWord` and `endWord` can be used.

The length counts how many words appear in the sequence, including both `beginWord` and `endWord`. For example, `hit -> hot -> dot -> dog -> cog` has length `5`.

This problem is about shortest paths in an implicit graph. Each word is a node, and two words are connected when they differ by exactly one character. A natural approach is to search level by level, so that the first time you reach `endWord` is the shortest sequence.

**中文说明**

给定两个单词 `beginWord` 和 `endWord`，以及一个字典 `wordList`。你的任务是返回从 `beginWord` 变到 `endWord` 的最短合法转换序列长度。

一个合法转换序列需要满足：

- 第一个单词是 `beginWord`。
- 最后一个单词是 `endWord`。
- 每一步只能改变一个字符。
- 每个中间单词都必须出现在 `wordList` 中。
- `beginWord` 不一定需要出现在 `wordList` 中。
- 如果 `endWord` 不在 `wordList` 中，返回 `0`。
- 只能使用长度和 `beginWord`、`endWord` 相同的单词。

序列长度指序列里包含的单词个数，包括起点和终点。例如 `hit -> hot -> dot -> dog -> cog` 的长度是 `5`。

这道题的核心不是棋盘回溯，而是隐式图上的最短路。可以把每个单词看成一个节点，两个只差一个字符的单词之间有一条边。通常需要按层搜索，这样第一次到达 `endWord` 时就是最短路径。

## Examples

### Example 1
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5

### Example 2
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0

### Example 3
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog","hog","hig"]
Output: 4

### Example 4
Input: beginWord = "a", endWord = "c", wordList = ["a","b","c"]
Output: 2

### Example 5
Input: beginWord = "lost", endWord = "cost", wordList = ["most","mist","miss","fist","fish","cost"]
Output: 2

### Example 6
Input: beginWord = "abc", endWord = "def", wordList = ["ab","abcd","dbc","dec","def","aef"]
Output: 4

## Visual Examples

```json
[
  {
    "title": "Shortest transformation path",
    "caption": "Each arrow changes exactly one character. The sequence `hit -> hot -> dot -> dog -> cog` contains 5 words, so the answer is 5.",
    "image": "./assets/word-ladder-path.svg?v=word-ladder-visual-1",
    "alt": "Word Ladder shortest path from hit to cog",
    "input": "beginWord = \"hit\", endWord = \"cog\", wordList has hot, dot, dog, lot, log, cog",
    "output": "5"
  },
  {
    "title": "Only one-letter neighbors connect",
    "caption": "A move is valid only when exactly one character changes and the next word appears in `wordList`.",
    "image": "./assets/word-ladder-neighbor-rule.svg?v=word-ladder-visual-1",
    "alt": "Valid and invalid Word Ladder neighbor examples",
    "input": "hot -> dot is allowed; hot -> dog is rejected",
    "output": "Only one-letter changes are valid moves"
  }
]
```

## Starter Code - Python

```python
from typing import List

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        # Input:
        #   beginWord: str
        #   endWord: str
        #   wordList: List[str]
        # Output:
        #   The length of the shortest transformation sequence.
        #
        # Think about:
        #   1. How to decide whether two words are one edit apart.
        #   2. Why shortest path suggests level-by-level search.
        #   3. How to avoid visiting the same word repeatedly.
        return 0
```

## Starter Code - JavaScript

```javascript
function ladderLength(beginWord, endWord, wordList) {
  // Input:
  //   beginWord: string
  //   endWord: string
  //   wordList: string[]
  // Output:
  //   The length of the shortest transformation sequence.
  return 0;
}
```

## Tests

```json
[
  {"id":"case-1","input":{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog"]},"expected":5},
  {"id":"case-2","input":{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log"]},"expected":0},
  {"id":"case-3","input":{"beginWord":"a","endWord":"c","wordList":["a","b","c"]},"expected":2},
  {"id":"case-4","input":{"beginWord":"red","endWord":"tax","wordList":["ted","tex","red","tax","tad","den","rex","pee"]},"expected":4},
  {"id":"case-5","input":{"beginWord":"lost","endWord":"cost","wordList":["most","mist","miss","lost","fist","fish","cost"]},"expected":2},
  {"id":"case-6","input":{"beginWord":"talk","endWord":"tail","wordList":["tall","tail","bail","balk","talk"]},"expected":3},
  {"id":"case-7","input":{"beginWord":"spin","endWord":"spot","wordList":["spit","spot","span","span","span","skin","skim","skit"]},"expected":3},
  {"id":"case-8","input":{"beginWord":"cold","endWord":"warm","wordList":["cord","card","ward","warm","wold","wald","word"]},"expected":5},
  {"id":"case-9","input":{"beginWord":"toon","endWord":"plea","wordList":["poon","plee","same","poie","plie","poin","plea"]},"expected":7},
  {"id":"case-10","input":{"beginWord":"lead","endWord":"gold","wordList":["load","goad","gold","gald","geld","lead","loan"]},"expected":4},
  {"id":"case-11","input":{"beginWord":"game","endWord":"math","wordList":["gave","gane","mane","mate","math","gate","gath"]},"expected":4},
  {"id":"case-12","input":{"beginWord":"code","endWord":"data","wordList":["cade","cate","date","data","coda","cada","dada"]},"expected":5},
  {"id":"case-13","input":{"beginWord":"same","endWord":"cost","wordList":["came","case","cast","cost","cose","same"]},"expected":5},
  {"id":"case-14","input":{"beginWord":"stone","endWord":"phony","wordList":["shone","phone","phony","money","stony","story"]},"expected":4},
  {"id":"case-15","input":{"beginWord":"print","endWord":"pride","wordList":["plans","plant","print","pride","plide","prine","plane"]},"expected":3},
  {"id":"case-16","input":{"beginWord":"aaaa","endWord":"bbbb","wordList":["aaab","aabb","abbb","bbbb","baaa","bbaa","bbba"]},"expected":5},
  {"id":"case-17","input":{"beginWord":"cat","endWord":"dog","wordList":["cot","cog","dog","dat","dot","dag"]},"expected":4},
  {"id":"case-18","input":{"beginWord":"cat","endWord":"dog","wordList":["cot","cog","dat","dot","dag"]},"expected":0},
  {"id":"case-19","input":{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog","hog","hig"]},"expected":4},
  {"id":"case-20","input":{"beginWord":"abc","endWord":"xyz","wordList":["xbc","xyc","xyz","ayc","aby","abz"]},"expected":4},
  {"id":"case-21","input":{"beginWord":"abc","endWord":"def","wordList":["ab","abcd","dbc","dec","def","aef"]},"expected":4},
  {"id":"case-22","input":{"beginWord":"aaaaa","endWord":"aaaaz","wordList":["aaaab","aaaac","aaaad","aaaaz"]},"expected":2},
  {"id":"case-23","input":{"beginWord":"start","endWord":"smart","wordList":["stark","stack","slack","black","blank","blink","slink","smart"]},"expected":2},
  {"id":"case-24","input":{"beginWord":"maker","endWord":"baker","wordList":["baker","faker","taker","maker","mixer"]},"expected":2},
  {"id":"case-25","input":{"beginWord":"angel","endWord":"devil","wordList":["anvel","anvil","dnvil","devil","anger","dnger"]},"expected":5},
  {"id":"case-26","input":{"beginWord":"aaaa","endWord":"zzzz","wordList":["zaaa","zzaa","zzza","zzzz","azaa","azza","azzz"]},"expected":5},
  {"id":"case-27","input":{"beginWord":"mate","endWord":"code","wordList":["made","mode","code","mate","math","path","pate"]},"expected":4},
  {"id":"case-28","input":{"beginWord":"rope","endWord":"mind","wordList":["ripe","pipe","pine","mine","mind","rope","mole","mode"]},"expected":6},
  {"id":"case-29","input":{"beginWord":"zero","endWord":"hero","wordList":["hero","here","hire","fire","five"]},"expected":2},
  {"id":"case-30","input":{"beginWord":"lamp","endWord":"limp","wordList":["limp","lump","lamp","camp","comp"]},"expected":2}
]
```
