import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { SortingAnimationFrame } from "@/types/sorting";
import {
  ArrayBinaryTreeCanvas,
  DEFAULT_MAX_VISIBLE_TREE_NODES,
  TreeArrayStrip,
  type ArrayBinaryTreeNode,
  type TreeArrayStripItem,
} from "@/components/algorithm/tree";

interface HeapTreeVisualizerProps {
  data: SortingAnimationFrame;
  currentFrame: number;
  totalFrames: number;
  onScrub: (value: number[]) => void;
}

const getTreeNodeClassName = (
  isCompleted: boolean,
  isSorted: boolean,
  isBlue: boolean,
  isActive: boolean,
): string => {
  if (isCompleted || isSorted) {
    return "bg-green-500/90";
  }

  if (isBlue) {
    return "bg-blue-500/90 scale-105 shadow-[0_0_10px_rgba(59,130,246,0.45)]";
  }

  if (isActive) {
    return "bg-red-500/90 scale-105 shadow-[0_0_10px_rgba(239,68,68,0.45)]";
  }

  return "bg-gray-500/80";
};

const getStripItemClassName = (
  isSorted: boolean,
  isBlue: boolean,
  isActive: boolean,
): string => {
  if (isSorted) {
    return "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-300";
  }

  if (isBlue) {
    return "border-blue-500/60 bg-blue-500/10 text-blue-700 dark:text-blue-300";
  }

  if (isActive) {
    return "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-300";
  }

  return "border-border bg-background/50 text-foreground";
};

export function HeapTreeVisualizer({
  data,
  currentFrame,
  totalFrames,
  onScrub,
}: HeapTreeVisualizerProps) {
  const treeNodes: ArrayBinaryTreeNode[] = data.array.map((value, index) => {
    const isSorted = data.sortedIndices.includes(index);
    const isActive = data.activeIndices?.includes(index) ?? false;
    const isBlue = data.blueIndices?.includes(index) ?? false;

    return {
      label: value,
      title: `Index ${index}: ${value}`,
      className: getTreeNodeClassName(
        data.completed,
        isSorted,
        isBlue,
        isActive,
      ),
    };
  });

  const stripItems: TreeArrayStripItem[] = data.array.map((value, index) => {
    const isSorted = data.sortedIndices.includes(index);
    const isActive = data.activeIndices?.includes(index) ?? false;
    const isBlue = data.blueIndices?.includes(index) ?? false;

    return {
      index,
      value,
      title: `Index ${index}: ${value}`,
      className: getStripItemClassName(isSorted, isBlue, isActive),
    };
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <span className="text-sm font-medium leading-5 break-words min-h-10 max-h-10 overflow-hidden sm:min-h-0 sm:max-h-none">
          {data.description}
        </span>
        <Badge variant="secondary" className="font-mono text-xs">
          Step {currentFrame + 1} / {totalFrames}
        </Badge>
      </div>

      <ArrayBinaryTreeCanvas
        nodes={treeNodes}
        overlay={
          <div className="absolute inset-x-3 bottom-3 z-20 rounded-lg border border-border/60 bg-background/80 px-2 py-2 backdrop-blur-sm">
            <TreeArrayStrip items={stripItems} />
          </div>
        }
      />

      {data.array.length > DEFAULT_MAX_VISIBLE_TREE_NODES && (
        <p className="text-xs text-muted-foreground px-1">
          Showing first {DEFAULT_MAX_VISIBLE_TREE_NODES} nodes for readability.
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
