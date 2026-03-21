import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { SortingAnimationFrame } from "@/types/sorting";
import { ArrayBinaryTreeCanvas } from "@/components/algorithm/tree/ArrayBinaryTreeCanvas";
import { TreeArrayStrip } from "@/components/algorithm/tree/TreeArrayStrip";
import type { TreeArrayStripItem } from "@/components/algorithm/tree/types";

interface TournamentTreeVisualizerProps {
  data: SortingAnimationFrame;
  currentFrame: number;
  totalFrames: number;
  onScrub: (value: number[]) => void;
}

const OUTPUT_PLACEHOLDER = "·";
const TOURNAMENT_MAX_VISIBLE_TREE_NODES = 127;
const EMPTY_TREE_OR_OUTPUT_VALUES: Array<number | null> = [];
const EMPTY_INDICES: number[] = [];
const INFINITY_SYMBOL = "∞";

const formatTournamentValue = (value: number): number | string =>
  value === Number.POSITIVE_INFINITY ? INFINITY_SYMBOL : value;

const getTournamentValueTitle = (value: number): string =>
  value === Number.POSITIVE_INFINITY ? "infinity" : `${value}`;

const getPlaceholderNodeClassName = (): string =>
  "bg-transparent border border-dashed border-border/60 text-transparent shadow-none";

const getTreeNodeClassName = ({
  isBlue,
  isActive,
}: {
  isBlue: boolean;
  isActive: boolean;
}): string => {
  if (isBlue) {
    return "bg-blue-500/90 scale-105 shadow-[0_0_10px_rgba(59,130,246,0.45)]";
  }

  if (isActive) {
    return "bg-red-500/90 scale-105 shadow-[0_0_10px_rgba(239,68,68,0.45)]";
  }

  return "bg-gray-500/80";
};

const getOutputItemClassName = ({
  isSorted,
  isBlue,
  isActive,
}: {
  isSorted: boolean;
  isBlue: boolean;
  isActive: boolean;
}): string => {
  if (isSorted) {
    return "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-300";
  }

  if (isBlue) {
    return "border-blue-500/60 bg-blue-500/10 text-blue-700 dark:text-blue-300";
  }

  if (isActive) {
    return "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-300";
  }

  return "border-dashed border-border/70 bg-background/40 text-muted-foreground";
};

