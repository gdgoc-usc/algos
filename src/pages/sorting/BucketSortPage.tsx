import { useState, useEffect, useCallback, useMemo } from "react";
import { algorithms } from "@/algorithms";
import { useSound } from "@/hooks/use-sound";
import type {
  SortingAnimationFrame,
  SortingBucketGroup,
} from "@/types/sorting";

import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingStats } from "@/components/algorithm/SortingStats";
import { AlgorithmDetails } from "@/components/algorithm/AlgorithmDetails";

const MIN_RANDOM_VALUE = 10;
const MAX_RANDOM_VALUE = 100;

const algorithmDetails = {
  timeComplexity: "Best O(n), Average O(n√n), Worst O(n²)",
  spaceComplexity: "O(n + √n)",
  description:
    "This implementation uses ceil(sqrt(n)) range-based buckets, inserts each value into its bucket in sorted order, then concatenates the buckets into the final output.",
};

type Stats = {
  comparisons: number;
  swaps: number;
};

type BucketRange = {
  label: string;
  rangeStart: number;
  rangeEnd: number;
};

type BucketFrameOptions = {
  array: number[];
  bucketValues: number[][];
  bucketRanges: BucketRange[];
  outputValues?: number[];
  activeIndices?: number[] | null;
  blueIndices?: number[];
  activeBucketIndex?: number;
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  bucketSortedIndices?: number[];
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices?: number[];
  stats: Stats;
  description: string;
  completed?: boolean;
};

const createRandomArray = (size: number): number[] =>
  Array.from(
    { length: size },
    () =>
      Math.floor(Math.random() * (MAX_RANDOM_VALUE - MIN_RANDOM_VALUE + 1)) +
      MIN_RANDOM_VALUE,
  );

const buildSortedIndices = (size: number): number[] =>
  Array.from({ length: size }, (_, index) => index);

const buildSortedIndicesWithout = (
  size: number,
  excludedIndex?: number,
): number[] =>
  buildSortedIndices(size).filter((index) => index !== excludedIndex);

const createEmptyBuckets = (bucketCount: number): number[][] =>
  Array.from({ length: bucketCount }, () => []);

const appendValue = (values: number[], nextValue: number): number[] => [
  ...values,
  nextValue,
];

const replaceBucketAt = (
  buckets: number[][],
  indexToReplace: number,
  nextBucket: number[],
): number[][] =>
  buckets.map((bucket, bucketIndex) =>
    bucketIndex === indexToReplace ? [...nextBucket] : [...bucket],
  );

const insertValueAt = (
  values: number[],
  insertionIndex: number,
  nextValue: number,
): number[] => [
  ...values.slice(0, insertionIndex),
  nextValue,
  ...values.slice(insertionIndex),
];

const createBucketRanges = ({
  bucketCount,
  minValue,
  maxValue,
  bucketWidth,
}: {
  bucketCount: number;
  minValue: number;
  maxValue: number;
  bucketWidth: number;
}): BucketRange[] =>
  Array.from({ length: bucketCount }, (_, bucketIndex) => {
    const rangeStart = minValue + bucketIndex * bucketWidth;
    const rangeEnd =
      bucketIndex === bucketCount - 1
        ? maxValue
        : Math.min(maxValue, rangeStart + bucketWidth - 1);

    return {
      label: `b${bucketIndex}`,
      rangeStart,
      rangeEnd,
    };
  });

const createBucketGroups = ({
  bucketValues,
  bucketRanges,
  activeBucketIndex,
  bucketActiveIndices = [],
  bucketBlueIndices = [],
  bucketSortedIndices = [],
}: {
  bucketValues: number[][];
  bucketRanges: BucketRange[];
  activeBucketIndex?: number;
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  bucketSortedIndices?: number[];
}): SortingBucketGroup[] =>
  bucketRanges.map((bucketRange, bucketIndex) => ({
    label: bucketRange.label,
    values: [...(bucketValues[bucketIndex] || [])],
    rangeStart: bucketRange.rangeStart,
    rangeEnd: bucketRange.rangeEnd,
    activeIndices:
      bucketIndex === activeBucketIndex ? [...bucketActiveIndices] : [],
    blueIndices:
      bucketIndex === activeBucketIndex ? [...bucketBlueIndices] : [],
    sortedIndices:
      bucketIndex === activeBucketIndex ? [...bucketSortedIndices] : [],
  }));

const createFrame = ({
  array,
  bucketValues,
  bucketRanges,
  outputValues = [],
  activeIndices = null,
  blueIndices = [],
  activeBucketIndex,
  bucketActiveIndices = [],
  bucketBlueIndices = [],
  bucketSortedIndices = [],
  outputActiveIndices = [],
  outputBlueIndices = [],
  outputSortedIndices = buildSortedIndices(outputValues.length),
  stats,
  description,
  completed = false,
}: BucketFrameOptions): SortingAnimationFrame => ({
  array: [...array],
  arrayLabel: "Input",
  activeIndices,
  blueIndices,
  sortedIndices: [],
  bucketGroups: createBucketGroups({
    bucketValues,
    bucketRanges,
    activeBucketIndex,
    bucketActiveIndices,
    bucketBlueIndices,
    bucketSortedIndices,
  }),
  outputValues: [...outputValues],
  outputLabel: "Output",
  outputActiveIndices: [...outputActiveIndices],
  outputBlueIndices: [...outputBlueIndices],
  outputSortedIndices: [...outputSortedIndices],
  stats: { ...stats },
  completed,
  description,
});

