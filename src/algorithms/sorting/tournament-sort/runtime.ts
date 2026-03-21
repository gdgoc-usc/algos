import type { SortingAnimationFrame } from "@/types/sorting";

export type TournamentRuntimeState = {
  currentArray: number[];
  tournamentTreeValues: Array<number | null>;
  tournamentTreeSourceIndices: Array<number | null>;
  leafToArrayIndices: Array<number | null>;
  arrayToLeafIndices: Array<number | null>;
  tournamentOutputValues: Array<number | null>;
  tournamentOutputSortedIndices: number[];
  comparisons: number;
  swaps: number;
};

export type TournamentPhaseInput = {
  framesList: SortingAnimationFrame[];
  state: TournamentRuntimeState;
};