export function TournamentTreeVisualizer({
  data,
  currentFrame,
  totalFrames,
  onScrub,
}: TournamentTreeVisualizerProps) {
  const treeValues = data.tournamentTreeValues ?? [];
  const treeSourceIndices = data.tournamentTreeSourceIndices ?? [];
  const treeActiveIndices = data.tournamentTreeActiveIndices ?? EMPTY_INDICES;
  const treeBlueIndices = data.tournamentTreeBlueIndices ?? EMPTY_INDICES;
  const outputValues =
    data.tournamentOutputValues ?? EMPTY_TREE_OR_OUTPUT_VALUES;
  const outputSortedIndices =
    data.tournamentOutputSortedIndices ?? data.sortedIndices;
  const outputActiveIndices =
    data.tournamentOutputActiveIndices ?? EMPTY_INDICES;
  const outputBlueIndices = data.tournamentOutputBlueIndices ?? EMPTY_INDICES;

  const treeActiveIndexSet = useMemo(
    () => new Set<number>(treeActiveIndices),
    [treeActiveIndices],
  );
  const treeBlueIndexSet = useMemo(
    () => new Set<number>(treeBlueIndices),
    [treeBlueIndices],
  );
  const outputSortedIndexSet = useMemo(
    () => new Set<number>(outputSortedIndices),
    [outputSortedIndices],
  );
  const outputActiveIndexSet = useMemo(
    () => new Set<number>(outputActiveIndices),
    [outputActiveIndices],
  );
  const outputBlueIndexSet = useMemo(
    () => new Set<number>(outputBlueIndices),
    [outputBlueIndices],
  );
  const leafStartIndex = Math.floor(treeValues.length / 2);

  const treeNodes = treeValues.map((value, index) => {
    if (value === null) {
      if (index >= leafStartIndex) {
        return null;
      }

      return {
        label: "",
        title: `Tree node ${index}: pending winner`,
        className: getPlaceholderNodeClassName(),
      };
    }

    const sourceIndex = treeSourceIndices[index];

    return {
      label: formatTournamentValue(value),
      title:
        sourceIndex === null || sourceIndex === undefined
          ? `Tree node ${index}: ${getTournamentValueTitle(value)}`
          : `Tree node ${index}: ${getTournamentValueTitle(value)} from leaf lane ${sourceIndex}`,
      className: getTreeNodeClassName({
        isBlue: treeBlueIndexSet.has(index),
        isActive: treeActiveIndexSet.has(index),
      }),
    };
  });

  const auxiliaryItems: TreeArrayStripItem[] = treeValues.map(
    (value, index) => {
      const isBlue = treeBlueIndexSet.has(index);
      const isActive = treeActiveIndexSet.has(index);
      const sourceIndex = treeSourceIndices[index];
      const displayValue =
        value === null ? OUTPUT_PLACEHOLDER : formatTournamentValue(value);

      return {
        index,
        value: displayValue,
        title:
          value === null
            ? `Auxiliary index ${index}: empty`
            : sourceIndex === null || sourceIndex === undefined
              ? `Auxiliary index ${index}: ${getTournamentValueTitle(value)}`
              : `Auxiliary index ${index}: ${getTournamentValueTitle(value)} from leaf lane ${sourceIndex}`,
        className: getOutputItemClassName({
          isSorted: false,
          isBlue,
          isActive,
        }),
      };
    },
  );

  const outputItems: TreeArrayStripItem[] = outputValues.map((value, index) => {
    const isSorted = outputSortedIndexSet.has(index) || data.completed;
    const isBlue = outputBlueIndexSet.has(index);
    const isActive = outputActiveIndexSet.has(index);
    const displayValue = value === null ? OUTPUT_PLACEHOLDER : value;

    return {
      index,
      value: displayValue,
      title:
        value === null
          ? `Output index ${index}: pending`
          : `Output index ${index}: ${value}`,
      className: getOutputItemClassName({ isSorted, isBlue, isActive }),
    };
  });

  const extractedOutputCount = useMemo(
    () =>
      new Set<number>([
        ...outputSortedIndices,
        ...outputActiveIndices,
        ...outputBlueIndices,
      ]).size,
    [outputSortedIndices, outputActiveIndices, outputBlueIndices],
  );

  const hasVisibleTournament = treeNodes.some(Boolean);
  const remainingCount = Math.max(data.array.length - extractedOutputCount, 0);

  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="space-y-1">
          <span className="block text-sm font-medium leading-5 break-words min-h-10 max-h-10 overflow-hidden sm:min-h-0 sm:max-h-none">
            {data.description}
          </span>
          <span className="text-xs text-muted-foreground">
            Remaining contestants: {remainingCount} | Output size:{" "}
            {extractedOutputCount}
          </span>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          Step {currentFrame + 1} / {totalFrames}
        </Badge>
      </div>

      <ArrayBinaryTreeCanvas
        nodes={treeNodes}
        maxVisibleNodes={TOURNAMENT_MAX_VISIBLE_TREE_NODES}
        nodeMaxYPercent={54}
        overlay={
          <div className="absolute inset-x-3 bottom-3 z-20 space-y-2 rounded-lg border border-border/60 bg-background/80 px-2 py-2 backdrop-blur-sm">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                Auxiliary Heap Array ({treeValues.length})
              </div>
              <TreeArrayStrip items={auxiliaryItems} />
            </div>
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                Output Array
              </div>
              <TreeArrayStrip items={outputItems} />
            </div>
          </div>
        }
      />

      {!hasVisibleTournament && (
        <p className="text-xs text-muted-foreground px-1">
          Tournament complete. All values have moved into the output array.
        </p>
      )}

      {treeNodes.length > TOURNAMENT_MAX_VISIBLE_TREE_NODES && (
        <p className="text-xs text-muted-foreground px-1">
          Showing first {TOURNAMENT_MAX_VISIBLE_TREE_NODES} nodes for
          readability. Reduce the array size to inspect the full tournament
          tree.
        </p>
      )}

      <div className="px-2">
        <Slider
          value={[currentFrame]}
          onValueChange={onScrub}
          min={0}
          max={Math.max(totalFrames - 1, 1)}
          step={1}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
