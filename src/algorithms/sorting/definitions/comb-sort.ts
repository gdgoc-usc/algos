import {
  buildSortedIndices,
  createRandomArray,
  swapIndices,
} from "@/algorithms/sorting/shared/utils";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best O(n log n), average O(n² / 2^p), worst O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Comb Sort improves Bubble Sort by comparing elements with a shrinking gap, which quickly moves small values toward the front and large values toward the end.",
};

const SHRINK_FACTOR = 1.3;

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const framesList: SortingAnimationFrame[] = [
    {
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: false,
      description: "Starting Comb Sort initialized with random values.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let gap = itemCount;
  let comparisons = 0;
  let swaps = 0;
  let swapped = true;

  while (gap !== 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / SHRINK_FACTOR));
    swapped = false;

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: `Starting pass with gap ${gap}.`,
    });

    for (let leftIndex = 0; leftIndex + gap < itemCount; leftIndex += 1) {
      const rightIndex = leftIndex + gap;
      comparisons += 1;

      framesList.push({
        array: [...currentArray],
        activeIndices: [leftIndex, rightIndex],
        blueIndices: [rightIndex],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Comparing ${currentArray[leftIndex]} and ${currentArray[rightIndex]} with gap ${gap}.`,
      });

      if (currentArray[leftIndex] > currentArray[rightIndex]) {
        currentArray = swapIndices(currentArray, leftIndex, rightIndex);
        swaps += 1;
        swapped = true;

        framesList.push({
          array: [...currentArray],
          activeIndices: [leftIndex, rightIndex],
          blueIndices: [rightIndex],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Swapped ${currentArray[rightIndex]} and ${currentArray[leftIndex]}.`,
        });
      }
    }
  }

  framesList.push({
    array: [...currentArray],
    activeIndices: null,
    sortedIndices: buildSortedIndices(itemCount),
    stats: { comparisons, swaps },
    completed: true,
    description: "Sorting completed!",
  });

  return framesList;
};

export const combSortDefinition: SortingAlgorithmDefinition = {
  slug: "comb-sort",
  details,
  generateFrames,
};
