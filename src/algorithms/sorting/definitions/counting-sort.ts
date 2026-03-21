import {
  addUniqueIndex,
  buildSortedIndices,
  createRandomArray,
  createZeroArray,
  decrementValueAtIndex,
  incrementValueAtIndex,
  setValueAtIndex,
} from "@/algorithms/sorting/shared/utils";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best/Average/Worst O(n + k)",
  spaceComplexity: "O(n + k)",
  description:
    "Counting Sort builds frequency buckets, converts them into cumulative positions, and places values from right to left to preserve stability.",
};

const getSoundValue = (
  frame: SortingAnimationFrame | undefined,
): number | undefined => {
  if (!frame) {
    return undefined;
  }

  const outputIndex = frame.outputActiveIndices?.[0];
  if (outputIndex !== undefined && frame.outputValues) {
    return frame.outputValues[outputIndex];
  }

  const inputIndex = frame.activeIndices?.[1] ?? frame.activeIndices?.[0];
  return inputIndex !== undefined ? frame.array[inputIndex] : undefined;
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const initialOutput = createZeroArray(initialArray.length);
  const framesList: SortingAnimationFrame[] = [
    {
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: [],
      bucketValues: [],
      outputValues: [...initialOutput],
      outputSortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: false,
      description: "Starting Counting Sort initialized with random values.",
    },
  ];

  if (initialArray.length === 0) {
    framesList.push({
      array: [],
      activeIndices: null,
      sortedIndices: [],
      bucketValues: [],
      outputValues: [],
      outputSortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: true,
      description: "Sorting completed!",
    });

    return framesList;
  }

  const minValue = Math.min(...initialArray);
  const maxValue = Math.max(...initialArray);
  const range = maxValue - minValue + 1;
  const bucketRange = {
    bucketRangeStart: minValue,
    bucketRangeEnd: maxValue,
  };
  let counts = Array.from({ length: range }, () => 0);
  let outputArray = [...initialOutput];
  let writes = 0;

  framesList.push({
    array: [...initialArray],
    activeIndices: null,
    sortedIndices: [],
    bucketValues: [...counts],
    ...bucketRange,
    outputValues: [...outputArray],
    outputSortedIndices: [],
    stats: { comparisons: 0, swaps: 0 },
    completed: false,
    description: `Detected value range from ${minValue} to ${maxValue} (${range} distinct values).`,
  });

  for (
    let sourceIndex = 0;
    sourceIndex < initialArray.length;
    sourceIndex += 1
  ) {
    const value = initialArray[sourceIndex];
    const countIndex = value - minValue;
    counts = incrementValueAtIndex(counts, countIndex);

    framesList.push({
      array: [...initialArray],
      activeIndices: [sourceIndex],
      blueIndices: [sourceIndex],
      sortedIndices: [],
      bucketValues: [...counts],
      ...bucketRange,
      bucketActiveIndices: [countIndex],
      bucketBlueIndices: [countIndex],
      outputValues: [...outputArray],
      outputSortedIndices: [],
      stats: { comparisons: 0, swaps: writes },
      completed: false,
      description: `Counting value ${value} (frequency ${counts[countIndex]}).`,
    });
  }

  for (let countIndex = 1; countIndex < counts.length; countIndex += 1) {
    const cumulativeValue = counts[countIndex] + counts[countIndex - 1];
    counts = counts.map((count, index) =>
      index === countIndex ? cumulativeValue : count,
    );

    framesList.push({
      array: [...initialArray],
      activeIndices: null,
      sortedIndices: [],
      bucketValues: [...counts],
      ...bucketRange,
      bucketActiveIndices: [countIndex - 1, countIndex],
      bucketBlueIndices: [countIndex],
      outputValues: [...outputArray],
      outputSortedIndices: [],
      stats: { comparisons: 0, swaps: writes },
      completed: false,
      description: `Cumulative bucket for value ${countIndex + minValue} is now ${counts[countIndex]}.`,
    });
  }

  framesList.push({
    array: [...initialArray],
    activeIndices: null,
    sortedIndices: [],
    bucketValues: [...counts],
    ...bucketRange,
    outputValues: [...outputArray],
    outputSortedIndices: [],
    stats: { comparisons: 0, swaps: writes },
    completed: false,
    description:
      "Cumulative buckets ready. Building output from right to left for stable ordering.",
  });

  let placedOutputIndices: number[] = [];

  for (
    let sourceIndex = initialArray.length - 1;
    sourceIndex >= 0;
    sourceIndex -= 1
  ) {
    const value = initialArray[sourceIndex];
    const countIndex = value - minValue;
    const outputIndex = counts[countIndex] - 1;
    outputArray = setValueAtIndex(outputArray, outputIndex, value);
    counts = decrementValueAtIndex(counts, countIndex);
    writes += 1;
    placedOutputIndices = addUniqueIndex(placedOutputIndices, outputIndex);

    framesList.push({
      array: [...initialArray],
      activeIndices: [sourceIndex],
      blueIndices: [sourceIndex],
      sortedIndices: [],
      bucketValues: [...counts],
      ...bucketRange,
      bucketActiveIndices: [countIndex],
      bucketBlueIndices: [countIndex],
      outputValues: [...outputArray],
      outputActiveIndices: [outputIndex],
      outputBlueIndices: [outputIndex],
      outputSortedIndices: [...placedOutputIndices],
      stats: { comparisons: 0, swaps: writes },
      completed: false,
      description: `Placed ${value} at output index ${outputIndex} using cumulative counts (stable step).`,
    });
  }

  framesList.push({
    array: [...initialArray],
    activeIndices: null,
    sortedIndices: [],
    bucketValues: [...counts],
    ...bucketRange,
    outputValues: [...outputArray],
    outputSortedIndices: buildSortedIndices(outputArray.length),
    stats: { comparisons: 0, swaps: writes },
    completed: true,
    description: "Sorting completed!",
  });

  return framesList;
};

export const countingSortDefinition: SortingAlgorithmDefinition = {
  slug: "counting-sort",
  details,
  generateFrames,
  getSoundValue,
};
