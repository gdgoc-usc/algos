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
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description:
    "Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.",
};

export function BubbleSortPage() {
  const metadata = algorithms.find((a) => a.slug === "bubble-sort");

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
      description: "Starting Bubble Sort initialized with random values.",
    });

    const arr = [...newArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Comparison Frame
        comparisons++;
        framesList.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          // Swap logic
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          swapped = true;

          // Swap Frame (Post-swap state)
          framesList.push({
            array: [...arr],
            activeIndices: [j, j + 1],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Swapped ${arr[j]} and ${arr[j + 1]}`,
          });
        }
      }
      sortedIndices.push(n - i - 1);

      // End of Pass Frame
      framesList.push({
        array: [...arr],
        activeIndices: null,
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `${arr[n - i - 1]} is now sorted.`,
      });

      if (!swapped) {
        // Optimization: fill remaining
        const remaining = Array.from({ length: n - i - 1 }, (_, idx) => idx);
        sortedIndices.push(...remaining);
        break;
      }
    }

    // Final sorted remainder
    const allIndices = Array.from({ length: n }, (_, i) => i);

    // Completed Frame
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
      // Audio Effect
      if (frames[currentFrame + 1]?.activeIndices) {
        const [, b] = frames[currentFrame + 1].activeIndices!;
        const value = frames[currentFrame + 1].array[b];
        playValue(value, 110); // 110Hz base
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
        title={metadata?.name || "Bubble Sort"}
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
