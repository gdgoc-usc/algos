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
  timeComplexity: "Best O(n log n), average ~O(n^1.5), worst O(n^2)",
  spaceComplexity: "O(1)",
  description:
    "Shell Sort improves insertion sort by comparing elements far apart first using a shrinking gap sequence, then finishes with a final insertion-style pass.",
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
      description: "Starting Shell Sort.",
    },
  ];

  let currentArray = [...initialArray];
  const itemCount = currentArray.length;
  let comparisons = 0;
  let swaps = 0;

  for (
    let gap = Math.floor(itemCount / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: `Starting pass with gap ${gap}.`,
    });

    for (let sourceIndex = gap; sourceIndex < itemCount; sourceIndex += 1) {
      const key = currentArray[sourceIndex];
      let targetIndex = sourceIndex;

      framesList.push({
        array: [...currentArray],
        activeIndices: [sourceIndex],
        blueIndices: [Math.max(sourceIndex - gap, 0)],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Selected ${key} for gap insertion (gap ${gap}).`,
      });

      while (targetIndex >= gap) {
        const compareIndex = targetIndex - gap;
        comparisons += 1;

        framesList.push({
          array: [...currentArray],
          activeIndices: [targetIndex],
          blueIndices: [compareIndex],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing ${currentArray[compareIndex]} and ${key} with gap ${gap}.`,
        });

        if (currentArray[compareIndex] > key) {
          currentArray = setValueAtIndex(
            currentArray,
            targetIndex,
            currentArray[compareIndex],
          );
          swaps += 1;

          framesList.push({
            array: [...currentArray],
            activeIndices: [compareIndex],
            blueIndices: [targetIndex],
            sortedIndices: [],
            stats: { comparisons, swaps },
            completed: false,
            description: `Shifted ${currentArray[targetIndex]} from index ${compareIndex} to ${targetIndex}.`,
          });

          targetIndex -= gap;
          continue;
        }

        break;
      }

      currentArray = setValueAtIndex(currentArray, targetIndex, key);

      framesList.push({
        array: [...currentArray],
        activeIndices: null,
        blueIndices: [targetIndex],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Placed ${key} at index ${targetIndex}.`,
      });
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

export const shellSortDefinition: SortingAlgorithmDefinition = {
  slug: "shell-sort",
  details,
  generateFrames,
};
