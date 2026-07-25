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
  {"id":"case-41","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["t","r","a","c","e"],["s","e","a","r","c"],["p","a","t","h","s"],["l","o","g","i","c"],["d","e","b","u","g"]],"words":["trace","search","paths","logic","debug","graph","tree","tries","teach","coach"]},"expected":["debug","logic","paths","search","trace"]},
  {"id":"case-42","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["a","b","c","d","e"],["j","i","h","g","f"],["k","l","m","n","o"],["t","s","r","q","p"],["u","v","w","x","y"]],"words":["abcdef","abcdefghij","abcdefghijklmnopqrstuvwxy","jihg","klmno","ponm","uvwxy"]},"expected":["abcdef","abcdefghij","abcdefghijklmnopqrstuvwxy","jihg","klmno","ponm","uvwxy"]},
  {"id":"case-43","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["n","e","u","r","a"],["l","t","r","i","e"],["g","r","a","p","h"],["d","y","n","a","m"],["i","c","s","e","t"]],"words":["neural","trie","graph","dynamic","set","path","metric","train","grid"]},"expected":["graph","set","trie"]},
  {"id":"case-44","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["a","a","a","b"],["a","b","a","a"],["b","a","a","b"],["a","a","b","a"]],"words":["aaaaab","abababa","baaaaa","bbbb","aaaaaaaaaaaa","aaabaaa","baba"]},"expected":["aaaaab","aaabaaa","abababa","baaaaa","baba"]},
  {"id":"case-45","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["w","o","r","d"],["l","a","d","d"],["e","r","x","s"],["b","f","s","q"]],"words":["word","ladder","bfs","words","add","read","dare","wolf"]},"expected":["add","bfs","dare","read","word","words"]},
  {"id":"case-46","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["h","e","a","p"],["s","t","a","c"],["k","q","u","e"],["u","e","x","y"]],"words":["heap","stack","queue","queues","quest","quick","case","push"]},"expected":["heap","queue"]},
  {"id":"case-47","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["d","p","a","l"],["y","n","m","g"],["r","o","i","t"],["h","c","s","m"]],"words":["dynamic","program","algorithm","logic","math","graph","dp"]},"expected":["dp","dynamic"]},
  {"id":"case-48","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["b","o","g","g","l"],["e","s","o","l","v"],["t","r","i","e","r"],["p","a","t","h","s"],["c","o","d","e","x"]],"words":["boggle","solver","trie","tries","paths","code","search","graph","rove","lost"]},"expected":["boggle","code","lost","paths","solver","trie","tries"]},
  {"id":"case-49","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["x","y","z","q"],["u","i","o","p"],["a","s","d","f"],["g","h","j","k"]],"words":["quiz","quio","asdf","ghjk","yui","poi","zop","xua"]},"expected":["asdf","ghjk","poi","xua","yui","zop"]},
  {"id":"case-50","group":"Tier 5 · Hard · Hidden Challenge","locked":true,"input":{"board":[["r","e","c","u","r"],["s","i","o","n","x"],["b","a","c","k","t"],["r","a","c","k","i"],["n","g","z","z","z"]],"words":["recursion","backtracking","stack","rack","tracking","cactus","reason","song"]},"expected":["rack"]}
]
```
