import { useState, useEffect, useCallback, useMemo } from "react";
import { algorithms } from "@/algorithms";
import { useSound } from "@/hooks/use-sound";
import type { SortingAnimationFrame } from "@/types/sorting";

import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingStats } from "@/components/algorithm/SortingStats";
import { AlgorithmDetails } from "@/components/algorithm/AlgorithmDetails";

const MIN_RANDOM_VALUE = 10;
const MAX_RANDOM_VALUE = 100;

const algorithmDetails = {
  timeComplexity: "Best/Average/Worst O(n + k)",
  spaceComplexity: "O(n + k)",
  description:
    "Counting Sort builds frequency buckets, converts them into cumulative positions, and places values from right to left to preserve stability.",
};

const createRandomArray = (size: number): number[] =>
  Array.from(
    { length: size },
    () =>
      Math.floor(Math.random() * (MAX_RANDOM_VALUE - MIN_RANDOM_VALUE + 1)) +
      MIN_RANDOM_VALUE,
  );

const incrementCountAt = (counts: number[], index: number): number[] =>
  counts.map((count, countIndex) => (countIndex === index ? count + 1 : count));

const decrementCountAt = (counts: number[], index: number): number[] =>
  counts.map((count, countIndex) => (countIndex === index ? count - 1 : count));

const setValueAt = (
  values: number[],
  indexToSet: number,
  nextValue: number,
): number[] =>
  values.map((value, index) => (index === indexToSet ? nextValue : value));

const buildSortedIndices = (size: number): number[] =>
  Array.from({ length: size }, (_, index) => index);

const createZeroArray = (size: number): number[] =>
  Array.from({ length: size }, () => 0);

const addUniqueIndex = (indices: number[], index: number): number[] =>
  indices.includes(index) ? indices : [...indices, index];

const getFrameSoundValue = (
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
  if (inputIndex !== undefined) {
    return frame.array[inputIndex];
  }

  return undefined;
};

export function CountingSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "counting-sort",
  );

  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [resetKey, setResetKey] = useState(0);

  const generateFrames = useCallback((size: number) => {
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
      sourceIndex++
    ) {
      const value = initialArray[sourceIndex];
      const countIndex = value - minValue;
      counts = incrementCountAt(counts, countIndex);

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

    for (let countIndex = 1; countIndex < counts.length; countIndex++) {
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
      sourceIndex--
    ) {
      const value = initialArray[sourceIndex];
      const countIndex = value - minValue;
      const outputIndex = counts[countIndex] - 1;
      outputArray = setValueAt(outputArray, outputIndex, value);
      counts = decrementCountAt(counts, countIndex);
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
        title={metadata?.name || "Counting Sort"}
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
