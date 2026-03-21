import {
  appendValue,
  buildSortedIndices,
  createRandomArray,
  removeValueAt,
} from "@/algorithms/sorting/shared/utils";
import type {
  SortingAlgorithmDefinition,
  SortingAnimationFrame,
  SortingStats,
} from "@/types/sorting";

const details = {
  timeComplexity: "Best O(n), average O(n²), worst O(n²)",
  spaceComplexity: "O(n)",
  description:
    "Strand Sort repeatedly extracts non-decreasing strands from the remaining input, then stably merges each strand into an accumulated sorted output.",
};

type StrandFrameOptions = {
  remainingInput: number[];
  currentStrand?: number[];
  mergedOutput?: number[];
  activeIndices?: number[] | null;
  blueIndices?: number[];
  strandActiveIndices?: number[];
  strandBlueIndices?: number[];
  outputActiveIndices?: number[];
  outputBlueIndices?: number[];
  outputSortedIndices?: number[];
  stats: SortingStats;
  description: string;
  completed?: boolean;
};

const buildSettledOutputIndices = (size: number): number[] =>
  buildSortedIndices(Math.max(size, 0));

const createFrame = ({
  remainingInput,
  currentStrand = [],
  mergedOutput = [],
  activeIndices = null,
  blueIndices = [],
  strandActiveIndices = [],
  strandBlueIndices = [],
  outputActiveIndices = [],
  outputBlueIndices = [],
  outputSortedIndices = buildSortedIndices(mergedOutput.length),
  stats,
  description,
  completed = false,
}: StrandFrameOptions): SortingAnimationFrame => ({
  array: [...remainingInput],
  arrayLabel: "Remaining Input",
  activeIndices,
  blueIndices,
  sortedIndices: [],
  bucketValues: [...currentStrand],
  bucketLabel: "Current Strand",
  bucketActiveIndices: [...strandActiveIndices],
  bucketBlueIndices: [...strandBlueIndices],
  outputValues: [...mergedOutput],
  outputLabel: "Merged Output",
  outputActiveIndices: [...outputActiveIndices],
  outputBlueIndices: [...outputBlueIndices],
  outputSortedIndices: [...outputSortedIndices],
  stats: { ...stats },
  completed,
  description,
});

const getVisibleOutput = ({
  builtOutput,
  accumulatedOutput,
  outputSourceIndex,
}: {
  builtOutput: number[];
  accumulatedOutput: number[];
  outputSourceIndex: number;
}): number[] => [...builtOutput, ...accumulatedOutput.slice(outputSourceIndex)];

const getSoundValue = (
  frame: SortingAnimationFrame | undefined,
): number | undefined => {
  if (!frame) {
    return undefined;
  }

  const outputIndex =
    frame.outputBlueIndices?.[0] ?? frame.outputActiveIndices?.[0];
  if (outputIndex !== undefined && frame.outputValues) {
    return frame.outputValues[outputIndex];
  }

  const strandIndex =
    frame.bucketBlueIndices?.[0] ?? frame.bucketActiveIndices?.[0];
  if (strandIndex !== undefined && frame.bucketValues) {
    return frame.bucketValues[strandIndex];
  }

  const inputIndex = frame.blueIndices?.[0] ?? frame.activeIndices?.[0];
  return inputIndex !== undefined ? frame.array[inputIndex] : undefined;
};

