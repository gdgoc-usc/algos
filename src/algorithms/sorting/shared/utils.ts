export const DEFAULT_RANDOM_MIN_VALUE = 10;
export const DEFAULT_RANDOM_MAX_VALUE = 100;

export const createRandomArray = (
  size: number,
  minValue = DEFAULT_RANDOM_MIN_VALUE,
  maxValue = DEFAULT_RANDOM_MAX_VALUE,
): number[] =>
  Array.from(
    { length: size },
    () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  );

export const buildSortedIndices = (size: number): number[] =>
  Array.from({ length: size }, (_, index) => index);

export const buildIndexRange = (
  startIndex: number,
  endIndex: number,
): number[] =>
  Array.from(
    { length: Math.max(endIndex - startIndex, 0) },
    (_, offset) => startIndex + offset,
  );

export const createZeroArray = (size: number): number[] =>
  Array.from({ length: size }, () => 0);

export const createNullNumberArray = (size: number): Array<number | null> =>
  Array.from({ length: size }, () => null);

export const appendValue = (values: number[], nextValue: number): number[] => [
  ...values,
  nextValue,
];

export const removeValueAt = (
  values: number[],
  indexToRemove: number,
): number[] => values.filter((_, index) => index !== indexToRemove);

export const insertValueAt = (
  values: number[],
  insertionIndex: number,
  nextValue: number,
): number[] => [
  ...values.slice(0, insertionIndex),
  nextValue,
  ...values.slice(insertionIndex),
];

export const setValueAtIndex = (
  values: number[],
  indexToSet: number,
  nextValue: number,
): number[] =>
  values.map((value, index) => (index === indexToSet ? nextValue : value));

export const setNullableValueAtIndex = (
  values: Array<number | null>,
  indexToSet: number,
  nextValue: number | null,
): Array<number | null> =>
  values.map((value, index) => (index === indexToSet ? nextValue : value));

export const incrementValueAtIndex = (
  values: number[],
  indexToIncrement: number,
): number[] =>
  values.map((value, index) =>
    index === indexToIncrement ? value + 1 : value,
  );

export const decrementValueAtIndex = (
  values: number[],
  indexToDecrement: number,
): number[] =>
  values.map((value, index) =>
    index === indexToDecrement ? value - 1 : value,
  );

export const swapIndices = (
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

export const addUniqueIndex = (
  indices: number[],
  nextIndex: number,
): number[] =>
  indices.includes(nextIndex) ? indices : [...indices, nextIndex];

export const replaceBucketAtIndex = (
  buckets: number[][],
  indexToReplace: number,
  nextBucket: number[],
): number[][] =>
  buckets.map((bucket, bucketIndex) =>
    bucketIndex === indexToReplace ? [...nextBucket] : [...bucket],
  );

export const isNumber = (value: number | null | undefined): value is number =>
  value !== null && value !== undefined;
