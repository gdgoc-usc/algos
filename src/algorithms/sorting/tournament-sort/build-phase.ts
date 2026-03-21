import {
  appendTournamentFrame,
  createTournamentVisualFrame,
  getBarIndicesFromTreeNodeIndices,
  getComparableTournamentValue,
} from "@/algorithms/sorting/tournament-sort/helpers";
import type { TournamentPhaseInput } from "@/algorithms/sorting/tournament-sort/runtime";
import { setNullableValueAtIndex } from "@/algorithms/sorting/shared/utils";

export const buildTournamentPhase = ({
  framesList,
  state,
  leafStartIndex,
}: TournamentPhaseInput & {
  leafStartIndex: number;
}): TournamentPhaseInput => {
  let nextFramesList = framesList;
  let nextState = { ...state };

  for (
    let parentIndex = leafStartIndex - 1;
    parentIndex >= 0;
    parentIndex -= 1
  ) {
    const leftChildIndex = parentIndex * 2 + 1;
    const rightChildIndex = parentIndex * 2 + 2;
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
          activeIndices: barActiveIndices.length > 0 ? barActiveIndices : null,
          blueIndices: [],
          sortedIndices: [],
          stats: {
            comparisons: nextState.comparisons,
            swaps: nextState.swaps,
          },
          completed: false,
          description: `Comparing children of parent index ${parentIndex} while building the tournament bottom-up.`,
        },
        {
          treeValues: nextState.tournamentTreeValues,
          treeSourceIndices: nextState.tournamentTreeSourceIndices,
          treeActiveIndices: [leftChildIndex, rightChildIndex],
          outputValues: nextState.tournamentOutputValues,
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
    const winnerValue = nextState.tournamentTreeValues[winnerChildIndex];
    const winnerSourceIndex =
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
        parentIndex,
        winnerValue,
      ),
      tournamentTreeSourceIndices: setNullableValueAtIndex(
        nextState.tournamentTreeSourceIndices,
        parentIndex,
        winnerSourceIndex ?? null,
      ),
    };

    nextFramesList = appendTournamentFrame(
      nextFramesList,
      createTournamentVisualFrame(
        {
          array: [...nextState.currentArray],
          activeIndices: barActiveIndices.length > 0 ? barActiveIndices : null,
          blueIndices: barBlueIndices,
          sortedIndices: [],
          stats: {
            comparisons: nextState.comparisons,
            swaps: nextState.swaps,
          },
          completed: false,
          description: `${winnerValue} wins at parent index ${parentIndex}.`,
        },
        {
          treeValues: nextState.tournamentTreeValues,
          treeSourceIndices: nextState.tournamentTreeSourceIndices,
          treeActiveIndices: [leftChildIndex, rightChildIndex],
          treeBlueIndices: [parentIndex],
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
