---
id: boggle_solver
category: Backtracking
difficulty: Hard
englishName: Boggle Solver
chineseName: 棋盘单词搜索
methodName: findWords
javascriptFunctionName: findWords
validation: string_set
disclosureStyle: grouped_hints
inputParams: board, words
visibleTestCount: 0
---

## Description

**English description**

You are building a small Boggle-style word finder. You receive a 2D board of lowercase letters and a dictionary `words`. Your task is to return every dictionary word that can be formed by walking through adjacent cells on the board.

What counts as a valid word path:

- A word may start from any cell.
- From the current cell, you may move to any of the 8 neighboring cells: up, down, left, right, or diagonal.
- During one word path, the same board cell may be used at most once.
- After finishing or abandoning one word path, those cells become available again for a different word.

What your function should return:

- Return each found dictionary word once, even if it appears more than once in `words` or can be formed by multiple paths.
- The output order does not matter.
- Treat every board cell as a literal single character. There is no special `Qu` tile rule in this version.

This problem is intentionally deeper than a plain grid DFS. A simple solution can try each word one by one, but it may become slow when many words share prefixes. A stronger solution usually builds a Trie from `words`, then runs DFS from each board cell and stops early whenever the current path is not a valid prefix.

Common mistakes to watch for:

- Only checking 4 directions instead of all 8 directions.
- Forgetting to unmark a visited cell when backtracking.
- Returning duplicate words.
- Allowing a path to reuse the same cell.
- Revealing words in the wrong format, such as returning coordinates instead of strings.

**中文说明**

你要实现一个简化版 Boggle 单词搜索器。输入包含一个小写字母组成的二维棋盘 `board`，以及一个候选单词列表 `words`。你的任务是返回所有能够在棋盘上通过“相邻移动”拼出来的候选单词。

一个合法的单词路径需要满足：

- 一个单词可以从棋盘上的任意格子开始。
- 每一步可以走到当前格子的 8 个相邻位置之一：上、下、左、右，以及四个对角线方向。
- 在拼同一个单词的一条路径中，同一个棋盘格最多只能使用一次。
- 当一个单词搜索结束或放弃后，之前用过的格子会重新变为可用，可以用于搜索另一个单词。

你的函数需要返回：

- 返回所有能在棋盘上形成的字典词，每个单词只返回一次。
- 输出顺序不重要。
- 每个棋盘格只表示一个普通字符。本题没有真实 Boggle 中特殊的 `Qu` 方块规则。

这道题比普通网格 DFS 更深一些。直接的方法是对 `words` 中的每个单词单独搜索一遍，这样比较容易写出第一版正确解；但当很多单词共享前缀时，这种方法会重复探索大量路径。更高效的思路通常是先用 `words` 构建前缀树 Trie，再从棋盘每个格子开始 DFS；如果当前路径已经不是任何候选词的前缀，就立刻停止继续搜索。

常见错误包括：

- 只检查 4 个方向，漏掉对角线。
- 回溯时忘记取消 visited 标记。
- 同一个答案单词返回多次。
- 在同一条单词路径中重复使用同一个格子。
- 返回格式错误，例如返回坐标、路径或布尔值，而不是字符串列表。

使用 AI Tutor 时，你可以描述自己的想法、当前代码、测试通过情况或 Traceback。Tutor 可以帮助你定位概念和调试方向，但不会直接给出完整代码或最终答案，也不会透露隐藏测试的具体输入和输出。

## Visual Examples

```json
[
  {
    "title": "Walking Through Neighboring Cells",
    "image": "./assets/boggle-path-example.svg",
    "alt": "A board path spelling SEARCH with horizontal, vertical, and diagonal moves.",
    "caption": "The word SEARCH is formed by walking from one adjacent cell to the next. The path may bend, and diagonal moves are valid.",
    "input": "board = [[\"s\",\"e\",\"t\",\"p\"],[\"a\",\"l\",\"a\",\"r\"],[\"t\",\"n\",\"h\",\"c\"]], words = [\"search\", \"seat\", \"path\"]",
    "output": "[\"search\"]"
  },
  {
    "title": "Visited Cells Cannot Be Reused",
    "image": "./assets/boggle-reuse-rule.svg",
    "alt": "A 2 by 2 board showing that a path may not reuse the same cell.",
    "caption": "A path like A -> B -> D is valid because every cell is used once. A path like A -> B -> A is invalid because it returns to a cell already used in this word.",
    "input": "board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abd\", \"aba\", \"abcd\"]",
    "output": "[\"abd\", \"abcd\"]"
  }
]
```

## Examples

### Example 1
Input: board = [["s","e","t","p"],["a","l","a","r"],["t","n","h","c"]], words = ["search", "share", "path"]
Output: ["search"]

### Example 2
Input: board = [["a","b"],["c","d"]], words = ["abd", "aba", "abcd"]
Output: ["abd", "abcd"]

## Starter Code - Python

```python
from typing import List

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        # Input:
        #   board: List[List[str]]
        #   words: List[str]
        # Output:
        #   Every dictionary word that can be formed on the board.
        #
        # Think about:
        #   1. How to walk through 8 neighboring cells.
        #   2. How to avoid reusing a cell in one path.
        #   3. How a prefix tree could stop searches early.
        return []
```

## Starter Code - JavaScript

```javascript
function findWords(board, words) {
  // Input:
  //   board: string[][]
  //   words: string[]
  // Output:
  //   Every dictionary word that can be formed on the board.
  //
  // Think about DFS/backtracking first, then add prefix pruning.
  return [];
}
```

## Tests

