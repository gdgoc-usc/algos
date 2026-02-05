export type SortingAnimationFrame = {
  array: number[];
  activeIndices: number[] | null;
  sortedIndices: number[];
  stats: { comparisons: number; swaps: number };
  completed: boolean;
  description: string;
};