const getBucketIndex = ({
  value,
  minValue,
  bucketCount,
  bucketWidth,
}: {
  value: number;
  minValue: number;
  bucketCount: number;
  bucketWidth: number;
}): number =>
  Math.min(bucketCount - 1, Math.floor((value - minValue) / bucketWidth));

const getBucketFormulaDescription = ({
  value,
  minValue,
  bucketWidth,
  bucketCount,
  bucketIndex,
}: {
  value: number;
  minValue: number;
  bucketWidth: number;
  bucketCount: number;
  bucketIndex: number;
}): string =>
  `min(${bucketCount - 1}, floor((${value} - ${minValue}) / ${bucketWidth})) = ${bucketIndex}`;

const getBucketName = (bucketIndex: number): string => `b${bucketIndex}`;

const getFrameSoundValue = (
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
  if (inputIndex !== undefined) {
    return frame.array[inputIndex];
  }

  return undefined;
};

export function BucketSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "bucket-sort",
  );

  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [resetKey, setResetKey] = useState(0);

  const generateFrames = useCallback((size: number) => {
    const initialArray = createRandomArray(size);
    if (initialArray.length === 0) {
      return [
        createFrame({
          array: [],
          bucketValues: [],
          bucketRanges: [],
          outputValues: [],
          stats: { comparisons: 0, swaps: 0 },
          description: "Start: empty input.",
        }),
        createFrame({
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
      createFrame({
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
      sourceIndex++
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
        bucketValues = replaceBucketAt(bucketValues, bucketIndex, nextBucket);
        swaps += 1;

        framesList.push(
          createFrame({
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

      for (let scanIndex = 0; scanIndex < currentBucket.length; scanIndex++) {
        comparisons += 1;

        framesList.push(
          createFrame({
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
      bucketValues = replaceBucketAt(bucketValues, bucketIndex, nextBucket);
      swaps += 1;

      framesList.push(
        createFrame({
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
      createFrame({
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
      bucketIndex++
    ) {
      const sourceBucket = bucketValues[bucketIndex] || [];

      if (sourceBucket.length === 0) {
        framesList.push(
          createFrame({
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
        createFrame({
          array: initialArray,
          bucketValues,
          bucketRanges,
          outputValues,
          activeBucketIndex: bucketIndex,
          bucketSortedIndices:
            sourceBucket.length > 0
              ? buildSortedIndices(sourceBucket.length)
              : buildSortedIndices(0),
          stats: { comparisons, swaps },
          description: `${getBucketName(bucketIndex)} is sorted. Append its values.`,
        }),
      );

      for (let valueIndex = 0; valueIndex < sourceBucket.length; valueIndex++) {
        const nextValue = sourceBucket[valueIndex];
        const nextOutputValues = appendValue(outputValues, nextValue);
        const activeOutputIndex = nextOutputValues.length - 1;

        outputValues = [...nextOutputValues];
        swaps += 1;

        framesList.push(
          createFrame({
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
      createFrame({
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
  }, []);

  const frames = useMemo(
    () => generateFrames(arraySize[0]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arraySize, resetKey, generateFrames],
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isMuted, setIsMuted, playValue, playSuccess } = useSound();

  const data = frames[currentFrame] || {
    array: [],
    activeIndices: null,
    sortedIndices: [],
    stats: { comparisons: 0, swaps: 0 },
    completed: false,
    description: "Initializing...",
  };

  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [arraySize, resetKey]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isPlaying && currentFrame < frames.length - 1) {
      const nextFrame = frames[currentFrame + 1];
      const soundValue = getFrameSoundValue(nextFrame);

      if (soundValue !== undefined) {
        playValue(soundValue, 110);
      }

      const delay = Math.max(10, 510 - speed[0] * 5);
      timeoutId = setTimeout(() => {
        setCurrentFrame((previousFrame) => previousFrame + 1);
      }, delay);
    } else if (isPlaying && currentFrame >= frames.length - 1) {
      playSuccess();
      setIsPlaying(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPlaying, currentFrame, frames, speed, playValue, playSuccess]);

  const handleScrub = (value: number[]) => {
    setIsPlaying(false);
    setCurrentFrame(value[0]);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentFrame((previousFrame) =>
      Math.min(previousFrame + 1, frames.length - 1),
    );
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentFrame((previousFrame) => Math.max(previousFrame - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleRandomize = () => {
    setResetKey((previousKey) => previousKey + 1);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8 min-h-screen flex flex-col">
      <AlgorithmPageHeader
        title={metadata?.name || "Bucket Sort"}
        description={metadata?.description}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        <SortingVisualizer
          data={data}
          arraySize={arraySize}
          currentFrame={currentFrame}
          totalFrames={frames.length}
          onScrub={handleScrub}
        />

        <div className="w-full lg:w-80 space-y-4">
          <SortingStats
            comparisons={data.stats.comparisons}
            swaps={data.stats.swaps}
          />
          <SortingControls
            isPlaying={isPlaying}
            isCompleted={data.completed}
            onPlay={() => {
              if (currentFrame >= frames.length - 1) {
                setCurrentFrame(0);
              }
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onReset={handleReset}
            onRandomize={handleRandomize}
            speed={speed}
            onSpeedChange={setSpeed}
            arraySize={arraySize}
            onSizeChange={setArraySize}
            currentFrame={currentFrame}
            totalFrames={frames.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          <AlgorithmDetails
            timeComplexity={algorithmDetails.timeComplexity}
            spaceComplexity={algorithmDetails.spaceComplexity}
            description={algorithmDetails.description}
          />
        </div>
      </div>
    </div>
  );
}
