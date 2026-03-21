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
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.",
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const framesList: SortingAnimationFrame[] = [
    {
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: false,
      description: "Starting Bubble Sort initialized with random values.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let comparisons = 0;
  let swaps = 0;
  let sortedIndices: number[] = [];

  for (let passIndex = 0; passIndex < itemCount - 1; passIndex += 1) {
    let swapped = false;

    for (
      let compareIndex = 0;
      compareIndex < itemCount - passIndex - 1;
      compareIndex += 1
    ) {
      comparisons += 1;

      framesList.push({
        array: [...currentArray],
        activeIndices: [compareIndex, compareIndex + 1],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `Comparing ${currentArray[compareIndex]} and ${currentArray[compareIndex + 1]}`,
      });

      if (currentArray[compareIndex] > currentArray[compareIndex + 1]) {
        currentArray = swapIndices(
          currentArray,
          compareIndex,
          compareIndex + 1,
        );
        swaps += 1;
        swapped = true;

        framesList.push({
          array: [...currentArray],
          activeIndices: [compareIndex, compareIndex + 1],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Swapped ${currentArray[compareIndex]} and ${currentArray[compareIndex + 1]}`,
        });
      }
    }

    const nextSortedIndex = itemCount - passIndex - 1;
    sortedIndices = [...sortedIndices, nextSortedIndex];

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps },
      completed: false,
      description: `${currentArray[nextSortedIndex]} is now sorted.`,
    });

    if (!swapped) {
      const remainingIndices = Array.from(
        { length: itemCount - passIndex - 1 },
        (_, index) => index,
      );
      sortedIndices = [...sortedIndices, ...remainingIndices];
      break;
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

export const bubbleSortDefinition: SortingAlgorithmDefinition = {
  slug: "bubble-sort",
  details,
  generateFrames,
};
