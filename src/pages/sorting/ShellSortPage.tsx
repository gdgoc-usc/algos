import { useState, useEffect, useCallback, useMemo } from "react";
import { algorithms } from "@/algorithms";
import { useSound } from "@/hooks/use-sound";
import type { SortingAnimationFrame } from "@/types/sorting";

// Components
import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingStats } from "@/components/algorithm/SortingStats";
import { AlgorithmDetails } from "@/components/algorithm/AlgorithmDetails";

const algorithmDetails = {
  timeComplexity: "Best O(n log n), average ~O(n^1.5), worst O(n^2)",
  spaceComplexity: "O(1)",
  description:
    "Shell Sort improves insertion sort by comparing elements far apart first using a shrinking gap sequence, then finishes with a final insertion-style pass.",
};

const setValueAtIndex = (
  values: number[],
  index: number,
  value: number,
): number[] =>
  values.map((currentValue, currentIndex) =>
    currentIndex === index ? value : currentValue,
  );

export function ShellSortPage() {
  const metadata = algorithms.find((a) => a.slug === "shell-sort");

  // Settings
  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [resetKey, setResetKey] = useState(0);

  // Generate Frames Logic
  const generateFrames = useCallback((size: number) => {
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 91) + 10,
    );

    const framesList: SortingAnimationFrame[] = [];
    // Initial Frame
    framesList.push({
      array: [...newArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons: 0, swaps: 0 },
      completed: false,
      description: "Starting Shell Sort.",
    });

    let arr = [...newArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      framesList.push({
        array: [...arr],
        activeIndices: null,
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Starting pass with gap ${gap}.`,
      });

      for (let i = gap; i < n; i++) {
        const key = arr[i];
        let j = i;

        framesList.push({
          array: [...arr],
          activeIndices: [i],
          blueIndices: [Math.max(i - gap, 0)],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Selected ${key} for gap insertion (gap ${gap}).`,
        });

        while (j >= gap) {
          const compareIndex = j - gap;
          comparisons++;

          framesList.push({
            array: [...arr],
            activeIndices: [j],
            blueIndices: [compareIndex],
            sortedIndices: [],
            stats: { comparisons, swaps },
            completed: false,
            description: `Comparing ${arr[compareIndex]} and ${key} with gap ${gap}.`,
          });

          if (arr[compareIndex] > key) {
            arr = setValueAtIndex(arr, j, arr[compareIndex]);
            swaps++;

            framesList.push({
              array: [...arr],
              activeIndices: [compareIndex],
              blueIndices: [j],
              sortedIndices: [],
              stats: { comparisons, swaps },
              completed: false,
              description: `Shifted ${arr[j]} from index ${compareIndex} to ${j}.`,
            });

            j -= gap;
            continue;
          }

          break;
        }

        arr = setValueAtIndex(arr, j, key);

        framesList.push({
          array: [...arr],
          activeIndices: null,
          blueIndices: [j],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Placed ${key} at index ${j}.`,
        });
      }
    }

    const allIndices = Array.from({ length: n }, (_, i) => i);

    framesList.push({
      array: [...arr],
      activeIndices: null,
      sortedIndices: allIndices,
      stats: { comparisons, swaps },
      completed: true,
      description: "Sorting completed!",
    });

    return framesList;
  }, []);

  // Animation State
  const frames = useMemo(
    () => generateFrames(arraySize[0]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arraySize, resetKey, generateFrames],
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isMuted, setIsMuted, playValue, playSuccess } = useSound();

  // Derived State
  const data = frames[currentFrame] || {
    array: [],
    activeIndices: null,
    sortedIndices: [],
    stats: { comparisons: 0, swaps: 0 },
    completed: false,
    description: "Initializing...",
  };

  // Initialization
  const [prevArraySize, setPrevArraySize] = useState(arraySize);
  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  if (arraySize !== prevArraySize || resetKey !== prevResetKey) {
    setPrevArraySize(arraySize);
    setPrevResetKey(resetKey);
    setCurrentFrame(0);
    setIsPlaying(false);
  }

  // Playback Loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isPlaying && currentFrame < frames.length - 1) {
      const frame = frames[currentFrame + 1];
      if (frame?.activeIndices?.length) {
        const blueIndex = frame.blueIndices?.[0];
        const idx =
          blueIndex !== undefined && frame.activeIndices.includes(blueIndex)
            ? blueIndex
            : frame.activeIndices[0];

        if (idx !== undefined) {
          playValue(frame.array[idx], 110);
        }
      }

      // Calculate delay: Speed 1-100 -> Delay 500ms-10ms
      const delay = Math.max(10, 510 - speed[0] * 5);

      timeoutId = setTimeout(() => {
        setCurrentFrame((prev) => prev + 1);
      }, delay);
    } else if (currentFrame >= frames.length - 1) {
      setTimeout(() => {
        if (isPlaying) {
          playSuccess();
        }
        setIsPlaying(false);
      }, 0);
    }

    return () => clearTimeout(timeoutId);
  }, [
    isPlaying,
    currentFrame,
    frames.length,
    speed,
    frames,
    playValue,
    playSuccess,
  ]);

  // Handlers
  const handleScrub = (val: number[]) => {
    setIsPlaying(false);
    setCurrentFrame(val[0]);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.min(prev + 1, frames.length - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleRandomize = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8 min-h-screen flex flex-col">
      <AlgorithmPageHeader
        title={metadata?.name || "Shell Sort"}
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
