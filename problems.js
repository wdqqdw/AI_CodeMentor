window.CODEMENTOR_PROBLEMS = {
  currentProblemId: "two_sum",
  items: {
    two_sum: {
      id: "two_sum",
      category: "Array & Hashing",
      difficulty: "Easy",
      englishName: "Two Sum",
      chineseName: "两数之和",
      englishDescription:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2, 7, 11, 15], target = 9",
          output: "[0, 1]",
        },
        {
          input: "nums = [3, 2, 4], target = 6",
          output: "[1, 2]",
        },
      ],
      visibleTestCount: 3,
      initialCode: {
        python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}

        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []`,
        javascript: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
      },
      tests: [
        { id: "case-1", nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { id: "case-2", nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { id: "case-3", nums: [3, 3], target: 6, expected: [0, 1] },
        { id: "case-4", nums: [0, 4, 3, 0], target: 0, expected: [0, 3] },
        { id: "case-5", nums: [-1, -2, -3, -4, -5], target: -8, expected: [2, 4] },
        { id: "case-6", nums: [1, 5, 3, 9, 2], target: 11, expected: [3, 4] },
        { id: "case-7", nums: [10, -3, 4, 7], target: 1, expected: [1, 2] },
        { id: "case-8", nums: [100, 20, 30, 40], target: 70, expected: [2, 3] },
        { id: "case-9", nums: [5, 75, 25], target: 100, expected: [1, 2] },
        { id: "case-10", nums: [1, 2, 3, 4, 5, 6], target: 10, expected: [3, 5] },
      ],
    },
  },
};
