import { useState, useEffect, useCallback, useMemo } from "react";
import { algorithms } from "@/algorithms";
import { useSound } from "@/hooks/use-sound";
import type { SortingAnimationFrame } from "@/types/sorting";

import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { TournamentTreeVisualizer } from "@/components/algorithm/TournamentTreeVisualizer";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingStats } from "@/components/algorithm/SortingStats";
import { AlgorithmDetails } from "@/components/algorithm/AlgorithmDetails";
import { Button } from "@/components/ui/button";

const MIN_RANDOM_VALUE = 10;
const MAX_RANDOM_VALUE = 100;
const TOURNAMENT_INFINITY = Number.POSITIVE_INFINITY;

const algorithmDetails = {
  timeComplexity: "Best/Average/Worst O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Tournament Sort stores the input at the leaves of an auxiliary heap array, builds winners bottom-up, then extracts the root winner by setting its leaf to infinity and retournamenting only the affected path.",
};

type ViewMode = "bars" | "tree";

type TournamentTreeState = {
  treeValues: Array<number | null>;
  treeSourceIndices: Array<number | null>;
  leafStartIndex: number;
};

type TournamentVisualFields = Pick<
  SortingAnimationFrame,
  | "tournamentTreeValues"
  | "tournamentTreeSourceIndices"
  | "tournamentTreeActiveIndices"
  | "tournamentTreeBlueIndices"
  | "tournamentOutputValues"
  | "tournamentOutputActiveIndices"
  | "tournamentOutputBlueIndices"
  | "tournamentOutputSortedIndices"
>;

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

const appendFrame = (
  frames: SortingAnimationFrame[],
  frame: SortingAnimationFrame,
): SortingAnimationFrame[] => [...frames, frame];

const buildIndexRange = (startIndex: number, endIndex: number): number[] =>
  Array.from(
    { length: Math.max(endIndex - startIndex, 0) },
    (_, offset) => startIndex + offset,
  );

const createNullArray = (size: number): Array<number | null> =>
  Array.from({ length: size }, () => null);

const setNullableValueAt = (
  values: Array<number | null>,
  indexToSet: number,
  nextValue: number | null,
): Array<number | null> =>
  values.map((value, index) => (index === indexToSet ? nextValue : value));

const isNumber = (value: number | null | undefined): value is number =>
  value !== null && value !== undefined;

const getParentIndex = (nodeIndex: number): number =>
  Math.floor((nodeIndex - 1) / 2);

const getComparableTournamentValue = (value: number | null): number =>
  value === null ? TOURNAMENT_INFINITY : value;

const buildTournamentTreeState = (values: number[]): TournamentTreeState => {
  if (values.length === 0) {
    return {
      treeValues: [],
      treeSourceIndices: [],
      leafStartIndex: 0,
    };
  }

  const leafStartIndex = values.length - 1;
  const treeSize = values.length * 2 - 1;
  const treeValues = Array.from({ length: treeSize }, (_, index) => {
    if (index < leafStartIndex) {
      return null;
    }

    return values[index - leafStartIndex] ?? null;
  });
  const treeSourceIndices = Array.from({ length: treeSize }, (_, index) => {
    if (index < leafStartIndex) {
      return null;
    }

    return index;
  });

  return {
    treeValues,
    treeSourceIndices,
    leafStartIndex,
  };
};

const createLeafToArrayIndices = (
  itemCount: number,
  leafStartIndex: number,
): Array<number | null> =>
  Array.from({ length: itemCount * 2 - 1 }, (_, index) => {
    if (index < leafStartIndex) {
      return null;
    }

    return index - leafStartIndex;
  });

const createArrayToLeafIndices = (
  itemCount: number,
  leafStartIndex: number,
): Array<number | null> =>
  Array.from({ length: itemCount }, (_, index) => index + leafStartIndex);

const getBarIndicesFromTreeNodeIndices = ({
  treeNodeIndices,
  treeSourceIndices,
  leafToArrayIndices,
}: {
  treeNodeIndices: number[];
  treeSourceIndices: Array<number | null>;
  leafToArrayIndices: Array<number | null>;
}): number[] =>
  treeNodeIndices.reduce<number[]>((indices, treeNodeIndex) => {
    const leafNodeIndex = treeSourceIndices[treeNodeIndex];

    if (leafNodeIndex === null || leafNodeIndex === undefined) {
      return indices;
    }

    const arrayIndex = leafToArrayIndices[leafNodeIndex];

    if (!isNumber(arrayIndex) || indices.includes(arrayIndex)) {
      return indices;
    }

    return [...indices, arrayIndex];
  }, []);

