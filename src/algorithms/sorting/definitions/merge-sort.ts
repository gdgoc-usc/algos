import {
  buildIndexRange,
  buildSortedIndices,
  createRandomArray,
  setValueAtIndex,
} from "@/algorithms/sorting/shared/utils";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best/Average/Worst O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Merge Sort recursively splits the array into halves, then stably merges the sorted halves using temporary buffers.",
};

const MERGE_BUFFER_LABEL = "Remaining Merge Buffer";
const MERGED_OUTPUT_LABEL = "Merged Output";

type MergeFrameOptions = {
  array: number[];
  activeIndices?: number[] | null;
  blueIndices?: number[];
  sortedIndices?: number[];
  bucketValues?: number[];
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  outputValues?: number[];
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices?: number[];
  comparisons: number;
  writes: number;
  description: string;
  completed?: boolean;
};

const buildRangeIndices = (
  startIndex: number,
  endIndexExclusive: number,
): number[] => buildIndexRange(startIndex, endIndexExclusive);

const formatRange = (startIndex: number, endIndexExclusive: number): string =>
  `[${startIndex}, ${endIndexExclusive - 1}]`;

const createFrame = ({
  array,
  activeIndices = null,
  blueIndices = [],
  sortedIndices = [],
  bucketValues,
  bucketActiveIndices = [],
  bucketBlueIndices = [],
  outputValues,
  outputActiveIndices = [],
  outputBlueIndices = [],
  outputSortedIndices = [],
  comparisons,
  writes,
  description,
  completed = false,
}: MergeFrameOptions): SortingAnimationFrame => ({
  array: [...array],
  activeIndices: activeIndices ? [...activeIndices] : null,
  blueIndices: [...blueIndices],
  sortedIndices: [...sortedIndices],
  ...(bucketValues !== undefined
    ? {
        bucketValues: [...bucketValues],
        bucketLabel: MERGE_BUFFER_LABEL,
        bucketActiveIndices: [...bucketActiveIndices],
        bucketBlueIndices: [...bucketBlueIndices],
      }
    : {}),
  ...(outputValues !== undefined
    ? {
        outputValues: [...outputValues],
        outputLabel: MERGED_OUTPUT_LABEL,
        outputActiveIndices: [...outputActiveIndices],
        outputBlueIndices: [...outputBlueIndices],
        outputSortedIndices: [...outputSortedIndices],
      }
    : {}),
  stats: { comparisons, swaps: writes },
  completed,
  description,
});

const getMergeBufferState = (
  leftValues: number[],
  rightValues: number[],
  leftCursor: number,
  rightCursor: number,
): {
  bufferValues: number[];
  candidateIndices: number[];
} => {
  const leftRemaining = leftValues.slice(leftCursor);
  const rightRemaining = rightValues.slice(rightCursor);

  return {
    bufferValues: [...leftRemaining, ...rightRemaining],
    candidateIndices: [
      ...(leftRemaining.length > 0 ? [0] : []),
      ...(rightRemaining.length > 0 ? [leftRemaining.length] : []),
    ],
  };
};

