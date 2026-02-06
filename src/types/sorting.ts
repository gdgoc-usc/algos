export type SortingAnimationFrame = {
  array: number[];
  activeIndices: number[] | null;
  blueIndices?: number[];
  sortedIndices: number[];
  stats: { comparisons: number; swaps: number };
  completed: boolean;
  description: string;
};
