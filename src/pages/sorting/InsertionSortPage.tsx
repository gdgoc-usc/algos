import { useState, useEffect, useCallback } from "react";
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
    "Insertion Sort builds the final sorted array one item at a time. It iterates through an input element and grows a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.",
};

export function InsertionSortPage() {
  const metadata = algorithms.find((a) => a.slug === "insertion-sort");

  // Settings
  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);

  // Animation State
  const [frames, setFrames] = useState<SortingAnimationFrame[]>([]);
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
      description: "Starting Insertion Sort.",
    });

    const arr = [...newArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0; // We'll count shifts as swaps for consistency in stats

    // First element is implicitly sorted
    framesList.push({
      array: [...arr],
      activeIndices: null /* No active comparison yet */,
      sortedIndices: [0],
      stats: { comparisons, swaps },
      completed: false,
      description: "The first element is considered sorted.",
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Frame: Select key
      // Key is at i. Sorted is 0..i-1.
      framesList.push({
        array: [...arr],
        activeIndices: [i], // Key -> Red
        blueIndices: [],
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        stats: { comparisons, swaps },
        completed: false,
        description: `Selected ${key} to insert.`,
      });

      /*
       * Shift elements of arr[0..i-1], that are greater than key,
       * to one position ahead of their current position
       */
      while (j >= 0) {
        comparisons++;

        // Comparison Frame
        // Hole is at j+1 (holds old value or duplicate, conceptually Key's spot).
        // Candidate is at j.
        // We want Hole -> Red, Candidate -> Blue.
        const sortedIndices = Array.from({ length: i }, (_, idx) => idx).filter(
          (idx) => idx !== j,
        ); // Exclude candidate from sorted so it can be Blue

        framesList.push({
          array: [...arr],
          activeIndices: [j + 1], // Hole -> Red
          blueIndices: [j], // Candidate -> Blue
          sortedIndices: sortedIndices,
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing ${arr[j]} with Key (${key}).`,
        });

        if (arr[j] > key) {
          // Shift arr[j] to arr[j+1]
          arr[j + 1] = arr[j];
          swaps++;

          // Shift Frame
          // Now value at j+1 is the shifted element.
          // Hole moves to j.
          // Let's visualize the move.
          // j+1 containts the shifted value -> Blue.
          // j is the new Hole -> Red.
          const sortedIndicesShift = Array.from(
            { length: i },
            (_, idx) => idx,
          ).filter((idx) => idx !== j + 1); // Exclude shifted pos from sorted

          framesList.push({
            array: [...arr],
            activeIndices: [j], // New Hole -> Red
            blueIndices: [j + 1], // Moved element -> Blue
            sortedIndices: sortedIndicesShift,
            stats: { comparisons, swaps },
            completed: false,
            description: `Shifted ${arr[j + 1]} to the right.`,
          });

          j = j - 1;
        } else {
          break;
        }
      }

      // Insert key
      arr[j + 1] = key;

      // Insertion Frame
      const newSorted = Array.from({ length: i + 1 }, (_, idx) => idx);

      framesList.push({
        array: [...arr],
        activeIndices: null,
        blueIndices: [j + 1], // Highlight inserted key
        sortedIndices: newSorted,
        stats: { comparisons, swaps },
        completed: false,
        description: `Inserted ${key} at position ${j + 1}.`,
      });
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

  // Initialization
  useEffect(() => {
    const newFrames = generateFrames(arraySize[0]);
    setFrames(newFrames);
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [arraySize, generateFrames]);

  // Playback Loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isPlaying && currentFrame < frames.length - 1) {
      // Audio Effect
      const frame = frames[currentFrame + 1];
      if (frame?.activeIndices?.length) {
        const idx = frame.activeIndices.includes(frame.blueIndices?.[0]!)
          ? frame.blueIndices?.[0]
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
      if (isPlaying) {
        // Just finished
        playSuccess();
      }
      setIsPlaying(false);
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
    const newFrames = generateFrames(arraySize[0]);
    setFrames(newFrames);
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8 min-h-screen flex flex-col">
      <AlgorithmPageHeader
        title={metadata?.name || "Insertion Sort"}
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