const getSoundValue = (
  frame: SortingAnimationFrame | undefined,
): number | undefined => {
  if (!frame) {
    return undefined;
  }

  const outputIndex =
    frame.outputBlueIndices?.[0] ?? frame.outputActiveIndices?.[0];
  if (outputIndex !== undefined && frame.outputValues) {
    return frame.outputValues[outputIndex];
  }

  const bufferIndex =
    frame.bucketBlueIndices?.[0] ?? frame.bucketActiveIndices?.[0];
  if (bufferIndex !== undefined && frame.bucketValues) {
    return frame.bucketValues[bufferIndex];
  }

  const arrayIndex = frame.activeIndices?.[0] ?? frame.blueIndices?.[0];
  return arrayIndex !== undefined ? frame.array[arrayIndex] : undefined;
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const framesList: SortingAnimationFrame[] = [
    createFrame({
      array: initialArray,
      comparisons: 0,
      writes: 0,
      description: "Starting Merge Sort initialized with random values.",
    }),
  ];

  if (initialArray.length === 0) {
    framesList.push(
      createFrame({
        array: [],
        comparisons: 0,
        writes: 0,
        sortedIndices: [],
        description: "Sorting completed!",
        completed: true,
      }),
    );

    return framesList;
  }

  let currentArray = [...initialArray];
  let comparisons = 0;
  let writes = 0;

  const sortRange = (startIndex: number, endIndexExclusive: number): void => {
    const rangeLength = endIndexExclusive - startIndex;

    if (rangeLength <= 1) {
      if (rangeLength === 1) {
        framesList.push(
          createFrame({
            array: currentArray,
            activeIndices: [startIndex],
            blueIndices: [startIndex],
            comparisons,
            writes,
            description: `Base case reached at index ${startIndex}; ${currentArray[startIndex]} is already sorted within this partition.`,
          }),
        );
      }

      return;
    }

    const middleIndex = startIndex + Math.floor(rangeLength / 2);
    const rangeIndices = buildRangeIndices(startIndex, endIndexExclusive);

    framesList.push(
      createFrame({
        array: currentArray,
        activeIndices: [middleIndex - 1, middleIndex],
        blueIndices: rangeIndices,
        comparisons,
        writes,
        description: `Splitting range ${formatRange(startIndex, endIndexExclusive)} into ${formatRange(startIndex, middleIndex)} and ${formatRange(middleIndex, endIndexExclusive)}.`,
      }),
    );

    sortRange(startIndex, middleIndex);
    sortRange(middleIndex, endIndexExclusive);
    mergeRange(startIndex, middleIndex, endIndexExclusive);
  };

  const mergeRange = (
    startIndex: number,
    middleIndex: number,
    endIndexExclusive: number,
  ): void => {
    const leftValues = currentArray.slice(startIndex, middleIndex);
    const rightValues = currentArray.slice(middleIndex, endIndexExclusive);
    const rangeIndices = buildRangeIndices(startIndex, endIndexExclusive);
    let leftCursor = 0;
    let rightCursor = 0;
    let writeIndex = startIndex;
    let mergedOutput: number[] = [];

    framesList.push(
      createFrame({
        array: currentArray,
        activeIndices: [writeIndex],
        blueIndices: rangeIndices,
        bucketValues: [...leftValues, ...rightValues],
        bucketActiveIndices:
          leftValues.length > 0 && rightValues.length > 0
            ? [0, leftValues.length]
            : [0],
        outputValues: [],
        comparisons,
        writes,
        description: `Merging ${formatRange(startIndex, middleIndex)} and ${formatRange(middleIndex, endIndexExclusive)} into ${formatRange(startIndex, endIndexExclusive)}.`,
      }),
    );

    while (leftCursor < leftValues.length && rightCursor < rightValues.length) {
      const leftCandidate = leftValues[leftCursor];
      const rightCandidate = rightValues[rightCursor];
      const { bufferValues, candidateIndices } = getMergeBufferState(
        leftValues,
        rightValues,
        leftCursor,
        rightCursor,
      );

      comparisons += 1;

      framesList.push(
        createFrame({
          array: currentArray,
          activeIndices: [writeIndex],
          blueIndices: rangeIndices,
          bucketValues: bufferValues,
          bucketActiveIndices: candidateIndices,
          outputValues: mergedOutput,
          outputSortedIndices: buildSortedIndices(mergedOutput.length),
          comparisons,
          writes,
          description: `Comparing left ${leftCandidate} and right ${rightCandidate} for write index ${writeIndex}.`,
        }),
      );

      const shouldTakeLeft = leftCandidate <= rightCandidate;
      const nextValue = shouldTakeLeft ? leftCandidate : rightCandidate;
      const nextLeftCursor = shouldTakeLeft ? leftCursor + 1 : leftCursor;
      const nextRightCursor = shouldTakeLeft ? rightCursor : rightCursor + 1;

      currentArray = setValueAtIndex(currentArray, writeIndex, nextValue);
      mergedOutput = [...mergedOutput, nextValue];
      writes += 1;
      leftCursor = nextLeftCursor;
      rightCursor = nextRightCursor;

      framesList.push(
        createFrame({
          array: currentArray,
          activeIndices: [writeIndex],
          blueIndices: rangeIndices,
          bucketValues: getMergeBufferState(
            leftValues,
            rightValues,
            leftCursor,
            rightCursor,
          ).bufferValues,
          outputValues: mergedOutput,
          outputBlueIndices: [mergedOutput.length - 1],
          outputSortedIndices: buildSortedIndices(
            Math.max(mergedOutput.length - 1, 0),
          ),
          comparisons,
          writes,
          description: shouldTakeLeft
            ? leftCandidate === rightCandidate
              ? `Placed ${nextValue} from the left half at index ${writeIndex} to preserve stable ordering.`
              : `Placed ${nextValue} from the left half at index ${writeIndex}.`
            : `Placed ${nextValue} from the right half at index ${writeIndex}.`,
        }),
      );

      writeIndex += 1;
    }

    while (leftCursor < leftValues.length) {
      const nextValue = leftValues[leftCursor];
      leftCursor += 1;
      currentArray = setValueAtIndex(currentArray, writeIndex, nextValue);
      mergedOutput = [...mergedOutput, nextValue];
      writes += 1;

      framesList.push(
        createFrame({
          array: currentArray,
          activeIndices: [writeIndex],
          blueIndices: rangeIndices,
          bucketValues: getMergeBufferState(
            leftValues,
            rightValues,
            leftCursor,
            rightCursor,
          ).bufferValues,
          outputValues: mergedOutput,
          outputBlueIndices: [mergedOutput.length - 1],
          outputSortedIndices: buildSortedIndices(
            Math.max(mergedOutput.length - 1, 0),
          ),
          comparisons,
          writes,
          description: `Right half is exhausted, so ${nextValue} is copied from the left half to index ${writeIndex}.`,
        }),
      );

      writeIndex += 1;
    }

    while (rightCursor < rightValues.length) {
      const nextValue = rightValues[rightCursor];
      rightCursor += 1;
      currentArray = setValueAtIndex(currentArray, writeIndex, nextValue);
      mergedOutput = [...mergedOutput, nextValue];
      writes += 1;

      framesList.push(
        createFrame({
          array: currentArray,
          activeIndices: [writeIndex],
          blueIndices: rangeIndices,
          bucketValues: getMergeBufferState(
            leftValues,
            rightValues,
            leftCursor,
            rightCursor,
          ).bufferValues,
          outputValues: mergedOutput,
          outputBlueIndices: [mergedOutput.length - 1],
          outputSortedIndices: buildSortedIndices(
            Math.max(mergedOutput.length - 1, 0),
          ),
          comparisons,
          writes,
          description: `Left half is exhausted, so ${nextValue} is copied from the right half to index ${writeIndex}.`,
        }),
      );

      writeIndex += 1;
    }

    framesList.push(
      createFrame({
        array: currentArray,
        blueIndices: rangeIndices,
        bucketValues: [],
        outputValues: mergedOutput,
        outputSortedIndices: buildSortedIndices(mergedOutput.length),
        comparisons,
        writes,
        description: `Merged range ${formatRange(startIndex, endIndexExclusive)}.`,
      }),
    );
  };

  sortRange(0, currentArray.length);

  framesList.push(
    createFrame({
      array: currentArray,
      sortedIndices: buildSortedIndices(currentArray.length),
      comparisons,
      writes,
      description: "Sorting completed!",
      completed: true,
    }),
  );

  return framesList;
};

export const mergeSortDefinition: SortingAlgorithmDefinition = {
  slug: "merge-sort",
  details,
  generateFrames,
  getSoundValue,
};
