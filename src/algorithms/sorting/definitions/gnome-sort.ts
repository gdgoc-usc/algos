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
  timeComplexity: "Best O(n), average O(n²), worst O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Gnome Sort works like a garden gnome: it walks forward when neighbors are ordered, and steps backward to swap adjacent out-of-order values until the sequence is sorted.",
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
      description: "Starting Gnome Sort initialized with random values.",
    },
  ];

  if (initialArray.length <= 1) {
    framesList.push({
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: buildSortedIndices(initialArray.length),
      stats: { comparisons: 0, swaps: 0 },
      completed: true,
      description: "Sorting completed!",
    });

    return framesList;
  }

  let currentArray = [...initialArray];
  let currentIndex = 1;
  let comparisons = 0;
  let swaps = 0;

  while (currentIndex < currentArray.length) {
    if (currentIndex === 0) {
      framesList.push({
        array: [...currentArray],
        activeIndices: [0],
        blueIndices: [0],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: "Reached the start of the array. Moving one step forward.",
      });
      currentIndex = 1;
    }

    comparisons += 1;
    const leftIndex = currentIndex - 1;
    const rightIndex = currentIndex;

    framesList.push({
      array: [...currentArray],
      activeIndices: [leftIndex, rightIndex],
      blueIndices: [rightIndex],
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: `Comparing ${currentArray[leftIndex]} and ${currentArray[rightIndex]}.`,
    });

    if (currentArray[leftIndex] <= currentArray[rightIndex]) {
      framesList.push({
        array: [...currentArray],
        activeIndices: [rightIndex],
        blueIndices: [rightIndex],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: "Pair is ordered. Moving forward.",
      });
      currentIndex += 1;
      continue;
    }

    currentArray = swapIndices(currentArray, leftIndex, rightIndex);
    swaps += 1;

    framesList.push({
      array: [...currentArray],
      activeIndices: [leftIndex, rightIndex],
      blueIndices: [leftIndex],
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: `Swapped ${currentArray[rightIndex]} and ${currentArray[leftIndex]}. Stepping backward.`,
    });
    currentIndex -= 1;
  }

  framesList.push({
    array: [...currentArray],
    activeIndices: null,
    sortedIndices: buildSortedIndices(currentArray.length),
    stats: { comparisons, swaps },
    completed: true,
    description: "Sorting completed!",
  });

  return framesList;
};

export const gnomeSortDefinition: SortingAlgorithmDefinition = {
  slug: "gnome-sort",
  details,
  generateFrames,
};
