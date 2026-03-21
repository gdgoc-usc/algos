export type SortingBucketGroup = {
  label: string;
  values: number[];
  rangeStart: number;
  rangeEnd: number;
  activeIndices?: number[];
  blueIndices?: number[];
  sortedIndices?: number[];
};

export type SortingStats = {
  comparisons: number;
  swaps: number;
};

export type SortingAnimationFrame = {
  array: number[];
  arrayLabel?: string;
  activeIndices: number[] | null;
  blueIndices?: number[];
  sortedIndices: number[];
  bucketGroups?: SortingBucketGroup[];
  bucketValues?: number[];
  bucketLabel?: string;
  bucketRangeStart?: number;
  bucketRangeEnd?: number;
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  bucketSortedIndices?: number[];
  outputValues?: number[];
  outputLabel?: string;
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices?: number[];
  tournamentTreeValues?: Array<number | null>;
  tournamentTreeSourceIndices?: Array<number | null>;
  tournamentTreeActiveIndices?: number[];
  tournamentTreeBlueIndices?: number[];
  tournamentOutputValues?: Array<number | null>;
  tournamentOutputActiveIndices?: number[];
  tournamentOutputBlueIndices?: number[];
  tournamentOutputSortedIndices?: number[];
  stats: SortingStats;
  completed: boolean;
  description: string;
};

export type SortingFrameGenerator = (size: number) => SortingAnimationFrame[];

export type SortingSoundSelector = (
  frame: SortingAnimationFrame | undefined,
) => number | undefined;

export type SortingAlgorithmDetails = {
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
};

export type SortingAlgorithmDefinition = {
  slug: string;
  details: SortingAlgorithmDetails;
  generateFrames: SortingFrameGenerator;
  getSoundValue?: SortingSoundSelector;
};
