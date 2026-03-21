import {
  buildIndexRange,
  createNullNumberArray,
  createRandomArray,
} from "@/algorithms/sorting/shared/utils";
import {
  appendTournamentFrame,
  buildTournamentTreeState,
  createArrayToLeafIndices,
  createLeafToArrayIndices,
  createTournamentVisualFrame,
} from "@/algorithms/sorting/tournament-sort/helpers";
import { buildTournamentPhase } from "@/algorithms/sorting/tournament-sort/build-phase";
import { extractTournamentPhase } from "@/algorithms/sorting/tournament-sort/extract-phase";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best/Average/Worst O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "Tournament Sort stores the input at the leaves of an auxiliary heap array, builds winners bottom-up, then extracts the root winner by setting its leaf to infinity and retournamenting only the affected path.",
};

const getSoundValue = (
  frame: SortingAnimationFrame | undefined,
): number | undefined => {
  const activeIndex =
    frame?.activeIndices?.[1] ??
    frame?.activeIndices?.[0] ??
    frame?.blueIndices?.[0];

  return activeIndex !== undefined ? frame?.array[activeIndex] : undefined;
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const initialTournamentState = buildTournamentTreeState(initialArray);
  let tournamentOutputValues = createNullNumberArray(initialArray.length);
  let tournamentOutputSortedIndices: number[] = [];
  let framesList: SortingAnimationFrame[] = [
    createTournamentVisualFrame(
      {
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
      },
      {
        treeValues: initialTournamentState.treeValues,
        treeSourceIndices: initialTournamentState.treeSourceIndices,
        outputValues: tournamentOutputValues,
        outputSortedIndices: tournamentOutputSortedIndices,
      },
    ),
  ];

  if (initialArray.length === 0) {
    return appendTournamentFrame(
      framesList,
      createTournamentVisualFrame(
        {
          array: [],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [],
          stats: { comparisons: 0, swaps: 0 },
          completed: true,
          description: "Sorting completed!",
        },
        {
          treeValues: [],
          treeSourceIndices: [],
          outputValues: [],
          outputSortedIndices: [],
        },
      ),
    );
  }

  if (initialArray.length === 1) {
    tournamentOutputValues = [initialArray[0]];
    tournamentOutputSortedIndices = [0];

    return appendTournamentFrame(
      framesList,
      createTournamentVisualFrame(
        {
          array: [...initialArray],
          activeIndices: [0],
          blueIndices: [0],
          sortedIndices: [0],
          stats: { comparisons: 0, swaps: 0 },
          completed: true,
          description: "Single value detected. Sorting completed!",
        },
        {
          treeValues: initialTournamentState.treeValues,
          treeSourceIndices: initialTournamentState.treeSourceIndices,
          treeBlueIndices: [0],
          outputValues: tournamentOutputValues,
          outputActiveIndices: [0],
          outputBlueIndices: [0],
          outputSortedIndices: tournamentOutputSortedIndices,
        },
      ),
    );
  }

  const runtimeState = {
    currentArray: [...initialArray],
    tournamentTreeValues: [...initialTournamentState.treeValues],
    tournamentTreeSourceIndices: [...initialTournamentState.treeSourceIndices],
    leafToArrayIndices: createLeafToArrayIndices(
      initialArray.length,
      initialTournamentState.leafStartIndex,
    ),
    arrayToLeafIndices: createArrayToLeafIndices(
      initialArray.length,
      initialTournamentState.leafStartIndex,
    ),
    tournamentOutputValues,
    tournamentOutputSortedIndices,
    comparisons: 0,
    swaps: 0,
  };

  const buildPhase = buildTournamentPhase({
    framesList,
    state: runtimeState,
    leafStartIndex: initialTournamentState.leafStartIndex,
  });
  const extractionPhase = extractTournamentPhase(buildPhase);

  framesList = extractionPhase.framesList;

  return appendTournamentFrame(
    framesList,
    createTournamentVisualFrame(
      {
        array: [...extractionPhase.state.currentArray],
        activeIndices: null,
        blueIndices: [],
        sortedIndices: buildIndexRange(
          0,
          extractionPhase.state.currentArray.length,
        ),
        stats: {
          comparisons: extractionPhase.state.comparisons,
          swaps: extractionPhase.state.swaps,
        },
        completed: true,
        description: "Sorting completed!",
      },
      {
        treeValues: extractionPhase.state.tournamentTreeValues,
        treeSourceIndices: extractionPhase.state.tournamentTreeSourceIndices,
        outputValues: extractionPhase.state.tournamentOutputValues,
        outputSortedIndices: buildIndexRange(
          0,
          extractionPhase.state.currentArray.length,
        ),
      },
    ),
  );
};

export const tournamentSortDefinition: SortingAlgorithmDefinition = {
  slug: "tournament-sort",
  details,
  generateFrames,
  getSoundValue,
};
