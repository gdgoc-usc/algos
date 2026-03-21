import { buildSortedIndices } from "@/algorithms/sorting/shared/utils";
import type {
  SortingAnimationFrame,
  SortingBucketGroup,
  SortingStats,
} from "@/types/sorting";

export type BucketRange = {
  label: string;
  rangeStart: number;
  rangeEnd: number;
};

export type BucketFrameOptions = {
  array: number[];
  bucketValues: number[][];
  bucketRanges: BucketRange[];
  outputValues?: number[];
  activeIndices?: number[] | null;
  blueIndices?: number[];
  activeBucketIndex?: number;
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  bucketSortedIndices?: number[];
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices?: number[];
  stats: SortingStats;
  description: string;
  completed?: boolean;
};

export const createEmptyBuckets = (bucketCount: number): number[][] =>
  Array.from({ length: bucketCount }, () => []);

export const buildSortedIndicesWithout = (
  size: number,
  excludedIndex?: number,
): number[] =>
  buildSortedIndices(size).filter((index) => index !== excludedIndex);

export const createBucketRanges = ({
  bucketCount,
  minValue,
  maxValue,
  bucketWidth,
}: {
  bucketCount: number;
  minValue: number;
  maxValue: number;
  bucketWidth: number;
}): BucketRange[] =>
  Array.from({ length: bucketCount }, (_, bucketIndex) => {
    const rangeStart = minValue + bucketIndex * bucketWidth;
    const rangeEnd =
      bucketIndex === bucketCount - 1
        ? maxValue
        : Math.min(maxValue, rangeStart + bucketWidth - 1);

    return {
      label: `b${bucketIndex}`,
      rangeStart,
      rangeEnd,
    };
  });

const createBucketGroups = ({
  bucketValues,
  bucketRanges,
  activeBucketIndex,
  bucketActiveIndices = [],
  bucketBlueIndices = [],
  bucketSortedIndices = [],
}: {
  bucketValues: number[][];
  bucketRanges: BucketRange[];
  activeBucketIndex?: number;
  bucketActiveIndices?: number[];
  bucketBlueIndices?: number[];
  bucketSortedIndices?: number[];
}): SortingBucketGroup[] =>
  bucketRanges.map((bucketRange, bucketIndex) => ({
    label: bucketRange.label,
    values: [...(bucketValues[bucketIndex] || [])],
    rangeStart: bucketRange.rangeStart,
    rangeEnd: bucketRange.rangeEnd,
    activeIndices:
      bucketIndex === activeBucketIndex ? [...bucketActiveIndices] : [],
    blueIndices:
      bucketIndex === activeBucketIndex ? [...bucketBlueIndices] : [],
    sortedIndices:
      bucketIndex === activeBucketIndex ? [...bucketSortedIndices] : [],
  }));

export const createBucketFrame = ({
  array,
  bucketValues,
  bucketRanges,
  outputValues = [],
  activeIndices = null,
  blueIndices = [],
  activeBucketIndex,
  bucketActiveIndices = [],
  bucketBlueIndices = [],
  bucketSortedIndices = [],
  outputActiveIndices = [],
  outputBlueIndices = [],
  outputSortedIndices = buildSortedIndices(outputValues.length),
  stats,
  description,
  completed = false,
}: BucketFrameOptions): SortingAnimationFrame => ({
  array: [...array],
  arrayLabel: "Input",
  activeIndices,
  blueIndices,
  sortedIndices: [],
  bucketGroups: createBucketGroups({
    bucketValues,
    bucketRanges,
    activeBucketIndex,
    bucketActiveIndices,
    bucketBlueIndices,
    bucketSortedIndices,
  }),
  outputValues: [...outputValues],
  outputLabel: "Output",
  outputActiveIndices: [...outputActiveIndices],
  outputBlueIndices: [...outputBlueIndices],
  outputSortedIndices: [...outputSortedIndices],
  stats: { ...stats },
  completed,
  description,
});

export const getBucketIndex = ({
  value,
  minValue,
  bucketCount,
  bucketWidth,
}: {
  value: number;
  minValue: number;
  bucketCount: number;
  bucketWidth: number;
}): number =>
  Math.min(bucketCount - 1, Math.floor((value - minValue) / bucketWidth));

export const getBucketFormulaDescription = ({
  value,
  minValue,
  bucketWidth,
  bucketCount,
  bucketIndex,
}: {
  value: number;
  minValue: number;
  bucketWidth: number;
  bucketCount: number;
  bucketIndex: number;
}): string =>
  `min(${bucketCount - 1}, floor((${value} - ${minValue}) / ${bucketWidth})) = ${bucketIndex}`;

export const getBucketName = (bucketIndex: number): string => `b${bucketIndex}`;
