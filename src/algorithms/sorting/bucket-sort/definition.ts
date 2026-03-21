import {
  appendValue,
  buildSortedIndices,
  createRandomArray,
  insertValueAt,
  replaceBucketAtIndex,
} from "@/algorithms/sorting/shared/utils";
import {
  buildSortedIndicesWithout,
  createBucketFrame,
  createBucketRanges,
  createEmptyBuckets,
  getBucketFormulaDescription,
  getBucketIndex,
  getBucketName,
} from "@/algorithms/sorting/bucket-sort/helpers";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best O(n), Average O(n√n), Worst O(n²)",
  spaceComplexity: "O(n + √n)",
  description:
    "This implementation uses ceil(sqrt(n)) range-based buckets, inserts each value into its bucket in sorted order, then concatenates the buckets into the final output.",
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

  const activeBucket = frame.bucketGroups?.find(
    (bucketGroup) =>
      Boolean(bucketGroup.blueIndices?.length) ||
      Boolean(bucketGroup.activeIndices?.length),
  );
  const bucketIndex =
    activeBucket?.blueIndices?.[0] ?? activeBucket?.activeIndices?.[0];

  if (activeBucket && bucketIndex !== undefined) {
    return activeBucket.values[bucketIndex];
  }

  const inputIndex = frame.blueIndices?.[0] ?? frame.activeIndices?.[0];
  return inputIndex !== undefined ? frame.array[inputIndex] : undefined;
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  if (initialArray.length === 0) {
    return [
      createBucketFrame({
        array: [],
        bucketValues: [],
        bucketRanges: [],
        outputValues: [],
        stats: { comparisons: 0, swaps: 0 },
        description: "Start: empty input.",
      }),
      createBucketFrame({
        array: [],
        bucketValues: [],
        bucketRanges: [],
        outputValues: [],
        stats: { comparisons: 0, swaps: 0 },
        description: "Done.",
        completed: true,
      }),
    ];
  }

  const minValue = Math.min(...initialArray);
  const maxValue = Math.max(...initialArray);
  const bucketCount = Math.ceil(Math.sqrt(initialArray.length));
  const range = maxValue - minValue + 1;
  const bucketWidth = Math.max(1, Math.ceil(range / bucketCount));
  const bucketRanges = createBucketRanges({
    bucketCount,
    minValue,
    maxValue,
    bucketWidth,
  });

  let bucketValues = createEmptyBuckets(bucketCount);
  let outputValues: number[] = [];
  let comparisons = 0;
  let swaps = 0;
  const framesList: SortingAnimationFrame[] = [
    createBucketFrame({
      array: initialArray,
      bucketValues,
      bucketRanges,
      outputValues,
      stats: { comparisons, swaps },
      description: `Start: b = min(${bucketCount - 1}, floor((v - ${minValue}) / ${bucketWidth})).`,
    }),
  ];

  for (
    let sourceIndex = 0;
    sourceIndex < initialArray.length;
    sourceIndex += 1
  ) {
    const value = initialArray[sourceIndex];
    const bucketIndex = getBucketIndex({
      value,
      minValue,
      bucketCount,
      bucketWidth,
    });
    const bucketFormulaDescription = getBucketFormulaDescription({
      value,
      minValue,
      bucketWidth,
      bucketCount,
      bucketIndex,
    });
    const currentBucket = bucketValues[bucketIndex] || [];
    let insertionIndex = currentBucket.length;

    if (currentBucket.length === 0) {
      const nextBucket = insertValueAt(currentBucket, 0, value);
      bucketValues = replaceBucketAtIndex(
        bucketValues,
        bucketIndex,
        nextBucket,
      );
      swaps += 1;

      framesList.push(
        createBucketFrame({
          array: initialArray,
          bucketValues,
          bucketRanges,
          outputValues,
          activeIndices: [sourceIndex],
          blueIndices: [sourceIndex],
          activeBucketIndex: bucketIndex,
          bucketBlueIndices: [0],
          stats: { comparisons, swaps },
          description: `${value} -> ${getBucketName(bucketIndex)} via ${bucketFormulaDescription}. Empty bucket, insert at head.`,
        }),
      );
      continue;
    }

    for (let scanIndex = 0; scanIndex < currentBucket.length; scanIndex += 1) {
      comparisons += 1;

      framesList.push(
        createBucketFrame({
          array: initialArray,
          bucketValues,
          bucketRanges,
          outputValues,
          activeIndices: [sourceIndex],
          blueIndices: [sourceIndex],
          activeBucketIndex: bucketIndex,
          bucketActiveIndices: [scanIndex],
          bucketSortedIndices: buildSortedIndicesWithout(
            currentBucket.length,
            scanIndex,
          ),
          stats: { comparisons, swaps },
          description: `${value} -> ${getBucketName(bucketIndex)} via ${bucketFormulaDescription}. Compare with ${currentBucket[scanIndex]}.`,
        }),
      );

      if (value < currentBucket[scanIndex]) {
        insertionIndex = scanIndex;
        break;
      }
    }

    const nextBucket = insertValueAt(currentBucket, insertionIndex, value);
    bucketValues = replaceBucketAtIndex(bucketValues, bucketIndex, nextBucket);
    swaps += 1;

    framesList.push(
      createBucketFrame({
        array: initialArray,
        bucketValues,
        bucketRanges,
        outputValues,
        activeIndices: [sourceIndex],
        blueIndices: [sourceIndex],
        activeBucketIndex: bucketIndex,
        bucketBlueIndices: [insertionIndex],
        bucketSortedIndices: buildSortedIndicesWithout(
          nextBucket.length,
          insertionIndex,
        ),
        stats: { comparisons, swaps },
        description:
          insertionIndex === currentBucket.length
            ? `${value} -> ${getBucketName(bucketIndex)} via ${bucketFormulaDescription}. Insert at tail.`
            : `${value} -> ${getBucketName(bucketIndex)} via ${bucketFormulaDescription}. Insert at pos ${insertionIndex}.`,
      }),
    );
  }

  framesList.push(
    createBucketFrame({
      array: initialArray,
      bucketValues,
      bucketRanges,
      outputValues,
      stats: { comparisons, swaps },
      description:
        "Distribution done. Buckets are sorted; concatenate in order.",
    }),
  );

  for (
    let bucketIndex = 0;
    bucketIndex < bucketValues.length;
    bucketIndex += 1
  ) {
    const sourceBucket = bucketValues[bucketIndex] || [];

    if (sourceBucket.length === 0) {
      framesList.push(
        createBucketFrame({
          array: initialArray,
          bucketValues,
          bucketRanges,
          outputValues,
          stats: { comparisons, swaps },
          description: `${getBucketName(bucketIndex)} is empty. Skip.`,
        }),
      );
      continue;
    }

    framesList.push(
      createBucketFrame({
        array: initialArray,
        bucketValues,
        bucketRanges,
        outputValues,
        activeBucketIndex: bucketIndex,
        bucketSortedIndices: buildSortedIndices(sourceBucket.length),
        stats: { comparisons, swaps },
        description: `${getBucketName(bucketIndex)} is sorted. Append its values.`,
      }),
    );

    for (
      let valueIndex = 0;
      valueIndex < sourceBucket.length;
      valueIndex += 1
    ) {
      const nextValue = sourceBucket[valueIndex];
      const nextOutputValues = appendValue(outputValues, nextValue);
      const activeOutputIndex = nextOutputValues.length - 1;

      outputValues = [...nextOutputValues];
      swaps += 1;

      framesList.push(
        createBucketFrame({
          array: initialArray,
          bucketValues,
          bucketRanges,
          outputValues,
          activeBucketIndex: bucketIndex,
          bucketBlueIndices: [valueIndex],
          bucketSortedIndices: buildSortedIndicesWithout(
            sourceBucket.length,
            valueIndex,
          ),
          outputBlueIndices: [activeOutputIndex],
          outputSortedIndices: buildSortedIndicesWithout(
            outputValues.length,
            activeOutputIndex,
          ),
          stats: { comparisons, swaps },
          description: `Append ${nextValue} from ${getBucketName(bucketIndex)} to out[${activeOutputIndex}].`,
        }),
      );
    }
  }

  framesList.push(
    createBucketFrame({
      array: initialArray,
      bucketValues,
      bucketRanges,
      outputValues,
      outputSortedIndices: buildSortedIndices(outputValues.length),
      stats: { comparisons, swaps },
      description: "Done.",
      completed: true,
    }),
  );

  return framesList;
};

export const bucketSortDefinition: SortingAlgorithmDefinition = {
  slug: "bucket-sort",
  details,
  generateFrames,
  getSoundValue,
};
