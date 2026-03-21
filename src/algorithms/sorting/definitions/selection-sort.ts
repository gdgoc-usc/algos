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
    "Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list.",
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
      description: "Starting Selection Sort initialized with random values.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let comparisons = 0;
  let swaps = 0;
  let sortedIndices: number[] = [];

  for (let sortedIndex = 0; sortedIndex < itemCount - 1; sortedIndex += 1) {
    let minimumIndex = sortedIndex;

    framesList.push({
      array: [...currentArray],
      activeIndices: [sortedIndex],
      blueIndices: [minimumIndex],
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps },
      completed: false,
      description: `Current minimum is at index ${minimumIndex} (value: ${currentArray[minimumIndex]})`,
    });

    for (
      let compareIndex = sortedIndex + 1;
      compareIndex < itemCount;
      compareIndex += 1
    ) {
      comparisons += 1;

      framesList.push({
        array: [...currentArray],
        activeIndices: [compareIndex],
        blueIndices: [minimumIndex],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `Checking if ${currentArray[compareIndex]} < ${currentArray[minimumIndex]}`,
      });

      if (currentArray[compareIndex] < currentArray[minimumIndex]) {
        minimumIndex = compareIndex;

        framesList.push({
          array: [...currentArray],
          activeIndices: [sortedIndex],
          blueIndices: [minimumIndex],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Found new minimum: ${currentArray[minimumIndex]} at index ${minimumIndex}`,
        });
      }
    }

    if (minimumIndex !== sortedIndex) {
      currentArray = swapIndices(currentArray, sortedIndex, minimumIndex);
      swaps += 1;

      framesList.push({
        array: [...currentArray],
        activeIndices: [sortedIndex],
        blueIndices: [minimumIndex],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `Swapped minimum ${currentArray[sortedIndex]} with ${currentArray[minimumIndex]} at index ${sortedIndex}`,
      });
    }

    sortedIndices = [...sortedIndices, sortedIndex];

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps },
      completed: false,
      description: `${currentArray[sortedIndex]} is now sorted at position ${sortedIndex}.`,
    });
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

export const selectionSortDefinition: SortingAlgorithmDefinition = {
  slug: "selection-sort",
  details,
  generateFrames,
};
