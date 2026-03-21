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
  timeComplexity: "Best/Average/Worst O(n log n)",
  spaceComplexity: "O(1)",
  description:
    "Heap Sort builds a max heap and repeatedly moves the root (largest value) to the end of the array, shrinking the heap each step.",
};

const createTailSortedIndices = (
  itemCount: number,
  startIndex: number,
): number[] =>
  Array.from(
    { length: Math.max(0, itemCount - startIndex) },
    (_, offset) => startIndex + offset,
  );

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const framesList: SortingAnimationFrame[] = [
    {
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: false,
      description: "Starting Heap Sort initialized with random values.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let comparisons = 0;
  let swaps = 0;

  const heapify = (
    heapSize: number,
    rootIndex: number,
    sortedIndices: number[],
  ) => {
    let currentRoot = rootIndex;

    while (true) {
      const leftChildIndex = currentRoot * 2 + 1;
      const rightChildIndex = currentRoot * 2 + 2;
      let largestIndex = currentRoot;

      if (leftChildIndex < heapSize) {
        comparisons += 1;
        framesList.push({
          array: [...currentArray],
          activeIndices: [currentRoot, leftChildIndex],
          blueIndices: [largestIndex],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing parent ${currentArray[currentRoot]} and left child ${currentArray[leftChildIndex]}.`,
        });

        if (currentArray[leftChildIndex] > currentArray[largestIndex]) {
          largestIndex = leftChildIndex;
          framesList.push({
            array: [...currentArray],
            activeIndices: [currentRoot, leftChildIndex],
            blueIndices: [largestIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Left child ${currentArray[leftChildIndex]} is the new largest.`,
          });
        }
      }

      if (rightChildIndex < heapSize) {
        comparisons += 1;
        framesList.push({
          array: [...currentArray],
          activeIndices: [largestIndex, rightChildIndex],
          blueIndices: [largestIndex],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing current largest ${currentArray[largestIndex]} and right child ${currentArray[rightChildIndex]}.`,
        });

        if (currentArray[rightChildIndex] > currentArray[largestIndex]) {
          largestIndex = rightChildIndex;
          framesList.push({
            array: [...currentArray],
            activeIndices: [currentRoot, rightChildIndex],
            blueIndices: [largestIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Right child ${currentArray[rightChildIndex]} is the new largest.`,
          });
        }
      }

      if (largestIndex === currentRoot) {
        break;
      }

      currentArray = swapIndices(currentArray, currentRoot, largestIndex);
      swaps += 1;

      framesList.push({
        array: [...currentArray],
        activeIndices: [currentRoot, largestIndex],
        blueIndices: [largestIndex],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `Swapped ${currentArray[largestIndex]} and ${currentArray[currentRoot]} to restore heap property.`,
      });

      currentRoot = largestIndex;
    }
  };

  framesList.push({
    array: [...currentArray],
    activeIndices: null,
    sortedIndices: [],
    stats: { comparisons, swaps },
    completed: false,
    description: "Building max heap.",
  });

  for (
    let startIndex = Math.floor(itemCount / 2) - 1;
    startIndex >= 0;
    startIndex -= 1
  ) {
    framesList.push({
      array: [...currentArray],
      activeIndices: [startIndex],
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: `Heapifying subtree rooted at index ${startIndex}.`,
    });
    heapify(itemCount, startIndex, []);
  }

  framesList.push({
    array: [...currentArray],
    activeIndices: null,
    sortedIndices: [],
    stats: { comparisons, swaps },
    completed: false,
    description: "Max heap ready. Extracting largest elements.",
  });

  for (let endIndex = itemCount - 1; endIndex > 0; endIndex -= 1) {
    currentArray = swapIndices(currentArray, 0, endIndex);
    swaps += 1;
    const sortedIndices = createTailSortedIndices(itemCount, endIndex);

    framesList.push({
      array: [...currentArray],
      activeIndices: [0, endIndex],
      blueIndices: [endIndex],
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps },
      completed: false,
      description: `Moved max value ${currentArray[endIndex]} to index ${endIndex}.`,
    });

    heapify(endIndex, 0, sortedIndices);
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

export const heapSortDefinition: SortingAlgorithmDefinition = {
  slug: "heap-sort",
  details,
  generateFrames,
};
