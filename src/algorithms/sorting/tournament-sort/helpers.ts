import { isNumber } from "@/algorithms/sorting/shared/utils";
import type { SortingAnimationFrame } from "@/types/sorting";

export const TOURNAMENT_INFINITY = Number.POSITIVE_INFINITY;

export type TournamentTreeState = {
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

export const appendTournamentFrame = (
  frames: SortingAnimationFrame[],
  frame: SortingAnimationFrame,
): SortingAnimationFrame[] => [...frames, frame];

export const getTournamentParentIndex = (nodeIndex: number): number =>
  Math.floor((nodeIndex - 1) / 2);

export const getComparableTournamentValue = (value: number | null): number =>
  value === null ? TOURNAMENT_INFINITY : value;

export const buildTournamentTreeState = (
  values: number[],
): TournamentTreeState => {
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

export const createLeafToArrayIndices = (
  itemCount: number,
  leafStartIndex: number,
): Array<number | null> =>
  Array.from({ length: itemCount * 2 - 1 }, (_, index) => {
    if (index < leafStartIndex) {
      return null;
    }

    return index - leafStartIndex;
  });

export const createArrayToLeafIndices = (
  itemCount: number,
  leafStartIndex: number,
): Array<number | null> =>
  Array.from({ length: itemCount }, (_, index) => index + leafStartIndex);

export const getBarIndicesFromTreeNodeIndices = ({
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

export const createTournamentFrame = ({
  completed = false,
  ...frame
}: SortingAnimationFrame): SortingAnimationFrame => ({
  ...frame,
  completed,
});

export const createTournamentVisualFrame = (
  frame: SortingAnimationFrame,
  visualFields: Parameters<typeof createTournamentVisualFields>[0],
): SortingAnimationFrame =>
  createTournamentFrame({
    ...frame,
    ...createTournamentVisualFields(visualFields),
  });
