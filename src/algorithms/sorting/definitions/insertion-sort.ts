import {
  buildSortedIndices,
  createRandomArray,
  setValueAtIndex,
} from "@/algorithms/sorting/shared/utils";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Insertion Sort builds the final sorted array one item at a time. It iterates through an input element and grows a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.",
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
      description: "Starting Insertion Sort.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let comparisons = 0;
  let swaps = 0;

  framesList.push({
    array: [...currentArray],
    activeIndices: null,
    sortedIndices: [0],
    stats: { comparisons, swaps },
    completed: false,
    description: "The first element is considered sorted.",
  });

  for (let sourceIndex = 1; sourceIndex < itemCount; sourceIndex += 1) {
    const key = currentArray[sourceIndex];
    let compareIndex = sourceIndex - 1;

    framesList.push({
      array: [...currentArray],
      activeIndices: [sourceIndex],
      blueIndices: [],
      sortedIndices: Array.from({ length: sourceIndex }, (_, index) => index),
      stats: { comparisons, swaps },
      completed: false,
      description: `Selected ${key} to insert.`,
    });

    while (compareIndex >= 0) {
      comparisons += 1;

      const comparisonSortedIndices = Array.from(
        { length: sourceIndex },
        (_, index) => index,
      ).filter((index) => index !== compareIndex);

      framesList.push({
        array: [...currentArray],
        activeIndices: [compareIndex + 1],
        blueIndices: [compareIndex],
        sortedIndices: comparisonSortedIndices,
        stats: { comparisons, swaps },
        completed: false,
        description: `Comparing ${currentArray[compareIndex]} with Key (${key}).`,
      });

      if (currentArray[compareIndex] > key) {
        currentArray = setValueAtIndex(
          currentArray,
          compareIndex + 1,
          currentArray[compareIndex],
        );
        swaps += 1;

        const shiftSortedIndices = Array.from(
          { length: sourceIndex },
          (_, index) => index,
        ).filter((index) => index !== compareIndex + 1);

        framesList.push({
          array: [...currentArray],
          activeIndices: [compareIndex],
          blueIndices: [compareIndex + 1],
          sortedIndices: shiftSortedIndices,
          stats: { comparisons, swaps },
          completed: false,
          description: `Shifted ${currentArray[compareIndex + 1]} to the right.`,
        });

        compareIndex -= 1;
        continue;
      }

      break;
    }

    currentArray = setValueAtIndex(currentArray, compareIndex + 1, key);

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      blueIndices: [compareIndex + 1],
      sortedIndices: buildSortedIndices(sourceIndex + 1),
      stats: { comparisons, swaps },
      completed: false,
      description: `Inserted ${key} at position ${compareIndex + 1}.`,
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

export const insertionSortDefinition: SortingAlgorithmDefinition = {
  slug: "insertion-sort",
  details,
  generateFrames,
};
