import { useState, useEffect, useCallback, useMemo } from "react";
import { algorithms } from "@/algorithms";
import { useSound } from "@/hooks/use-sound";
import type { SortingAnimationFrame } from "@/types/sorting";

import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingStats } from "@/components/algorithm/SortingStats";
import { AlgorithmDetails } from "@/components/algorithm/AlgorithmDetails";

const algorithmDetails = {
  timeComplexity: "Best O(n log n), average O(n² / 2^p), worst O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Comb Sort improves Bubble Sort by comparing elements with a shrinking gap, which quickly moves small values toward the front and large values toward the end.",
};

const createRandomArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 91) + 10);

const swapIndices = (
  values: number[],
  firstIndex: number,
  secondIndex: number,
): number[] =>
  values.map((value, index) => {
    if (index === firstIndex) {
      return values[secondIndex];
    }

    if (index === secondIndex) {
      return values[firstIndex];
    }

    return value;
  });

export function CombSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "comb-sort",
  );

  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [resetKey, setResetKey] = useState(0);

  const generateFrames = useCallback((size: number) => {
    const initialArray = createRandomArray(size);
    const framesList: SortingAnimationFrame[] = [
      {
        array: [...initialArray],
        activeIndices: null,
        sortedIndices: [],
        stats: { comparisons: 0, swaps: 0 },
        completed: false,
        description: "Starting Comb Sort initialized with random values.",
      },
    ];

    let currentArray = [...initialArray];
    const itemCount = currentArray.length;
    const shrinkFactor = 1.3;
    let gap = itemCount;
    let comparisons = 0;
    let swaps = 0;
    let swapped = true;

    while (gap !== 1 || swapped) {
      gap = Math.max(1, Math.floor(gap / shrinkFactor));
      swapped = false;

      framesList.push({
        array: [...currentArray],
        activeIndices: null,
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Starting pass with gap ${gap}.`,
      });

      for (let leftIndex = 0; leftIndex + gap < itemCount; leftIndex++) {
        const rightIndex = leftIndex + gap;
        comparisons++;

        framesList.push({
          array: [...currentArray],
          activeIndices: [leftIndex, rightIndex],
          blueIndices: [rightIndex],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing ${currentArray[leftIndex]} and ${currentArray[rightIndex]} with gap ${gap}.`,
        });

        if (currentArray[leftIndex] > currentArray[rightIndex]) {
          currentArray = swapIndices(currentArray, leftIndex, rightIndex);
          swaps++;
          swapped = true;

          framesList.push({
            array: [...currentArray],
            activeIndices: [leftIndex, rightIndex],
            blueIndices: [rightIndex],
            sortedIndices: [],
            stats: { comparisons, swaps },
            completed: false,
            description: `Swapped ${currentArray[rightIndex]} and ${currentArray[leftIndex]}.`,
          });
        }
      }
    }

    const allIndices = Array.from({ length: itemCount }, (_, index) => index);

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: allIndices,
      stats: { comparisons, swaps },
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
      const activeIndex =
        nextFrame?.activeIndices?.[1] ?? nextFrame?.activeIndices?.[0];

      if (activeIndex !== undefined) {
        playValue(nextFrame.array[activeIndex], 110);
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
        title={metadata?.name || "Comb Sort"}
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