const generateFrames = (size: number): SortingAnimationFrame[] => {
  const initialArray = createRandomArray(size);
  const framesList: SortingAnimationFrame[] = [
    createFrame({
      remainingInput: initialArray,
      stats: { comparisons: 0, swaps: 0 },
      description: "Starting Strand Sort initialized with random values.",
    }),
  ];

  if (initialArray.length === 0) {
    return [
      ...framesList,
      createFrame({
        remainingInput: [],
        stats: { comparisons: 0, swaps: 0 },
        description: "Sorting completed!",
        completed: true,
      }),
    ];
  }

  let remainingInput = [...initialArray];
  let accumulatedOutput: number[] = [];
  let comparisons = 0;
  let swaps = 0;
  let strandNumber = 1;

  while (remainingInput.length > 0) {
    let currentStrand: number[] = [];
    let visibleInput = [...remainingInput];
    let scanIndex = 0;

    framesList.push(
      createFrame({
        remainingInput: visibleInput,
        mergedOutput: accumulatedOutput,
        stats: { comparisons, swaps },
        description: `Extracting strand ${strandNumber} from ${visibleInput.length} remaining values.`,
      }),
    );

    while (scanIndex < visibleInput.length) {
      const candidate = visibleInput[scanIndex];

      if (currentStrand.length === 0) {
        currentStrand = appendValue(currentStrand, candidate);
        visibleInput = removeValueAt(visibleInput, scanIndex);
        swaps += 1;

        framesList.push(
          createFrame({
            remainingInput: visibleInput,
            currentStrand,
            mergedOutput: accumulatedOutput,
            strandBlueIndices: [currentStrand.length - 1],
            stats: { comparisons, swaps },
            description: `Started strand ${strandNumber} with ${candidate}.`,
          }),
        );
        continue;
      }

      const lastStrandValue = currentStrand[currentStrand.length - 1];
      comparisons += 1;

      framesList.push(
        createFrame({
          remainingInput: visibleInput,
          currentStrand,
          mergedOutput: accumulatedOutput,
          activeIndices: [scanIndex],
          strandBlueIndices: [currentStrand.length - 1],
          stats: { comparisons, swaps },
          description: `Comparing ${candidate} with the strand tail ${lastStrandValue}.`,
        }),
      );

      if (candidate >= lastStrandValue) {
        currentStrand = appendValue(currentStrand, candidate);
        visibleInput = removeValueAt(visibleInput, scanIndex);
        swaps += 1;

        framesList.push(
          createFrame({
            remainingInput: visibleInput,
            currentStrand,
            mergedOutput: accumulatedOutput,
            strandBlueIndices: [currentStrand.length - 1],
            stats: { comparisons, swaps },
            description: `${candidate} extends the strand, so it moves out of the remaining input.`,
          }),
        );
        continue;
      }

      framesList.push(
        createFrame({
          remainingInput: visibleInput,
          currentStrand,
          mergedOutput: accumulatedOutput,
          blueIndices: [scanIndex],
          stats: { comparisons, swaps },
          description: `${candidate} is smaller than ${lastStrandValue}, so it stays for a later strand.`,
        }),
      );

      scanIndex += 1;
    }

    remainingInput = [...visibleInput];

    framesList.push(
      createFrame({
        remainingInput,
        currentStrand,
        mergedOutput: accumulatedOutput,
        stats: { comparisons, swaps },
        description: `Strand ${strandNumber} extracted. Merging it into the accumulated output.`,
      }),
    );

    let rebuiltOutput: number[] = [];
    let outputSourceIndex = 0;
    let strandSourceIndex = 0;

    while (
      outputSourceIndex < accumulatedOutput.length &&
      strandSourceIndex < currentStrand.length
    ) {
      const outputCandidate = accumulatedOutput[outputSourceIndex];
      const strandCandidate = currentStrand[strandSourceIndex];
      const visibleStrand = currentStrand.slice(strandSourceIndex);
      const visibleOutput = getVisibleOutput({
        builtOutput: rebuiltOutput,
        accumulatedOutput,
        outputSourceIndex,
      });
      comparisons += 1;

      framesList.push(
        createFrame({
          remainingInput,
          currentStrand: visibleStrand,
          mergedOutput: visibleOutput,
          strandBlueIndices: [0],
          outputActiveIndices: [rebuiltOutput.length],
          outputSortedIndices: buildSettledOutputIndices(rebuiltOutput.length),
          stats: { comparisons, swaps },
          description: `Merging compares output value ${outputCandidate} with strand value ${strandCandidate}.`,
        }),
      );

      if (outputCandidate <= strandCandidate) {
        rebuiltOutput = appendValue(rebuiltOutput, outputCandidate);
        outputSourceIndex += 1;
        swaps += 1;

        framesList.push(
          createFrame({
            remainingInput,
            currentStrand: visibleStrand,
            mergedOutput: getVisibleOutput({
              builtOutput: rebuiltOutput,
              accumulatedOutput,
              outputSourceIndex,
            }),
            strandBlueIndices: [0],
            outputBlueIndices: [rebuiltOutput.length - 1],
            outputSortedIndices: buildSettledOutputIndices(
              rebuiltOutput.length - 1,
            ),
            stats: { comparisons, swaps },
            description: `${outputCandidate} stays ahead to preserve stable ordering.`,
          }),
        );
        continue;
      }

      rebuiltOutput = appendValue(rebuiltOutput, strandCandidate);
      strandSourceIndex += 1;
      swaps += 1;

      framesList.push(
        createFrame({
          remainingInput,
          currentStrand: currentStrand.slice(strandSourceIndex),
          mergedOutput: getVisibleOutput({
            builtOutput: rebuiltOutput,
            accumulatedOutput,
            outputSourceIndex,
          }),
          outputBlueIndices: [rebuiltOutput.length - 1],
          outputSortedIndices: buildSettledOutputIndices(
            rebuiltOutput.length - 1,
          ),
          stats: { comparisons, swaps },
          description: `${strandCandidate} is smaller, so it is written next into the merged output.`,
        }),
      );
    }

    while (outputSourceIndex < accumulatedOutput.length) {
      const outputCandidate = accumulatedOutput[outputSourceIndex];
      rebuiltOutput = appendValue(rebuiltOutput, outputCandidate);
      outputSourceIndex += 1;
      swaps += 1;

      framesList.push(
        createFrame({
          remainingInput,
          currentStrand: currentStrand.slice(strandSourceIndex),
          mergedOutput: getVisibleOutput({
            builtOutput: rebuiltOutput,
            accumulatedOutput,
            outputSourceIndex,
          }),
          outputBlueIndices: [rebuiltOutput.length - 1],
          outputSortedIndices: buildSettledOutputIndices(
            rebuiltOutput.length - 1,
          ),
          stats: { comparisons, swaps },
          description: `Copied remaining output value ${outputCandidate} into the rebuilt merge.`,
        }),
      );
    }

    while (strandSourceIndex < currentStrand.length) {
      const strandCandidate = currentStrand[strandSourceIndex];
      rebuiltOutput = appendValue(rebuiltOutput, strandCandidate);
      strandSourceIndex += 1;
      swaps += 1;

      framesList.push(
        createFrame({
          remainingInput,
          currentStrand: currentStrand.slice(strandSourceIndex),
          mergedOutput: [...rebuiltOutput],
          outputBlueIndices: [rebuiltOutput.length - 1],
          outputSortedIndices: buildSettledOutputIndices(
            rebuiltOutput.length - 1,
          ),
          stats: { comparisons, swaps },
          description: `Copied remaining strand value ${strandCandidate} into the merged output.`,
        }),
      );
    }

    accumulatedOutput = [...rebuiltOutput];

    framesList.push(
      createFrame({
        remainingInput,
        mergedOutput: accumulatedOutput,
        outputSortedIndices: buildSortedIndices(accumulatedOutput.length),
        stats: { comparisons, swaps },
        description: `Merged strand ${strandNumber}. ${remainingInput.length} values remain in the input.`,
      }),
    );

    strandNumber += 1;
  }

  framesList.push(
    createFrame({
      remainingInput: [],
      mergedOutput: accumulatedOutput,
      outputSortedIndices: buildSortedIndices(accumulatedOutput.length),
      stats: { comparisons, swaps },
      description: "Sorting completed!",
      completed: true,
    }),
  );

  return framesList;
};

export const strandSortDefinition: SortingAlgorithmDefinition = {
  slug: "strand-sort",
  details,
  generateFrames,
  getSoundValue,
};