const createTournamentVisualFields = ({
  treeValues,
  treeSourceIndices,
  treeActiveIndices = [],
  treeBlueIndices = [],
  outputValues,
  outputActiveIndices = [],
  outputBlueIndices = [],
  outputSortedIndices,
}: {
  treeValues: Array<number | null>;
  treeSourceIndices: Array<number | null>;
  treeActiveIndices?: number[];
  treeBlueIndices?: number[];
  outputValues: Array<number | null>;
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices: number[];
}): TournamentVisualFields => ({
  tournamentTreeValues: [...treeValues],
  tournamentTreeSourceIndices: [...treeSourceIndices],
  tournamentTreeActiveIndices: [...treeActiveIndices],
  tournamentTreeBlueIndices: [...treeBlueIndices],
  tournamentOutputValues: [...outputValues],
  tournamentOutputActiveIndices: [...outputActiveIndices],
  tournamentOutputBlueIndices: [...outputBlueIndices],
  tournamentOutputSortedIndices: [...outputSortedIndices],
});

const createFrame = ({
  completed = false,
  ...frame
}: SortingAnimationFrame): SortingAnimationFrame => ({
  ...frame,
  completed,
});

export function TournamentSortPage() {
  const metadata = algorithms.find(
    (algorithm) => algorithm.slug === "tournament-sort",
  );

  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [resetKey, setResetKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("bars");

  const generateFrames = useCallback((size: number) => {
    const initialArray = createRandomArray(size);
    const initialTournamentState = buildTournamentTreeState(initialArray);
    let tournamentTreeValues = [...initialTournamentState.treeValues];
    let tournamentTreeSourceIndices = [
      ...initialTournamentState.treeSourceIndices,
    ];
    let leafToArrayIndices =
      initialArray.length === 0
        ? []
        : createLeafToArrayIndices(
            initialArray.length,
            initialTournamentState.leafStartIndex,
          );
    let arrayToLeafIndices =
      initialArray.length === 0
        ? []
        : createArrayToLeafIndices(
            initialArray.length,
            initialTournamentState.leafStartIndex,
          );
    let tournamentOutputValues = createNullArray(initialArray.length);
    let tournamentOutputSortedIndices: number[] = [];
    let framesList: SortingAnimationFrame[] = [
      createFrame({
        array: [...initialArray],
        activeIndices: null,
        blueIndices: [],
        sortedIndices: [],
        stats: { comparisons: 0, swaps: 0 },
        completed: false,
        description:
          initialArray.length === 0
            ? "Starting Tournament Sort with an empty input."
            : `Placed the input into the leaf layer of an auxiliary heap array of size ${initialArray.length * 2 - 1}.`,
        ...createTournamentVisualFields({
          treeValues: tournamentTreeValues,
          treeSourceIndices: tournamentTreeSourceIndices,
          outputValues: tournamentOutputValues,
          outputSortedIndices: tournamentOutputSortedIndices,
        }),
      }),
    ];

    if (initialArray.length === 0) {
      return appendFrame(
        framesList,
        createFrame({
          array: [],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [],
          stats: { comparisons: 0, swaps: 0 },
          completed: true,
          description: "Sorting completed!",
          ...createTournamentVisualFields({
            treeValues: [],
            treeSourceIndices: [],
            outputValues: [],
            outputSortedIndices: [],
          }),
        }),
      );
    }

    if (initialArray.length === 1) {
      tournamentOutputValues = [initialArray[0]];
      tournamentOutputSortedIndices = [0];

      return appendFrame(
        framesList,
        createFrame({
          array: [...initialArray],
          activeIndices: [0],
          blueIndices: [0],
          sortedIndices: [0],
          stats: { comparisons: 0, swaps: 0 },
          completed: true,
          description: "Single value detected. Sorting completed!",
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            treeBlueIndices: [0],
            outputValues: tournamentOutputValues,
            outputActiveIndices: [0],
            outputBlueIndices: [0],
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );
    }

    let currentArray = [...initialArray];
    let comparisons = 0;
    let swaps = 0;

    for (
      let parentIndex = initialTournamentState.leafStartIndex - 1;
      parentIndex >= 0;
      parentIndex -= 1
    ) {
      const leftChildIndex = parentIndex * 2 + 1;
      const rightChildIndex = parentIndex * 2 + 2;
      const barActiveIndices = getBarIndicesFromTreeNodeIndices({
        treeNodeIndices: [leftChildIndex, rightChildIndex],
        treeSourceIndices: tournamentTreeSourceIndices,
        leafToArrayIndices,
      });

      comparisons += 1;

      framesList = appendFrame(
        framesList,
        createFrame({
          array: [...currentArray],
          activeIndices: barActiveIndices.length > 0 ? barActiveIndices : null,
          blueIndices: [],
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `Comparing children of parent index ${parentIndex} while building the tournament bottom-up.`,
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            treeActiveIndices: [leftChildIndex, rightChildIndex],
            outputValues: tournamentOutputValues,
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );

      const leftValue = getComparableTournamentValue(
        tournamentTreeValues[leftChildIndex],
      );
      const rightValue = getComparableTournamentValue(
        tournamentTreeValues[rightChildIndex],
      );
      const winnerChildIndex =
        leftValue <= rightValue ? leftChildIndex : rightChildIndex;
      const winnerValue = tournamentTreeValues[winnerChildIndex];
      const winnerSourceIndex = tournamentTreeSourceIndices[winnerChildIndex];
      const barBlueIndices = getBarIndicesFromTreeNodeIndices({
        treeNodeIndices: [winnerChildIndex],
        treeSourceIndices: tournamentTreeSourceIndices,
        leafToArrayIndices,
      });

      tournamentTreeValues = setNullableValueAt(
        tournamentTreeValues,
        parentIndex,
        winnerValue,
      );
      tournamentTreeSourceIndices = setNullableValueAt(
        tournamentTreeSourceIndices,
        parentIndex,
        winnerSourceIndex ?? null,
      );

      framesList = appendFrame(
        framesList,
        createFrame({
          array: [...currentArray],
          activeIndices: barActiveIndices.length > 0 ? barActiveIndices : null,
          blueIndices: barBlueIndices,
          sortedIndices: [],
          stats: { comparisons, swaps },
          completed: false,
          description: `${winnerValue} wins at parent index ${parentIndex}.`,
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            treeActiveIndices: [leftChildIndex, rightChildIndex],
            treeBlueIndices: [parentIndex],
            outputValues: tournamentOutputValues,
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );
    }

    for (
      let sortedIndex = 0;
      sortedIndex < currentArray.length;
      sortedIndex += 1
    ) {
      const sortedIndices = buildIndexRange(0, sortedIndex);
      const winnerValue = tournamentTreeValues[0];
      const winnerLeafNodeIndex = tournamentTreeSourceIndices[0];

      if (
        winnerValue === null ||
        winnerValue === TOURNAMENT_INFINITY ||
        winnerLeafNodeIndex === null ||
        winnerLeafNodeIndex === undefined
      ) {
        break;
      }

      const winnerArrayIndex = leafToArrayIndices[winnerLeafNodeIndex];
      const winnerBarIndices = isNumber(winnerArrayIndex)
        ? [winnerArrayIndex]
        : [];

      framesList = appendFrame(
        framesList,
        createFrame({
          array: [...currentArray],
          activeIndices: winnerBarIndices.length > 0 ? winnerBarIndices : null,
          blueIndices: winnerBarIndices,
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `${winnerValue} rises to the root as the next winner.`,
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            treeBlueIndices: [0],
            outputValues: tournamentOutputValues,
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );

      tournamentOutputValues = setNullableValueAt(
        tournamentOutputValues,
        sortedIndex,
        winnerValue,
      );

      if (isNumber(winnerArrayIndex) && winnerArrayIndex !== sortedIndex) {
        const displacedValue = currentArray[sortedIndex];
        const displacedLeafNodeIndex = arrayToLeafIndices[sortedIndex];
        currentArray = swapIndices(currentArray, sortedIndex, winnerArrayIndex);
        swaps += 1;

        leafToArrayIndices = setNullableValueAt(
          leafToArrayIndices,
          winnerLeafNodeIndex,
          null,
        );

        if (isNumber(displacedLeafNodeIndex)) {
          leafToArrayIndices = setNullableValueAt(
            leafToArrayIndices,
            displacedLeafNodeIndex,
            winnerArrayIndex,
          );
        }

        arrayToLeafIndices = setNullableValueAt(
          arrayToLeafIndices,
          sortedIndex,
          null,
        );

        if (isNumber(displacedLeafNodeIndex)) {
          arrayToLeafIndices = setNullableValueAt(
            arrayToLeafIndices,
            winnerArrayIndex,
            displacedLeafNodeIndex,
          );
        }

        framesList = appendFrame(
          framesList,
          createFrame({
            array: [...currentArray],
            activeIndices: [sortedIndex, winnerArrayIndex],
            blueIndices: [sortedIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Placed ${winnerValue} at index ${sortedIndex} by swapping with ${displacedValue}.`,
            ...createTournamentVisualFields({
              treeValues: tournamentTreeValues,
              treeSourceIndices: tournamentTreeSourceIndices,
              treeBlueIndices: [0],
              outputValues: tournamentOutputValues,
              outputActiveIndices: [sortedIndex],
              outputBlueIndices: [sortedIndex],
              outputSortedIndices: tournamentOutputSortedIndices,
            }),
          }),
        );
      } else {
        if (isNumber(winnerArrayIndex)) {
          leafToArrayIndices = setNullableValueAt(
            leafToArrayIndices,
            winnerLeafNodeIndex,
            null,
          );
          arrayToLeafIndices = setNullableValueAt(
            arrayToLeafIndices,
            sortedIndex,
            null,
          );
        }

        framesList = appendFrame(
          framesList,
          createFrame({
            array: [...currentArray],
            activeIndices: [sortedIndex],
            blueIndices: [sortedIndex],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `${winnerValue} is already at the next sorted position.`,
            ...createTournamentVisualFields({
              treeValues: tournamentTreeValues,
              treeSourceIndices: tournamentTreeSourceIndices,
              treeBlueIndices: [0],
              outputValues: tournamentOutputValues,
              outputActiveIndices: [sortedIndex],
              outputBlueIndices: [sortedIndex],
              outputSortedIndices: tournamentOutputSortedIndices,
            }),
          }),
        );
      }

      tournamentTreeValues = setNullableValueAt(
        tournamentTreeValues,
        winnerLeafNodeIndex,
        TOURNAMENT_INFINITY,
      );

      framesList = appendFrame(
        framesList,
        createFrame({
          array: [...currentArray],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Set the winning leaf lane to infinity to remove ${winnerValue} from the tournament.`,
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            treeActiveIndices: [winnerLeafNodeIndex],
            treeBlueIndices: [winnerLeafNodeIndex],
            outputValues: tournamentOutputValues,
            outputActiveIndices: [sortedIndex],
            outputBlueIndices: [sortedIndex],
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );

      let currentNodeIndex = winnerLeafNodeIndex;

      while (currentNodeIndex > 0) {
        const parentNodeIndex = getParentIndex(currentNodeIndex);
        const leftChildIndex = parentNodeIndex * 2 + 1;
        const rightChildIndex = parentNodeIndex * 2 + 2;
        const barActiveIndices = getBarIndicesFromTreeNodeIndices({
          treeNodeIndices: [leftChildIndex, rightChildIndex],
          treeSourceIndices: tournamentTreeSourceIndices,
          leafToArrayIndices,
        });

        comparisons += 1;

        framesList = appendFrame(
          framesList,
          createFrame({
            array: [...currentArray],
            activeIndices:
              barActiveIndices.length > 0 ? barActiveIndices : null,
            blueIndices: [],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description: `Retournamenting parent index ${parentNodeIndex} after removing the winner lane.`,
            ...createTournamentVisualFields({
              treeValues: tournamentTreeValues,
              treeSourceIndices: tournamentTreeSourceIndices,
              treeActiveIndices: [leftChildIndex, rightChildIndex],
              outputValues: tournamentOutputValues,
              outputActiveIndices: [sortedIndex],
              outputBlueIndices: [sortedIndex],
              outputSortedIndices: tournamentOutputSortedIndices,
            }),
          }),
        );

        const leftValue = getComparableTournamentValue(
          tournamentTreeValues[leftChildIndex],
        );
        const rightValue = getComparableTournamentValue(
          tournamentTreeValues[rightChildIndex],
        );
        const winnerChildIndex =
          leftValue <= rightValue ? leftChildIndex : rightChildIndex;
        const nextParentValue = tournamentTreeValues[winnerChildIndex];
        const nextParentSourceIndex =
          tournamentTreeSourceIndices[winnerChildIndex];
        const barBlueIndices = getBarIndicesFromTreeNodeIndices({
          treeNodeIndices: [winnerChildIndex],
          treeSourceIndices: tournamentTreeSourceIndices,
          leafToArrayIndices,
        });

        tournamentTreeValues = setNullableValueAt(
          tournamentTreeValues,
          parentNodeIndex,
          nextParentValue,
        );
        tournamentTreeSourceIndices = setNullableValueAt(
          tournamentTreeSourceIndices,
          parentNodeIndex,
          nextParentSourceIndex ?? null,
        );

        framesList = appendFrame(
          framesList,
          createFrame({
            array: [...currentArray],
            activeIndices:
              barActiveIndices.length > 0 ? barActiveIndices : null,
            blueIndices: barBlueIndices,
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps },
            completed: false,
            description:
              nextParentValue === TOURNAMENT_INFINITY
                ? `Parent index ${parentNodeIndex} now resolves to infinity.`
                : `Parent index ${parentNodeIndex} now stores ${nextParentValue}.`,
            ...createTournamentVisualFields({
              treeValues: tournamentTreeValues,
              treeSourceIndices: tournamentTreeSourceIndices,
              treeActiveIndices: [leftChildIndex, rightChildIndex],
              treeBlueIndices: [parentNodeIndex],
              outputValues: tournamentOutputValues,
              outputActiveIndices: [sortedIndex],
              outputBlueIndices: [sortedIndex],
              outputSortedIndices: tournamentOutputSortedIndices,
            }),
          }),
        );

        currentNodeIndex = parentNodeIndex;
      }

      tournamentOutputSortedIndices = buildIndexRange(0, sortedIndex + 1);

      framesList = appendFrame(
        framesList,
        createFrame({
          array: [...currentArray],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [...tournamentOutputSortedIndices],
          stats: { comparisons, swaps },
          completed: false,
          description: `Sorted prefix now extends through index ${sortedIndex}.`,
          ...createTournamentVisualFields({
            treeValues: tournamentTreeValues,
            treeSourceIndices: tournamentTreeSourceIndices,
            outputValues: tournamentOutputValues,
            outputSortedIndices: tournamentOutputSortedIndices,
          }),
        }),
      );
    }

    return appendFrame(
      framesList,
      createFrame({
        array: [...currentArray],
        activeIndices: null,
        blueIndices: [],
        sortedIndices: buildIndexRange(0, currentArray.length),
        stats: { comparisons, swaps },
        completed: true,
        description: "Sorting completed!",
        ...createTournamentVisualFields({
          treeValues: tournamentTreeValues,
          treeSourceIndices: tournamentTreeSourceIndices,
          outputValues: tournamentOutputValues,
          outputSortedIndices: buildIndexRange(0, currentArray.length),
        }),
      }),
    );
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
        nextFrame?.activeIndices?.[1] ??
        nextFrame?.activeIndices?.[0] ??
        nextFrame?.blueIndices?.[0];

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
        title={metadata?.name || "Tournament Sort"}
        description={metadata?.description}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "bars" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bars")}
            >
              Bars
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tree")}
            >
              Tree
            </Button>
          </div>

          {viewMode === "bars" ? (
            <SortingVisualizer
              data={data}
              arraySize={arraySize}
              currentFrame={currentFrame}
              totalFrames={frames.length}
              onScrub={handleScrub}
            />
          ) : (
            <TournamentTreeVisualizer
              data={data}
              currentFrame={currentFrame}
              totalFrames={frames.length}
              onScrub={handleScrub}
            />
          )}
        </div>

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
