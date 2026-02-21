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
  timeComplexity: "Best/Average/Worst O(n log n)",
  spaceComplexity: "O(1)",
  description:
    "Heap Sort builds a max heap and repeatedly moves the root (largest value) to the end of the array, shrinking the heap each step.",
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

const createTailSortedIndices = (
  itemCount: number,
  startIndex: number,
): number[] =>
  Array.from(
    { length: Math.max(0, itemCount - startIndex) },
    (_, offset) => startIndex + offset,
  );

export function HeapSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "heap-sort",
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
        description: "Starting Heap Sort initialized with random values.",
      },
    ];

    let currentArray = [...initialArray];
    const itemCount = currentArray.length;
    let comparisons = 0;
    let swaps = 0;

    const heapify = (
      heapSize: number,
      rootIndex: number,
      sortedIndices: number[],
    ) => {
      let currentRoot = rootIndex;

      while (true) {
        const leftChild = currentRoot * 2 + 1;
        const rightChild = currentRoot * 2 + 2;
        let largestIndex = currentRoot;

        if (leftChild < heapSize) {
          comparisons++;
          framesList.push({
            array: [...currentArray],
            activeIndices: [currentRoot, leftChild],
            blueIndices: [largestIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Comparing parent ${currentArray[currentRoot]} and left child ${currentArray[leftChild]}.`,
          });

          if (currentArray[leftChild] > currentArray[largestIndex]) {
            largestIndex = leftChild;
            framesList.push({
              array: [...currentArray],
              activeIndices: [currentRoot, leftChild],
              blueIndices: [largestIndex],
              sortedIndices: [...sortedIndices],
              stats: { comparisons, swaps },
              completed: false,
              description: `Left child ${currentArray[leftChild]} is the new largest.`,
            });
          }
        }

        if (rightChild < heapSize) {
          comparisons++;
          framesList.push({
            array: [...currentArray],
            activeIndices: [largestIndex, rightChild],
            blueIndices: [largestIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Comparing current largest ${currentArray[largestIndex]} and right child ${currentArray[rightChild]}.`,
          });

          if (currentArray[rightChild] > currentArray[largestIndex]) {
            largestIndex = rightChild;
            framesList.push({
              array: [...currentArray],
              activeIndices: [currentRoot, rightChild],
              blueIndices: [largestIndex],
              sortedIndices: [...sortedIndices],
              stats: { comparisons, swaps },
              completed: false,
              description: `Right child ${currentArray[rightChild]} is the new largest.`,
            });
          }
        }

        if (largestIndex === currentRoot) {
          break;
        }

        currentArray = swapIndices(currentArray, currentRoot, largestIndex);
        swaps++;

        framesList.push({
          array: [...currentArray],
          activeIndices: [currentRoot, largestIndex],
          blueIndices: [largestIndex],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Swapped ${currentArray[largestIndex]} and ${currentArray[currentRoot]} to restore heap property.`,
        });

        currentRoot = largestIndex;
      }
    };

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: "Building max heap.",
    });

    for (
      let startIndex = Math.floor(itemCount / 2) - 1;
      startIndex >= 0;
      startIndex--
    ) {
      framesList.push({
        array: [...currentArray],
        activeIndices: [startIndex],
        sortedIndices: [],
        stats: { comparisons, swaps },
        completed: false,
        description: `Heapifying subtree rooted at index ${startIndex}.`,
      });
      heapify(itemCount, startIndex, []);
    }

    framesList.push({
      array: [...currentArray],
      activeIndices: null,
      sortedIndices: [],
      stats: { comparisons, swaps },
      completed: false,
      description: "Max heap ready. Extracting largest elements.",
    });

    for (let endIndex = itemCount - 1; endIndex > 0; endIndex--) {
      currentArray = swapIndices(currentArray, 0, endIndex);
      swaps++;
      const sortedIndices = createTailSortedIndices(itemCount, endIndex);

      framesList.push({
        array: [...currentArray],
        activeIndices: [0, endIndex],
        blueIndices: [endIndex],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps },
        completed: false,
        description: `Moved max value ${currentArray[endIndex]} to index ${endIndex}.`,
      });

      heapify(endIndex, 0, sortedIndices);
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
        title={metadata?.name || "Heap Sort"}
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