```json
[
  {"id":"case-1","group":"Tier 1 · Easy · Core Rules","hint":"Single-row adjacency.","input":{"board":[["c","a","t","s"]],"words":["cat","cats","cast","at","dog"]},"expected":["at","cat","cats"]},
  {"id":"case-2","group":"Tier 1 · Easy · Core Rules","hint":"Single-column adjacency.","input":{"board":[["c"],["o"],["d"],["e"]],"words":["code","cod","ode","cope"]},"expected":["cod","code","ode"]},
  {"id":"case-3","group":"Tier 1 · Easy · Core Rules","hint":"Diagonal movement is allowed.","input":{"board":[["a","x"],["y","b"]],"words":["ab","ay","ax","ba"]},"expected":["ab","ax","ay","ba"]},
  {"id":"case-4","group":"Tier 1 · Easy · Core Rules","hint":"Multiple words can be found on one board.","input":{"board":[["t","o","p"],["a","r","e"],["n","d","s"]],"words":["top","tore","torn","ore","red","tone"]},"expected":["ore","red","top","tore","torn"]},
  {"id":"case-5","group":"Tier 1 · Easy · Core Rules","hint":"Duplicate dictionary words should not duplicate output.","input":{"board":[["m","e"],["a","t"]],"words":["me","me","eat","tea","met","meat"]},"expected":["eat","me","meat","met","tea"]},
  {"id":"case-6","group":"Tier 1 · Easy · Core Rules","hint":"A cell cannot be reused in the same word.","input":{"board":[["a","b"],["c","d"]],"words":["aba","abcd","acdb","aaa"]},"expected":["abcd","acdb"]},
  {"id":"case-7","group":"Tier 1 · Easy · Core Rules","hint":"Missing letters should stay absent.","input":{"board":[["r","u"],["n","s"]],"words":["run","sun","rust","rune"]},"expected":["run","sun"]},
  {"id":"case-8","group":"Tier 1 · Easy · Core Rules","hint":"Tiny board boundary.","input":{"board":[["a"]],"words":["a","aa","b"]},"expected":["a"]},
  {"id":"case-9","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Backtracking must release visited cells.","input":{"board":[["a","b","c"],["d","e","f"],["g","h","i"]],"words":["abe","abcfi","adghe","cfi","beh","aei"]},"expected":["abcfi","abe","adghe","aei","beh","cfi"]},
  {"id":"case-10","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Same letter appears in many places.","input":{"board":[["a","a","r"],["t","a","e"],["s","n","d"]],"words":["art","are","ant","tan","tear","stand"]},"expected":["ant","are","stand","tan"]},
  {"id":"case-11","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Path may bend several times.","input":{"board":[["s","p","a"],["e","l","r"],["t","n","o"]],"words":["learn","plane","spare","stone","spelt"]},"expected":["spelt"]},
  {"id":"case-12","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Edges and corners both matter.","input":{"board":[["h","o","m"],["e","x","e"],["s","t","y"]],"words":["home","homex","sty","hey","most"]},"expected":["home","homex","sty"]},
  {"id":"case-13","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Diagonal-only links should be valid.","input":{"board":[["d","x","x"],["x","i","x"],["x","x","g"]],"words":["dig","did","gig","di"]},"expected":["di","dig"]},
  {"id":"case-14","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Reject paths that jump over cells.","input":{"board":[["a","x","b"],["x","x","x"],["c","x","d"]],"words":["ab","abcd","ac","ad"]},"expected":[]},
  {"id":"case-15","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Longer word through most of board.","input":{"board":[["a","b","c"],["h","g","d"],["i","f","e"]],"words":["abcdefghi","abcde","agfed","ihg"]},"expected":["abcde","abcdefghi","agfed","ihg"]},
  {"id":"case-16","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Several starts can lead to same word.","input":{"board":[["n","o","n"],["o","o","o"],["n","o","n"]],"words":["noon","non","on","oooo","nono"]},"expected":["non","nono","noon","on","oooo"]},
  {"id":"case-17","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Word order in dictionary should not matter.","input":{"board":[["w","o","r"],["d","l","a"],["s","e","r"]],"words":["laser","word","world","role","row"]},"expected":["role","row","world"]},
  {"id":"case-18","group":"Tier 2 · Easy+ · Backtracking Paths","hint":"Different valid paths with shared cells.","input":{"board":[["p","a","t"],["a","t","h"],["s","e","a"]],"words":["path","pat","peat","seat","tea"]},"expected":["pat","path","seat","tea"]},
  {"id":"case-19","group":"Tier 3 · Medium · Prefix Pruning","hint":"Short word is also a prefix.","input":{"board":[["a","r","t"],["i","s","t"],["x","x","x"]],"words":["art","artist","arts","ar","rat"]},"expected":["ar","art","arts"]},
  {"id":"case-20","group":"Tier 3 · Medium · Prefix Pruning","hint":"Many words share a prefix.","input":{"board":[["c","a","r","t"],["a","r","e","s"],["t","s","d","o"]],"words":["car","care","card","cards","cart","carts","carte"]},"expected":["car","card","cards","care","cart","carte","carts"]},
  {"id":"case-21","group":"Tier 3 · Medium · Prefix Pruning","hint":"Dead prefixes should be cut quickly.","input":{"board":[["z","o","o"],["n","e","x"],["a","b","c"]],"words":["zoo","zone","zoom","zoned","zebra","zen"]},"expected":["zen","zone","zoo"]},
  {"id":"case-22","group":"Tier 3 · Medium · Prefix Pruning","hint":"Dense prefix family on small board.","input":{"board":[["s","e","a"],["r","c","h"],["t","r","i"]],"words":["sea","search","seat","sear","scar","scare","char"]},"expected":["sea"]},
  {"id":"case-23","group":"Tier 3 · Medium · Prefix Pruning","hint":"Overlapping prefixes with different endings.","input":{"board":[["p","r","e"],["f","i","x"],["s","u","m"]],"words":["pre","prefix","pref","prem","fix","sum"]},"expected":["fix","pre","sum"]},
  {"id":"case-24","group":"Tier 3 · Medium · Prefix Pruning","hint":"Dictionary contains longer impossible extensions.","input":{"board":[["a","b"],["c","d"]],"words":["ab","abc","abcd","abcda","abcdab"]},"expected":["ab","abc","abcd"]},
  {"id":"case-25","group":"Tier 3 · Medium · Prefix Pruning","hint":"Single-board many prefix branches.","input":{"board":[["t","r","i"],["e","s","x"],["a","p","n"]],"words":["trie","tries","trip","trap","tree","ten"]},"expected":[]},
  {"id":"case-26","group":"Tier 3 · Medium · Prefix Pruning","hint":"Repeated prefix letters require distinct cells.","input":{"board":[["a","a","b"],["a","b","a"],["b","a","a"]],"words":["aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa"]},"expected":["aa","aaa","aaaa","aaaaa","aaaaaa"]},
  {"id":"case-27","group":"Tier 3 · Medium · Prefix Pruning","hint":"Words that differ by one final letter.","input":{"board":[["m","a","p"],["a","l","e"],["t","s","k"]],"words":["map","male","males","maps","mask","meal"]},"expected":["male","males","map","mask"]},
  {"id":"case-28","group":"Tier 3 · Medium · Prefix Pruning","hint":"Wide board with shared stems.","input":{"board":[["b","o","g","g","l","e"]],"words":["bog","boggle","boggler","ogle","glee"]},"expected":["bog","boggle"]},
  {"id":"case-29","group":"Tier 4 · Medium+ · Edge Cases","hint":"Empty board handling.","input":{"board":[],"words":["anything","a"]},"expected":[]},
  {"id":"case-30","group":"Tier 4 · Medium+ · Edge Cases","hint":"Empty dictionary handling.","input":{"board":[["a","b"],["c","d"]],"words":[]},"expected":[]},
  {"id":"case-31","group":"Tier 4 · Medium+ · Edge Cases","hint":"Rectangular board, not square.","input":{"board":[["a","l","g","o"],["r","i","t","h"]],"words":["algo","algorithm","log","lit","rig"]},"expected":["algo","lit","rig"]},
  {"id":"case-32","group":"Tier 4 · Medium+ · Edge Cases","hint":"Tall rectangular board.","input":{"board":[["b","o"],["a","r"],["d","s"],["x","y"]],"words":["board","boards","bored","boy","rod"]},"expected":["board","boards"]},
  {"id":"case-33","group":"Tier 4 · Medium+ · Edge Cases","hint":"Case with q and u as normal cells.","input":{"board":[["q","u","i"],["z","z","t"],["a","x","y"]],"words":["quit","quiz","qi","quitz"]},"expected":["quit","quitz","quiz"]},
  {"id":"case-34","group":"Tier 4 · Medium+ · Edge Cases","hint":"All cells have the same letter.","input":{"board":[["a","a","a"],["a","a","a"],["a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaaaaaa","aaaaaaaaaa"]},"expected":["a","aa","aaa","aaaa","aaaaaaaaa"]},
  {"id":"case-35","group":"Tier 4 · Medium+ · Edge Cases","hint":"One row with repeated letters.","input":{"board":[["l","e","v","e","l"]],"words":["level","eve","lee","lev","veil"]},"expected":["eve","lev","level"]},
  {"id":"case-36","group":"Tier 4 · Medium+ · Edge Cases","hint":"One column with repeated letters.","input":{"board":[["r"],["a"],["d"],["a"],["r"]],"words":["radar","ada","rar","rad","arr"]},"expected":["ada","rad","radar"]},
  {"id":"case-37","group":"Tier 4 · Medium+ · Edge Cases","hint":"Board contains distractor islands.","input":{"board":[["c","o","d","e"],["x","x","x","r"],["p","l","a","y"]],"words":["code","coder","play","player","clay"]},"expected":["code","coder","play"]},
  {"id":"case-38","group":"Tier 4 · Medium+ · Edge Cases","hint":"Words can start from bottom-right.","input":{"board":[["x","x","e"],["x","d","o"],["c","b","a"]],"words":["abc","abcd","abcde","ado","cab"]},"expected":["abc","abcd","abcde","ado"]},
  {"id":"case-39","group":"Tier 4 · Medium+ · Edge Cases","hint":"Long path across a 4x4 board.","input":{"board":[["a","b","c","d"],["h","g","f","e"],["i","j","k","l"],["p","o","n","m"]],"words":["abcdefghijklmnop","abcdefgh","ponm","afkp"]},"expected":["abcdefgh","abcdefghijklmnop","ponm"]},
  {"id":"case-40","group":"Tier 4 · Medium+ · Edge Cases","hint":"Mixed small words and longer words.","input":{"board":[["s","o","l"],["v","e","r"],["a","i","m"]],"words":["solve","solver","soil","rim","aim","some"]},"expected":["aim","rim"]},
  {"id":"case-41","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["t","r","a","c","e"],["s","e","a","r","c"],["p","a","t","h","s"],["l","o","g","i","c"],["d","e","b","u","g"]],"words":["trace","search","paths","logic","debug","graph","tree","tries","teach","coach"]},"expected":["debug","logic","paths","search","trace"],"hint":"Several rules combine on a larger board."},
  {"id":"case-42","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["a","b","c","d","e"],["j","i","h","g","f"],["k","l","m","n","o"],["t","s","r","q","p"],["u","v","w","x","y"]],"words":["abcdef","abcdefghij","abcdefghijklmnopqrstuvwxy","jihg","klmno","ponm","uvwxy"]},"expected":["abcdef","abcdefghij","abcdefghijklmnopqrstuvwxy","jihg","klmno","ponm","uvwxy"],"hint":"Long snake-like paths should still work."},
  {"id":"case-43","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["n","e","u","r","a"],["l","t","r","i","e"],["g","r","a","p","h"],["d","y","n","a","m"],["i","c","s","e","t"]],"words":["neural","trie","graph","dynamic","set","path","metric","train","grid"]},"expected":["graph","set","trie"],"hint":"Do not infer words from theme; only paths count."},
  {"id":"case-44","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["a","a","a","b"],["a","b","a","a"],["b","a","a","b"],["a","a","b","a"]],"words":["aaaaab","abababa","baaaaa","bbbb","aaaaaaaaaaaa","aaabaaa","baba"]},"expected":["aaaaab","aaabaaa","abababa","baaaaa","baba"],"hint":"Repeated letters require careful visited state."},
  {"id":"case-45","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["w","o","r","d"],["l","a","d","d"],["e","r","x","s"],["b","f","s","q"]],"words":["word","ladder","bfs","words","add","read","dare","wolf"]},"expected":["add","bfs","dare","read","word","words"],"hint":"Mixed short and medium words share board cells."},
  {"id":"case-46","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["h","e","a","p"],["s","t","a","c"],["k","q","u","e"],["u","e","x","y"]],"words":["heap","stack","queue","queues","quest","quick","case","push"]},"expected":["heap","queue"],"hint":"Treat q and u as separate normal cells."},
  {"id":"case-47","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["d","p","a","l"],["y","n","m","g"],["r","o","i","t"],["h","c","s","m"]],"words":["dynamic","program","algorithm","logic","math","graph","dp"]},"expected":["dp","dynamic"],"hint":"Short words and long impossible words coexist."},
  {"id":"case-48","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["b","o","g","g","l"],["e","s","o","l","v"],["t","r","i","e","r"],["p","a","t","h","s"],["c","o","d","e","x"]],"words":["boggle","solver","trie","tries","paths","code","search","graph","rove","lost"]},"expected":["boggle","code","lost","paths","solver","trie","tries"],"hint":"Trie words may share many prefixes and cells."},
  {"id":"case-49","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["x","y","z","q"],["u","i","o","p"],["a","s","d","f"],["g","h","j","k"]],"words":["quiz","quio","asdf","ghjk","yui","poi","zop","xua"]},"expected":["asdf","ghjk","poi","xua","yui","zop"],"hint":"Reverse and diagonal movement can both matter."},
  {"id":"case-50","group":"Tier 5 · Hard · Mixed Rule Stacks","input":{"board":[["r","e","c","u","r"],["s","i","o","n","x"],["b","a","c","k","t"],["r","a","c","k","i"],["n","g","z","z","z"]],"words":["recursion","backtracking","stack","rack","tracking","cactus","reason","song"]},"expected":["rack"],"hint":"A tempting long word may still be impossible."},
  {"id":"case-51","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"A board row may be empty.","input":{"board":[[]],"words":["","a","aa"]},"expected":[]},
  {"id":"case-52","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"Empty dictionary words should not count as paths.","input":{"board":[["a","b"],["c","d"]],"words":["","a","ab","abc","abcd"]},"expected":["a","ab","abc","abcd"]},
  {"id":"case-53","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"One word can have many paths but appears once.","input":{"board":[["a","b","a"],["b","a","b"],["a","b","a"]],"words":["aba","aba","abba","baa","aaaa"]},"expected":["aba","abba","baa"]},
  {"id":"case-54","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"A word longer than the number of cells is impossible.","input":{"board":[["a","b"],["c","d"]],"words":["abcd","abcda","abcdabc","dcba"]},"expected":["abcd","dcba"]},
  {"id":"case-55","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"A path may use every cell exactly once.","input":{"board":[["a","b","c"],["f","e","d"]],"words":["abcdef","fedcba","abcfed","afedcb"]},"expected":["abcdef","afedcb","fedcba"]},
  {"id":"case-56","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"All letters are the same; length still matters.","input":{"board":[["a","a"],["a","a"]],"words":["a","aa","aaa","aaaa","aaaaa"]},"expected":["a","aa","aaa","aaaa"]},
  {"id":"case-57","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"Repeated target letters need distinct board cells.","input":{"board":[["l","e","t"],["t","e","r"],["x","x","x"]],"words":["letter","let","tee","tree","ter"]},"expected":["let","tee","ter","tree"]},
  {"id":"case-58","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"Words can start from any corner.","input":{"board":[["n","e","s"],["w","x","e"],["s","w","n"]],"words":["new","news","sew","swen","west"]},"expected":["new","news","sew","swen"]},
  {"id":"case-59","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"A valid path may zigzag through diagonals.","input":{"board":[["z","a","z"],["b","c","d"],["z","e","z"]],"words":["ace","zacd","zce","abcde","zed"]},"expected":["abcde","ace","zacd","zce","zed"]},
  {"id":"case-60","group":"Tier 5 · Hard · Mixed Rule Stacks","hint":"Do not connect non-neighboring cells.","input":{"board":[["a","x","b"],["x","x","x"],["c","x","d"]],"words":["ab","ac","bd","cd","ax"]},"expected":["ax"]},
  {"id":"case-61","group":"Tier 6 · Hard · Corner Cases","hint":"Single-letter words should work with duplicates.","input":{"board":[["b","b"],["b","c"]],"words":["b","b","c","d","bb","bc"]},"expected":["b","bb","bc","c"]},
  {"id":"case-62","group":"Tier 6 · Hard · Corner Cases","hint":"No horizontal wrapping across row ends.","input":{"board":[["a","b","c","d"]],"words":["abcd","dcba","da","ad","bcda"]},"expected":["abcd","dcba"]},
  {"id":"case-63","group":"Tier 6 · Hard · Corner Cases","hint":"No vertical wrapping across column ends.","input":{"board":[["a"],["b"],["c"],["d"]],"words":["abcd","dcba","da","ad","bcda"]},"expected":["abcd","dcba"]},
  {"id":"case-64","group":"Tier 6 · Hard · Corner Cases","hint":"A word node can also have children in the Trie.","input":{"board":[["c","a","r"],["t","e","d"],["s","x","y"]],"words":["car","care","cared","cart","card","cars"]},"expected":["car","card","care","cared"]},
  {"id":"case-65","group":"Tier 6 · Hard · Corner Cases","hint":"Dictionary order and duplicates should not affect output.","input":{"board":[["g","o"],["o","d"]],"words":["good","go","dog","god","go","od",""]},"expected":["dog","go","god","good","od"]},
  {"id":"case-66","group":"Tier 6 · Hard · Corner Cases","hint":"A path can move backward after moving forward.","input":{"board":[["a","b","c"],["d","e","f"],["g","h","i"]],"words":["cba","fed","ihg","iea","gec"]},"expected":["cba","fed","gec","iea","ihg"]},
  {"id":"case-67","group":"Tier 6 · Hard · Corner Cases","hint":"Cells become available again for another word.","input":{"board":[["s","e"],["a","t"]],"words":["seat","eat","tea","set","sea"]},"expected":["eat","sea","seat","set","tea"]},
  {"id":"case-68","group":"Tier 6 · Hard · Corner Cases","hint":"The same board supports several overlapping answers.","input":{"board":[["r","a","i"],["n","t","e"],["s","o","n"]],"words":["rain","train","rate","tone","stone","son"]},"expected":["rate","son","stone","tone"]},
  {"id":"case-69","group":"Tier 6 · Hard · Corner Cases","hint":"Literal q/u cells, no special Boggle tile behavior.","input":{"board":[["q","u"],["a","d"]],"words":["q","qu","quad","qa","quid","uad"]},"expected":["q","qa","qu","quad","uad"]},
  {"id":"case-70","group":"Tier 6 · Hard · Corner Cases","hint":"False positives can come from letter frequency only.","input":{"board":[["a","b"],["c","d"]],"words":["aabb","abcdd","dacb","bb","cc"]},"expected":["dacb"]},
  {"id":"case-71","group":"Tier 6 · Hard · Corner Cases","hint":"A longer word can fail even when every short piece passes.","input":{"board":[["s","t","a"],["r","e","p"],["x","x","x"]],"words":["star","stare","strap","step","tape"]},"expected":["step","tape"]},
  {"id":"case-72","group":"Tier 6 · Hard · Corner Cases","hint":"A 2x3 board still uses all 8 local directions.","input":{"board":[["p","y","t"],["h","o","n"]],"words":["python","pytho","ton","pony","hot"]},"expected":["hot","pony","ton"]},
  {"id":"case-73","group":"Tier 6 · Hard · Corner Cases","hint":"Words may share a prefix but split late.","input":{"board":[["s","h","a"],["r","e","d"],["p","i","n"]],"words":["share","shared","shard","shine","ship"]},"expected":[]},
  {"id":"case-74","group":"Tier 6 · Hard · Corner Cases","hint":"Reject paths that revisit the start cell.","input":{"board":[["a","b"],["b","a"]],"words":["aba","abba","abab","aaaa","baa"]},"expected":["aba","abab","abba","baa"]},
  {"id":"case-75","group":"Tier 6 · Hard · Corner Cases","hint":"All candidate words can be absent.","input":{"board":[["m","n"],["o","p"]],"words":["aaa","xyz","moon","popo","nomad"]},"expected":[]},
  {"id":"case-76","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Many incremental prefixes on a long path.","input":{"board":[["a","b","c","d"],["h","g","f","e"],["i","j","k","l"],["p","o","n","m"]],"words":["a","ab","abc","abcd","abcde","abcdef","abcdefgh","abcdefghijklmnop","abcdefghijklmnopq"]},"expected":["a","ab","abc","abcd","abcde","abcdef","abcdefgh","abcdefghijklmnop"]},
  {"id":"case-77","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"A repeated-letter board can explode without pruning.","input":{"board":[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa","aaaaaaaaaaa","aaaaaaaaaaaa","aaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaa"]},"expected":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa","aaaaaaaaaaa","aaaaaaaaaaaa","aaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaa"]},
  {"id":"case-78","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Checkerboard letters create many possible paths.","input":{"board":[["a","b","a","b"],["b","a","b","a"],["a","b","a","b"],["b","a","b","a"]],"words":["abab","baba","abba","baab","abababab","bbbb","aaaaa"]},"expected":["aaaaa","abab","abababab","abba","baab","baba","bbbb"]},
  {"id":"case-79","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Dead prefixes should stop early.","input":{"board":[["p","r","e"],["f","i","x"],["t","r","y"]],"words":["pre","pref","prefix","prefixes","preview","prevent","try","trie"]},"expected":["pre","trie","try"]},
  {"id":"case-80","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"A found word should not delete longer descendants.","input":{"board":[["a","n","t"],["e","r","s"],["x","y","z"]],"words":["an","ant","ante","enter","ants","answer"]},"expected":["an","ant","ants"]},
  {"id":"case-81","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Larger board with many thematic distractors.","input":{"board":[["a","l","g","o","r"],["i","t","h","m","s"],["d","a","t","a","x"],["s","t","r","u","c"],["t","u","r","e","s"]],"words":["algo","algorithm","data","structure","structures","strut","tree","tries","math"]},"expected":["algo","data","math","strut"]},
  {"id":"case-82","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Long snake path on a 5x5 board.","input":{"board":[["a","b","c","d","e"],["j","i","h","g","f"],["k","l","m","n","o"],["t","s","r","q","p"],["u","v","w","x","y"]],"words":["abcde","abcdefghij","abcdefghijklmnopqrstuvwxy","yxwvut","klmnop","afkp"]},"expected":["abcde","abcdefghij","abcdefghijklmnopqrstuvwxy","klmnop","yxwvut"]},
  {"id":"case-83","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Wide rows should not wrap.","input":{"board":[["m","a","c","h","i","n","e","s"]],"words":["machine","machines","seman","smachine","em"]},"expected":["machine","machines"]},
  {"id":"case-84","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Tall columns should not wrap.","input":{"board":[["l"],["e"],["a"],["r"],["n"],["i"],["n"],["g"]],"words":["learn","learning","gninrael","leg","ng"]},"expected":["gninrael","learn","learning","ng"]},
  {"id":"case-85","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Many dictionary words are near misses.","input":{"board":[["c","o","m","p"],["l","e","x","i"],["t","y","a","b"],["g","r","i","d"]],"words":["complex","complexity","grid","grip","comp","code","logic","trial","text"]},"expected":["comp","grid"]},
  {"id":"case-86","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Large duplicate dictionary should still produce unique results.","input":{"board":[["d","e","d"],["e","d","e"],["d","e","d"]],"words":["ded","ded","deed","deed","eded","dead","eded"]},"expected":["ded","deed","eded"]},
  {"id":"case-87","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Several words share suffixes but not prefixes.","input":{"board":[["c","o","d"],["n","o","d"],["r","o","d"]],"words":["code","node","rode","mode","cod","rod","nod"]},"expected":["cod","nod","rod"]},
  {"id":"case-88","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Letter counts can rule out impossible long words.","input":{"board":[["a","b","c"],["d","e","f"],["g","h","i"]],"words":["aaaa","abcdefghi","abcdefghe","ihgfedcba","aei","ceg"]},"expected":["aei","ceg"]},
  {"id":"case-89","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Dense board with repeated starts and dead branches.","input":{"board":[["s","e","a","r"],["c","h","s","e"],["a","r","c","h"],["x","y","z","s"]],"words":["search","sea","arch","arches","sear","share","chars","erase"]},"expected":["arch","arches","chars","erase","sea","sear","share"]},
  {"id":"case-90","group":"Tier 7 · Very Hard · Performance & Pruning","hint":"Multiple independent regions should not be merged by mistake.","input":{"board":[["c","a","t","x"],["x","x","x","x"],["d","o","g","x"],["x","p","i","g"]],"words":["cat","dog","pig","catdog","dig","pog"]},"expected":["cat","dog","pig","pog"]},
  {"id":"case-91","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["t","r","i","e"],["b","a","c","k"],["s","e","a","r"],["c","h","x","y"]],"words":["trie","back","search","trace","teach","cache","stack"]},"expected":["back","trace","trie"],"hint":"Mixed backtracking words with distracting near matches."},
  {"id":"case-92","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["a","b","a","c"],["b","a","c","a"],["a","c","a","b"],["c","a","b","a"]],"words":["abacab","cababa","aaaa","cccc","bacaba","abcabc"]},"expected":["aaaa","abacab","abcabc","bacaba","cababa","cccc"],"hint":"Repeated small alphabet with many alternative paths."},
  {"id":"case-93","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["q","u","e","u","e"],["s","t","a","c","k"],["h","e","a","p","s"],["g","r","a","p","h"],["t","r","i","e","s"]],"words":["queue","stack","heaps","graph","tries","quest","quick","shape"]},"expected":["graph","heaps","queue","stack","tries"],"hint":"Literal q/u cells and several algorithm terms."},
  {"id":"case-94","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["r","e","c","u"],["r","s","i","o"],["n","b","a","c"],["k","t","r","a"]],"words":["recursion","backtrack","track","stack","race","brain"]},"expected":[],"hint":"Long tempting words may still have no valid path."},
  {"id":"case-95","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["x","a","x","a","x"],["a","x","a","x","a"],["x","a","x","a","x"],["a","x","a","x","a"],["x","a","x","a","x"]],"words":["xaxaxa","aaaaaa","xxxxxxxx","axaxaxaxa","xxxxxxxxxxxxxxxxxxxxxxxxxx"]},"expected":["aaaaaa","axaxaxaxa","xaxaxa","xxxxxxxx"],"hint":"Checkerboard-like repetition with length limits."},
  {"id":"case-96","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["s","o","r","t"],["e","d","g","e"],["p","a","t","h"],["n","o","d","e"]],"words":["sort","edge","path","node","graph","heap","stone","ended"]},"expected":["edge","node","path","sort"],"hint":"Several row words plus near thematic distractors."},
  {"id":"case-97","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["m","i","n","d"],["a","p","s","e"],["r","o","u","t"],["e","s","t","s"]],"words":["mind","map","maps","route","routes","test","tests","mist"]},"expected":["map","maps","mind","mist","route","routes"],"hint":"Overlapping medium words in a compact board."},
  {"id":"case-98","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["l","o","n","g"],["p","r","e","f"],["i","x","t","r"],["i","e","s","z"]],"words":["long","prefix","prefixes","tries","tree","freeze","grip"]},"expected":["long","tries"],"hint":"Prefix-looking words that still require real paths."},
  {"id":"case-99","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["a","b","c","d","e","f"],["l","k","j","i","h","g"],["m","n","o","p","q","r"],["x","w","v","u","t","s"]],"words":["abcdefghijkl","abcdefghijklmnopqr","abcdefghijklmnopqrstuvwx","lkjihg","mnopqr","xwvuts"]},"expected":["abcdefghijkl","abcdefghijklmnopqr","abcdefghijklmnopqrstuvwx","lkjihg","mnopqr","xwvuts"],"hint":"Long rectangular snake paths and reversals."},
  {"id":"case-100","group":"Tier 8 · Hard · Integration Challenge","input":{"board":[["b","o","g","g","l","e"],["s","o","l","v","e","r"],["t","r","i","e","x","y"],["p","a","t","h","s","z"]],"words":["boggle","solver","trie","tries","path","paths","solve","boggler","style"]},"expected":["boggle","boggler","path","paths","solve","solver","trie","tries"],"hint":"A larger Boggle-themed board with shared stems."},
  {"id":"case-101","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Larger snake board with forward and reverse paths.","input":{"board":[["a","b","c","d","e","f"],["l","k","j","i","h","g"],["m","n","o","p","q","r"],["x","w","v","u","t","s"],["y","z","a","b","c","d"],["j","i","h","g","f","e"]],"words":["abcdef","abcdefghijkl","abcdefghijklmnop","ponmlk","uvwxyz","fedcba","afkpuz","ghij"]},"expected":["abcdef","abcdefghijkl","abcdefghijklmnop","fedcba","ghij","ponmlk","uvwxyz"]},
  {"id":"case-102","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Rectangular board with several algorithm words.","input":{"board":[["b","a","c","k","t","r","a"],["i","n","g","d","f","s","k"],["p","r","e","f","i","x","p"],["s","o","l","v","e","r","x"]],"words":["back","backtracking","dfs","prefix","solver","trie","graph","stack","track","king"]},"expected":["back","dfs","prefix","solver"]},
  {"id":"case-103","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Dense repeated letters with duplicates and long paths.","input":{"board":[["a","a","a","a","a","b"],["a","b","b","b","b","a"],["a","b","c","c","b","a"],["a","b","b","b","b","a"],["a","a","a","a","a","b"]],"words":["aaaaa","aaaaab","abccba","abcba","bbbbbb","cccc","abbaabba","bacab"]},"expected":["aaaaa","aaaaab","abbaabba","abcba","abccba","bbbbbb"]},
  {"id":"case-104","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Multiple rows should not be accidentally connected by wrapping.","input":{"board":[["m","n","o","p","q","r"],["l","k","j","i","h","s"],["a","b","c","d","e","f"],["z","y","x","w","v","u"]],"words":["mnopqr","rstuv","abcdef","fedcba","hijkl","uvwxyz","qponm","azby"]},"expected":["abcdef","azby","fedcba","hijkl","mnopqr","qponm","uvwxyz"]},
  {"id":"case-105","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Several short target words on a wider board.","input":{"board":[["s","e","a","r","c","h"],["t","r","i","e","x","x"],["p","a","t","h","x","x"],["w","o","r","d","x","x"]],"words":["search","trie","path","word","seat","thread","shore","sword","tried"]},"expected":["path","search","trie","word"]},
  {"id":"case-106","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Keyboard-like layout with diagonal and vertical paths.","input":{"board":[["q","w","e","r","t","y"],["a","s","d","f","g","h"],["z","x","c","v","b","n"]],"words":["qwerty","asdf","zxcv","qaz","wsx","edc","rfv","tgb","yhn","qweasd"]},"expected":["asdf","edc","qaz","qwerty","rfv","tgb","wsx","yhn","zxcv"]},
  {"id":"case-107","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Palindrome-looking words still need real paths.","input":{"board":[["l","e","v","e","l"],["r","a","d","a","r"],["r","e","f","e","r"],["c","i","v","i","c"]],"words":["level","radar","refer","civic","reviver","deed","racecar","redder"]},"expected":["civic","level","radar","refer"]},
  {"id":"case-108","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Math-themed distractors should not be inferred.","input":{"board":[["m","a","t","r","i","x"],["v","e","c","t","o","r"],["s","c","a","l","a","r"],["t","e","n","s","o","r"]],"words":["matrix","vector","scalar","tensor","trace","rank","minor","latex","vertex"]},"expected":["matrix","scalar","tensor","vector"]},
  {"id":"case-109","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Mixed valid row paths and impossible long diagonals.","input":{"board":[["a","b","c","d","e","f"],["g","h","i","j","k","l"],["m","n","o","p","q","r"],["s","t","u","v","w","x"],["y","z","a","b","c","d"]],"words":["abcdef","ghijkl","mnopqr","stuvwx","yzabcd","afkpuz","plhd","xwvuts","dinsx"]},"expected":["abcdef","ghijkl","mnopqr","stuvwx","xwvuts","yzabcd"]},
  {"id":"case-110","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Checkerboard paths create many alternatives.","input":{"board":[["a","b","a","b","a","b"],["b","a","b","a","b","a"],["a","b","a","b","a","b"],["b","a","b","a","b","a"]],"words":["ababab","baba","abba","baab","ababababab","bbbbbb","aaaaaa","abababababababababababab"]},"expected":["aaaaaa","ababab","ababababab","abababababababababababab","abba","baab","baba","bbbbbb"]},
  {"id":"case-111","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Words can be hidden across row boundaries only if adjacent.","input":{"board":[["c","o","d","i","n","g"],["m","e","n","t","o","r"],["a","i","b","o","t","x"],["l","e","s","s","o","n"]],"words":["coding","mentor","lesson","code","bot","ai","mental","stone","toner"]},"expected":["ai","bot","code","coding","lesson","mentor","stone"]},
  {"id":"case-112","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Single long row should remain one-dimensional.","input":{"board":[["a","b","c","d","e","f","g"]],"words":["a","ab","abc","abcdefg","gfedcba","ace","bd","abcdefgh"]},"expected":["a","ab","abc","abcdefg","gfedcba"]},
  {"id":"case-113","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Single tall column should remain one-dimensional.","input":{"board":[["h"],["g"],["f"],["e"],["d"],["c"],["b"],["a"]],"words":["hgfedcba","abcdefg","hgf","fed","ha","ah","abcdh"]},"expected":["abcdefg","fed","hgf","hgfedcba"]},
  {"id":"case-114","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Literal q and u cells on a larger board.","input":{"board":[["q","u","a","r","t","z"],["p","y","t","h","o","n"],["j","i","g","s","a","w"],["l","a","m","b","d","a"]],"words":["quartz","python","jigsaw","lambda","quiz","quota","theta","data","java"]},"expected":["jigsaw","lambda","python","quartz"]},
  {"id":"case-115","group":"Tier 9 · Very Hard · Scale and Shape","hint":"Letter blocks should handle long paths without reuse.","input":{"board":[["a","a","a","a","a","a"],["a","a","a","a","a","a"],["b","b","b","b","b","b"],["b","b","b","b","b","b"]],"words":["aaaaaa","bbbbbb","ababab","bababa","aaaaab","bbbbaa","aaaaaaaaaaaa","bbbbbbbbbbbb"]},"expected":["aaaaaa","aaaaaaaaaaaa","aaaaab","ababab","bababa","bbbbaa","bbbbbb","bbbbbbbbbbbb"]},
  {"id":"case-116","group":"Tier 10 · Performance · Prefix Pruning","hint":"Many near-miss words share a long prefix.","input":{"board":[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaabaa","aaaaaabba","aaaaaabca","aaaaaabda","aaaaaabea","aaaaaabfa","aaaaaabga","aaaaaabha","aaaaaabia","aaaaaabja","aaaaaabka","aaaaaabla","aaaaaabma","aaaaaabna","aaaaaaboa","aaaaaabpa","aaaaaabqa","aaaaaabra","aaaaaabsa","aaaaaabta"]},"expected":["a","aa","aaa","aaaa","aaaaa","aaaaaa"],"timeLimitMs":750},
  {"id":"case-117","group":"Tier 10 · Performance · Prefix Pruning","hint":"A slightly deeper repeated-letter prefix.","input":{"board":[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaacaa","aaaaaaacba","aaaaaaacca","aaaaaaacda","aaaaaaacea","aaaaaaacfa","aaaaaaacga","aaaaaaacha","aaaaaaacia","aaaaaaacja"]},"expected":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa"],"timeLimitMs":1000},
  {"id":"case-118","group":"Tier 10 · Performance · Prefix Pruning","hint":"Repeated starts reward shared prefix search.","input":{"board":[["s","s","s","s"],["s","s","s","s"],["s","s","s","s"],["s","s","s","s"]],"words":["s","ss","sss","ssss","sssss","ssssss","sssssstaa","sssssstba","sssssstca","sssssstda","sssssstea","sssssstfa","sssssstga","sssssstha","sssssstia","sssssstja","sssssstka","sssssstla","sssssstma","sssssstna","sssssstoa","sssssstpa","sssssstqa","sssssstra","sssssstsa","sssssstta","sssssstua","sssssstva"]},"expected":["s","ss","sss","ssss","sssss","ssssss"],"timeLimitMs":750},
  {"id":"case-119","group":"Tier 10 · Performance · Prefix Pruning","hint":"Near misses differ only after the same prefix.","input":{"board":[["c","c","c","c"],["c","c","c","c"],["c","c","c","c"],["c","c","c","c"]],"words":["c","cc","ccc","cccc","ccccc","cccccc","ccccccdaa","ccccccdba","ccccccdca","ccccccdda","ccccccdea","ccccccdfa","ccccccdga","ccccccdha","ccccccdia","ccccccdja","ccccccdka","ccccccdla","ccccccdma","ccccccdna","ccccccdoa","ccccccdpa","ccccccdqa","ccccccdra","ccccccdsa","ccccccdta","ccccccdua","ccccccdva","ccccccdwa","ccccccdxa"]},"expected":["c","cc","ccc","cccc","ccccc","cccccc"],"timeLimitMs":750},
  {"id":"case-120","group":"Tier 10 · Performance · Prefix Pruning","hint":"Checkerboard has many matching prefix paths.","input":{"board":[["a","b","a","b"],["b","a","b","a"],["a","b","a","b"],["b","a","b","a"]],"words":["ababab","bababa","abababa","bababab","abababcaa","abababcba","abababcca","abababcda","abababcea","abababcfa","abababcga","abababcha","abababcia","abababcja","abababcka","abababcla","abababcma","abababcna","abababcoa","abababcpa","abababcqa","abababcra","abababcsa","abababcta"]},"expected":["ababab","abababa","bababa","bababab"]},
  {"id":"case-121","group":"Tier 10 · Performance · Prefix Pruning","hint":"Alternating prefixes branch across many cells.","input":{"board":[["a","b","a","b"],["b","a","b","a"],["a","b","a","b"],["b","a","b","a"]],"words":["babab","ababa","abababab","babababdaa","babababdba","babababdca","babababdda","babababdea","babababdfa","babababdga","babababdha","babababdia","babababdja","babababdka","babababdla","babababdma","babababdna","babababdoa","babababdpa","babababdqa","babababdra"]},"expected":["ababa","abababab","babab"]},
  {"id":"case-122","group":"Tier 10 · Performance · Prefix Pruning","hint":"One rare letter appears near many repeated cells.","input":{"board":[["a","a","a","a"],["a","a","b","a"],["a","a","a","a"],["a","a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaa","aaaaab","aaaaaabaa","aaaaaabba","aaaaaabca","aaaaaabda","aaaaaabea","aaaaaabfa","aaaaaabga","aaaaaabha","aaaaaabia","aaaaaabja","aaaaaabka","aaaaaabla","aaaaaabma","aaaaaabna","aaaaaaboa","aaaaaabpa","aaaaaabqa","aaaaaabra","aaaaaabsa","aaaaaabta","aaaaaabua","aaaaaabva","aaaaaabwa","aaaaaabxa","aaaaaabya","aaaaaabza","aaaaaabab","aaaaaabbb","aaaaaabcb","aaaaaabdb","aaaaaabeb","aaaaaabfb","aaaaaabgb","aaaaaabhb","aaaaaabib","aaaaaabjb","aaaaaabkb","aaaaaablb","aaaaaabmb","aaaaaabnb"]},"expected":["a","aa","aaa","aaaa","aaaaa","aaaaaabaa","aaaaab"],"timeLimitMs":900},
  {"id":"case-123","group":"Tier 10 · Performance · Prefix Pruning","hint":"Same-letter board with impossible endings.","input":{"board":[["e","e","e","e"],["e","e","e","e"],["e","e","e","e"],["e","e","e","e"]],"words":["e","ee","eee","eeee","eeeee","eeeeee","eeeeeefaa","eeeeeefba","eeeeeefca","eeeeeefda","eeeeeefea","eeeeeeffa","eeeeeefga","eeeeeefha","eeeeeefia","eeeeeefja","eeeeeefka","eeeeeefla","eeeeeefma","eeeeeefna","eeeeeefoa","eeeeeefpa","eeeeeefqa","eeeeeefra","eeeeeefsa","eeeeeefta"]},"expected":["e","ee","eee","eeee","eeeee","eeeeee"],"timeLimitMs":750},
  {"id":"case-124","group":"Tier 10 · Performance · Prefix Pruning","hint":"Prefix pruning should avoid repeated full searches.","input":{"board":[["r","r","r","r"],["r","r","r","r"],["r","r","r","r"],["r","r","r","r"]],"words":["r","rr","rrr","rrrr","rrrrr","rrrrrr","rrrrrrsaa","rrrrrrsba","rrrrrrsca","rrrrrrsda","rrrrrrsea","rrrrrrsfa","rrrrrrsga","rrrrrrsha","rrrrrrsia","rrrrrrsja","rrrrrrska","rrrrrrsla","rrrrrrsma","rrrrrrsna","rrrrrrsoa","rrrrrrspa","rrrrrrsqa","rrrrrrsra","rrrrrrssa","rrrrrrsta"]},"expected":["r","rr","rrr","rrrr","rrrrr","rrrrrr"],"timeLimitMs":750},
  {"id":"case-125","group":"Tier 10 · Performance · Prefix Pruning","hint":"Large equivalent path space with shared stems.","input":{"board":[["t","t","t","t"],["t","t","t","t"],["t","t","t","t"],["t","t","t","t"]],"words":["t","tt","ttt","tttt","ttttt","tttttt","ttttttuaa","ttttttuba","ttttttuca","ttttttuda","ttttttuea","ttttttufa","ttttttuga","ttttttuha","ttttttuia","ttttttuja","ttttttuka","ttttttula","ttttttuma","ttttttuna","ttttttuoa","ttttttupa","ttttttuqa","ttttttura","ttttttusa","ttttttuta"]},"expected":["t","tt","ttt","tttt","ttttt","tttttt"],"timeLimitMs":750},
  {"id":"case-126","group":"Tier 10 · Performance · Prefix Pruning","hint":"Another repeated-letter stress case.","input":{"board":[["x","x","x","x"],["x","x","x","x"],["x","x","x","x"],["x","x","x","x"]],"words":["x","xx","xxx","xxxx","xxxxx","xxxxxx","xxxxxxyaa","xxxxxxyba","xxxxxxyca","xxxxxxyda","xxxxxxyea","xxxxxxyfa","xxxxxxyga","xxxxxxyha","xxxxxxyia","xxxxxxyja","xxxxxxyka","xxxxxxyla","xxxxxxyma","xxxxxxyna","xxxxxxyoa","xxxxxxypa","xxxxxxyqa","xxxxxxyra","xxxxxxysa","xxxxxxyta"]},"expected":["x","xx","xxx","xxxx","xxxxx","xxxxxx"],"timeLimitMs":750},
  {"id":"case-127","group":"Tier 10 · Performance · Prefix Pruning","hint":"Repeated row patterns create shared prefixes.","input":{"board":[["m","n","o","p"],["m","n","o","p"],["m","n","o","p"],["m","n","o","p"]],"words":["mnop","mnopm","mnopmn","mnopmno","mnopmnzaa","mnopmnzba","mnopmnzca","mnopmnzda","mnopmnzea","mnopmnzfa","mnopmnzga","mnopmnzha","mnopmnzia","mnopmnzja","mnopmnzka","mnopmnzla","mnopmnzma","mnopmnzna","mnopmnzoa","mnopmnzpa"]},"expected":["mnop"]},
  {"id":"case-128","group":"Tier 10 · Performance · Prefix Pruning","hint":"Repeated word-like rows with long near misses.","input":{"board":[["c","o","d","e"],["c","o","d","e"],["c","o","d","e"],["c","o","d","e"]],"words":["code","codec","codeco","codecoc","codecozaa","codecozba","codecozca","codecozda","codecozea","codecozfa","codecozga","codecozha","codecozia","codecozja","codecozka","codecozla","codecozma","codecozna","codecozoa","codecozpa"]},"expected":["code"]},
  {"id":"case-129","group":"Tier 10 · Performance · Prefix Pruning","hint":"No row wrapping, but many adjacent alternatives remain.","input":{"board":[["a","b","a","b"],["a","b","a","b"],["a","b","a","b"],["a","b","a","b"]],"words":["abab","ababa","ababab","abababzaa","abababzba","abababzca","abababzda","abababzea","abababzfa","abababzga","abababzha","abababzia","abababzja","abababzka","abababzla","abababzma","abababzna","abababzoa","abababzpa","abababzqa","abababzra"]},"expected":["abab","ababa","ababab"]},
  {"id":"case-130","group":"Tier 10 · Performance · Prefix Pruning","hint":"Rare branch plus repeated common prefix.","input":{"board":[["a","a","a","a"],["a","a","a","b"],["a","a","a","a"],["a","a","a","a"]],"words":["aaaaab","baaaaa","aaaab","aaaaaacaa","aaaaaacba","aaaaaacca","aaaaaacda","aaaaaacea","aaaaaacfa","aaaaaacga","aaaaaacha","aaaaaacia","aaaaaacja","aaaaaacka","aaaaaacla","aaaaaacma","aaaaaacna","aaaaaacoa","aaaaaacpa","aaaaaacqa","aaaaaacra","aaaaaacsa","aaaaaacta","aaaaaacua","aaaaaacva","aaaaaacwa","aaaaaacxa","aaaaaacya","aaaaaacza","aaaaaacab","aaaaaacbb","aaaaaaccb","aaaaaacdb"]},"expected":["aaaaab","aaaab","baaaaa"],"timeLimitMs":900},
  {"id":"case-131","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]],"words":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaabaa","aaaaaaabba","aaaaaaabca","aaaaaaabda","aaaaaaabea","aaaaaaabfa","aaaaaaabga","aaaaaaabha","aaaaaaabia","aaaaaaabja","aaaaaaabka","aaaaaaabla"]},"expected":["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa"],"timeLimitMs":1000},
  {"id":"case-132","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["a","b","a","b"],["b","a","b","a"],["a","b","a","b"],["b","a","b","a"]],"words":["abababab","babababa","abbaabba","abababdaa","abababdba","abababdca","abababdda","abababdea","abababdfa","abababdga","abababdha","abababdia","abababdja","abababdka","abababdla","abababdma","abababdna","abababdoa","abababdpa","abababdqa","abababdra","abababdsa","abababdta","abababdua","abababdva"]},"expected":["abababab","abbaabba","babababa"]},
  {"id":"case-133","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["p","p","p","p"],["p","p","p","p"],["p","p","p","p"],["p","p","p","p"]],"words":["p","pp","ppp","pppp","ppppp","pppppp","ppppppqaa","ppppppqba","ppppppqca","ppppppqda","ppppppqea","ppppppqfa","ppppppqga","ppppppqha","ppppppqia","ppppppqja","ppppppqka","ppppppqla","ppppppqma","ppppppqna","ppppppqoa","ppppppqpa","ppppppqqa","ppppppqra","ppppppqsa","ppppppqta","ppppppqua","ppppppqva","ppppppqwa","ppppppqxa"]},"expected":["p","pp","ppp","pppp","ppppp","pppppp"],"timeLimitMs":750},
  {"id":"case-134","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["t","r","i","e","t"],["r","i","e","t","r"],["i","e","t","r","i"],["e","t","r","i","e"],["t","r","i","e","t"]],"words":["trie","trietrie","rietriet","ietriet","tree","tries","trietrzaa","trietrzba","trietrzca","trietrzda","trietrzea","trietrzfa","trietrzga","trietrzha","trietrzia","trietrzja","trietrzka","trietrzla","trietrzma","trietrzna","trietrzoa","trietrzpa"]},"expected":["ietriet","rietriet","tree","trie","trietrie"]},
  {"id":"case-135","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["z","z","z","z"],["z","z","z","z"],["z","z","z","z"],["z","z","z","z"]],"words":["z","zz","zzz","zzzz","zzzzz","zzzzzz","zzzzzzaaa","zzzzzzaba","zzzzzzaca","zzzzzzada","zzzzzzaea","zzzzzzafa","zzzzzzaga","zzzzzzaha","zzzzzzaia","zzzzzzaja","zzzzzzaka","zzzzzzala","zzzzzzama","zzzzzzana","zzzzzzaoa","zzzzzzapa","zzzzzzaqa","zzzzzzara","zzzzzzasa","zzzzzzata","zzzzzzaua","zzzzzzava"]},"expected":["z","zz","zzz","zzzz","zzzzz","zzzzzz"],"timeLimitMs":750},
  {"id":"case-136","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["a","b","c","a","b","c"],["b","c","a","b","c","a"],["c","a","b","c","a","b"],["a","b","c","a","b","c"]],"words":["abcabc","bcabca","cabcab","abcabcabc","abcabczaa","abcabczba","abcabczca","abcabczda","abcabczea","abcabczfa","abcabczga","abcabczha","abcabczia","abcabczja","abcabczka","abcabczla","abcabczma","abcabczna","abcabczoa","abcabczpa","abcabczqa","abcabczra"]},"expected":["abcabc","abcabcabc","bcabca","cabcab"]},
  {"id":"case-137","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["s","o","l","v","e","r"],["b","o","g","g","l","e"],["t","r","i","e","x","x"],["p","a","t","h","y","y"]],"words":["solver","boggle","trie","path","boggler","solve","style","goblet"]},"expected":["boggle","boggler","path","solve","solver","trie"]},
  {"id":"case-138","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["a","b","c","d","e","f"],["f","e","d","c","b","a"],["g","h","i","j","k","l"],["l","k","j","i","h","g"]],"words":["abcdef","fedcba","ghijkl","lkjihg","afkp","plhd","abcdcba","gfe"]},"expected":["abcdcba","abcdef","fedcba","gfe","ghijkl","lkjihg"]},
  {"id":"case-139","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["a","a","a","a","a"],["a","b","b","b","a"],["a","b","c","b","a"],["a","b","b","b","a"],["a","a","a","a","a"]],"words":["abcba","abccba","aaaaa","bbbbb","cbbbb","aaaaabbbbbccccc"]},"expected":["aaaaa","abcba","bbbbb","cbbbb"]},
  {"id":"case-140","group":"Tier 11 · Final · No Hints","locked":true,"input":{"board":[["s","e","a","r","c","h"],["p","r","e","f","i","x"],["b","a","c","k","t","r"],["a","c","k","i","n","g"],["s","o","l","v","e","r"],["t","r","i","e","z","z"]],"words":["search","prefix","backtracking","solver","trie","checking","stack","graph","prune","searchzaa","searchzba","searchzca","searchzda","searchzea","searchzfa","searchzga","searchzha","searchzia","searchzja","searchzka","searchzla","searchzma","searchzna"]},"expected":["prefix","search","solver","trie"]}
]
```
