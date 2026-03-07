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
  timeComplexity: "Best O(n), average O(n²), worst O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Gnome Sort works like a garden gnome: it walks forward when neighbors are ordered, and steps backward to swap adjacent out-of-order values until the sequence is sorted.",
};

const createRandomArray = (size: number): number[] =>
  Array.from(
    { length: size },
    () =>
      Math.floor(Math.random() * (MAX_RANDOM_VALUE - MIN_RANDOM_VALUE + 1)) +
      MIN_RANDOM_VALUE,
  );

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

const buildSortedIndices = (size: number): number[] =>
  Array.from({ length: size }, (_, index) => index);

export function GnomeSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "gnome-sort",
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
    let index = 1;
    let comparisons = 0;
    let swaps = 0;

    while (index < currentArray.length) {
      if (index === 0) {
        framesList.push({
          array: [...currentArray],
          activeIndices: [0],
          blueIndices: [0],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description:
            "Reached the start of the array. Moving one step forward.",
        });
        index = 1;
      }

      comparisons++;
      const leftIndex = index - 1;
      const rightIndex = index;

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
        index += 1;
      } else {
        currentArray = swapIndices(currentArray, leftIndex, rightIndex);
        swaps++;

        framesList.push({
          array: [...currentArray],
          activeIndices: [leftIndex, rightIndex],
          blueIndices: [leftIndex],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Swapped ${currentArray[rightIndex]} and ${currentArray[leftIndex]}. Stepping backward.`,
        });
        index -= 1;
      }
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
        title={metadata?.name || "Gnome Sort"}
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
