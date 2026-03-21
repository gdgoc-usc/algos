import {
  appendTournamentFrame,
  createTournamentVisualFrame,
  getBarIndicesFromTreeNodeIndices,
  getComparableTournamentValue,
  getTournamentParentIndex,
  TOURNAMENT_INFINITY,
} from "@/algorithms/sorting/tournament-sort/helpers";
import type { TournamentPhaseInput } from "@/algorithms/sorting/tournament-sort/runtime";
import {
  buildIndexRange,
  isNumber,
  setNullableValueAtIndex,
  swapIndices,
} from "@/algorithms/sorting/shared/utils";

export const extractTournamentPhase = ({
  framesList,
  state,
}: TournamentPhaseInput): TournamentPhaseInput => {
  let nextFramesList = framesList;
  let nextState = { ...state };

  for (
    let sortedIndex = 0;
    sortedIndex < nextState.currentArray.length;
    sortedIndex += 1
  ) {
    const sortedIndices = buildIndexRange(0, sortedIndex);
    const winnerValue = nextState.tournamentTreeValues[0];
    const winnerLeafNodeIndex = nextState.tournamentTreeSourceIndices[0];

    if (
      winnerValue === null ||
      winnerValue === TOURNAMENT_INFINITY ||
      winnerLeafNodeIndex === null ||
      winnerLeafNodeIndex === undefined
    ) {
      break;
    }

    const winnerArrayIndex = nextState.leafToArrayIndices[winnerLeafNodeIndex];
    const winnerBarIndices = isNumber(winnerArrayIndex)
      ? [winnerArrayIndex]
      : [];

    nextFramesList = appendTournamentFrame(
      nextFramesList,
      createTournamentVisualFrame(
        {
          array: [...nextState.currentArray],
          activeIndices: winnerBarIndices.length > 0 ? winnerBarIndices : null,
          blueIndices: winnerBarIndices,
          sortedIndices: [...sortedIndices],
          stats: {
            comparisons: nextState.comparisons,
            swaps: nextState.swaps,
          },
          completed: false,
          description: `${winnerValue} rises to the root as the next winner.`,
        },
        {
          treeValues: nextState.tournamentTreeValues,
          treeSourceIndices: nextState.tournamentTreeSourceIndices,
          treeBlueIndices: [0],
          outputValues: nextState.tournamentOutputValues,
          outputSortedIndices: nextState.tournamentOutputSortedIndices,
        },
      ),
    );

    nextState = {
      ...nextState,
      tournamentOutputValues: setNullableValueAtIndex(
        nextState.tournamentOutputValues,
        sortedIndex,
        winnerValue,
      ),
    };

    if (isNumber(winnerArrayIndex) && winnerArrayIndex !== sortedIndex) {
      const displacedValue = nextState.currentArray[sortedIndex];
      const displacedLeafNodeIndex = nextState.arrayToLeafIndices[sortedIndex];
      let nextLeafToArrayIndices = setNullableValueAtIndex(
        nextState.leafToArrayIndices,
        winnerLeafNodeIndex,
        null,
      );

      if (isNumber(displacedLeafNodeIndex)) {
        nextLeafToArrayIndices = setNullableValueAtIndex(
          nextLeafToArrayIndices,
          displacedLeafNodeIndex,
          winnerArrayIndex,
        );
      }

      let nextArrayToLeafIndices = setNullableValueAtIndex(
        nextState.arrayToLeafIndices,
        sortedIndex,
        null,
      );

      if (isNumber(displacedLeafNodeIndex)) {
        nextArrayToLeafIndices = setNullableValueAtIndex(
          nextArrayToLeafIndices,
          winnerArrayIndex,
          displacedLeafNodeIndex,
        );
      }

      nextState = {
        ...nextState,
        currentArray: swapIndices(
          nextState.currentArray,
          sortedIndex,
          winnerArrayIndex,
        ),
        leafToArrayIndices: nextLeafToArrayIndices,
        arrayToLeafIndices: nextArrayToLeafIndices,
        swaps: nextState.swaps + 1,
      };

      nextFramesList = appendTournamentFrame(
        nextFramesList,
        createTournamentVisualFrame(
          {
            array: [...nextState.currentArray],
            activeIndices: [sortedIndex, winnerArrayIndex],
            blueIndices: [sortedIndex],
            sortedIndices: [...sortedIndices],
            stats: {
              comparisons: nextState.comparisons,
              swaps: nextState.swaps,
            },
            completed: false,
            description: `Placed ${winnerValue} at index ${sortedIndex} by swapping with ${displacedValue}.`,
          },
          {
            treeValues: nextState.tournamentTreeValues,
            treeSourceIndices: nextState.tournamentTreeSourceIndices,
            treeBlueIndices: [0],
            outputValues: nextState.tournamentOutputValues,
            outputActiveIndices: [sortedIndex],
            outputBlueIndices: [sortedIndex],
            outputSortedIndices: nextState.tournamentOutputSortedIndices,
          },
        ),
      );
    } else {
      if (isNumber(winnerArrayIndex)) {
        nextState = {
          ...nextState,
          leafToArrayIndices: setNullableValueAtIndex(
            nextState.leafToArrayIndices,
            winnerLeafNodeIndex,
            null,
          ),
          arrayToLeafIndices: setNullableValueAtIndex(
            nextState.arrayToLeafIndices,
            sortedIndex,
            null,
          ),
        };
      }

      nextFramesList = appendTournamentFrame(
        nextFramesList,
        createTournamentVisualFrame(
          {
            array: [...nextState.currentArray],
            activeIndices: [sortedIndex],
            blueIndices: [sortedIndex],
            sortedIndices: [...sortedIndices],
            stats: {
              comparisons: nextState.comparisons,
              swaps: nextState.swaps,
            },
            completed: false,
            description: `${winnerValue} is already at the next sorted position.`,
          },
          {
            treeValues: nextState.tournamentTreeValues,
            treeSourceIndices: nextState.tournamentTreeSourceIndices,
            treeBlueIndices: [0],
            outputValues: nextState.tournamentOutputValues,
            outputActiveIndices: [sortedIndex],
            outputBlueIndices: [sortedIndex],
            outputSortedIndices: nextState.tournamentOutputSortedIndices,
          },
        ),
      );
    }

    nextState = {
      ...nextState,
      tournamentTreeValues: setNullableValueAtIndex(
        nextState.tournamentTreeValues,
        winnerLeafNodeIndex,
        TOURNAMENT_INFINITY,
      ),
    };

    nextFramesList = appendTournamentFrame(
      nextFramesList,
      createTournamentVisualFrame(
        {
          array: [...nextState.currentArray],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [...sortedIndices],
          stats: {
            comparisons: nextState.comparisons,
            swaps: nextState.swaps,
          },
          completed: false,
          description: `Set the winning leaf lane to infinity to remove ${winnerValue} from the tournament.`,
        },
        {
          treeValues: nextState.tournamentTreeValues,
          treeSourceIndices: nextState.tournamentTreeSourceIndices,
          treeActiveIndices: [winnerLeafNodeIndex],
          treeBlueIndices: [winnerLeafNodeIndex],
          outputValues: nextState.tournamentOutputValues,
          outputActiveIndices: [sortedIndex],
          outputBlueIndices: [sortedIndex],
          outputSortedIndices: nextState.tournamentOutputSortedIndices,
        },
      ),
    );

    let currentNodeIndex = winnerLeafNodeIndex;

    while (currentNodeIndex > 0) {
      const parentNodeIndex = getTournamentParentIndex(currentNodeIndex);
      const leftChildIndex = parentNodeIndex * 2 + 1;
      const rightChildIndex = parentNodeIndex * 2 + 2;
      const barActiveIndices = getBarIndicesFromTreeNodeIndices({
        treeNodeIndices: [leftChildIndex, rightChildIndex],
        treeSourceIndices: nextState.tournamentTreeSourceIndices,
        leafToArrayIndices: nextState.leafToArrayIndices,
      });

      nextState = {
        ...nextState,
        comparisons: nextState.comparisons + 1,
      };

      nextFramesList = appendTournamentFrame(
        nextFramesList,
        createTournamentVisualFrame(
          {
            array: [...nextState.currentArray],
            activeIndices:
              barActiveIndices.length > 0 ? barActiveIndices : null,
            blueIndices: [],
            sortedIndices: [...sortedIndices],
            stats: {
              comparisons: nextState.comparisons,
              swaps: nextState.swaps,
            },
            completed: false,
            description: `Retournamenting parent index ${parentNodeIndex} after removing the winner lane.`,
          },
          {
            treeValues: nextState.tournamentTreeValues,
            treeSourceIndices: nextState.tournamentTreeSourceIndices,
            treeActiveIndices: [leftChildIndex, rightChildIndex],
            outputValues: nextState.tournamentOutputValues,
            outputActiveIndices: [sortedIndex],
            outputBlueIndices: [sortedIndex],
            outputSortedIndices: nextState.tournamentOutputSortedIndices,
          },
        ),
      );

      const leftValue = getComparableTournamentValue(
        nextState.tournamentTreeValues[leftChildIndex],
      );
      const rightValue = getComparableTournamentValue(
        nextState.tournamentTreeValues[rightChildIndex],
      );
      const winnerChildIndex =
        leftValue <= rightValue ? leftChildIndex : rightChildIndex;
      const nextParentValue = nextState.tournamentTreeValues[winnerChildIndex];
      const nextParentSourceIndex =
        nextState.tournamentTreeSourceIndices[winnerChildIndex];
      const barBlueIndices = getBarIndicesFromTreeNodeIndices({
        treeNodeIndices: [winnerChildIndex],
        treeSourceIndices: nextState.tournamentTreeSourceIndices,
        leafToArrayIndices: nextState.leafToArrayIndices,
      });

      nextState = {
        ...nextState,
        tournamentTreeValues: setNullableValueAtIndex(
          nextState.tournamentTreeValues,
          parentNodeIndex,
          nextParentValue,
        ),
        tournamentTreeSourceIndices: setNullableValueAtIndex(
          nextState.tournamentTreeSourceIndices,
          parentNodeIndex,
          nextParentSourceIndex ?? null,
        ),
      };

      nextFramesList = appendTournamentFrame(
        nextFramesList,
        createTournamentVisualFrame(
          {
            array: [...nextState.currentArray],
            activeIndices:
              barActiveIndices.length > 0 ? barActiveIndices : null,
            blueIndices: barBlueIndices,
            sortedIndices: [...sortedIndices],
            stats: {
              comparisons: nextState.comparisons,
              swaps: nextState.swaps,
            },
            completed: false,
            description:
              nextParentValue === TOURNAMENT_INFINITY
                ? `Parent index ${parentNodeIndex} now resolves to infinity.`
                : `Parent index ${parentNodeIndex} now stores ${nextParentValue}.`,
          },
          {
            treeValues: nextState.tournamentTreeValues,
            treeSourceIndices: nextState.tournamentTreeSourceIndices,
            treeActiveIndices: [leftChildIndex, rightChildIndex],
            treeBlueIndices: [parentNodeIndex],
            outputValues: nextState.tournamentOutputValues,
            outputActiveIndices: [sortedIndex],
            outputBlueIndices: [sortedIndex],
            outputSortedIndices: nextState.tournamentOutputSortedIndices,
          },
        ),
      );

      currentNodeIndex = parentNodeIndex;
    }

    nextState = {
      ...nextState,
      tournamentOutputSortedIndices: buildIndexRange(0, sortedIndex + 1),
    };

    nextFramesList = appendTournamentFrame(
      nextFramesList,
      createTournamentVisualFrame(
        {
          array: [...nextState.currentArray],
          activeIndices: null,
          blueIndices: [],
          sortedIndices: [...nextState.tournamentOutputSortedIndices],
          stats: {
            comparisons: nextState.comparisons,
            swaps: nextState.swaps,
          },
          completed: false,
          description: `Sorted prefix now extends through index ${sortedIndex}.`,
        },
        {
          treeValues: nextState.tournamentTreeValues,
          treeSourceIndices: nextState.tournamentTreeSourceIndices,
          outputValues: nextState.tournamentOutputValues,
          outputSortedIndices: nextState.tournamentOutputSortedIndices,
        },
      ),
    );
  }

  return {
    framesList: nextFramesList,
    state: nextState,
  };
};
