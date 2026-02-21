import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ArrayBinaryTreeNode } from "@/components/algorithm/tree/types";

interface TreeNodePosition {
  x: number;
  y: number;
}

interface ArrayBinaryTreeCanvasProps {
  nodes: Array<ArrayBinaryTreeNode | null>;
  overlay?: ReactNode;
  maxVisibleNodes?: number;
  className?: string;
}

export const DEFAULT_MAX_VISIBLE_TREE_NODES = 31;

const getNodePosition = (
  index: number,
  maxDepth: number,
  visibleNodes: number,
): TreeNodePosition => {
  const safeDepth = Math.max(maxDepth, 1);
  const level = Math.floor(Math.log2(index + 1));
  const levelStart = 2 ** level - 1;
  const positionInLevel = index - levelStart;
  const nodesInLevel = 2 ** level;

  return {
    x: ((positionInLevel + 1) / (nodesInLevel + 1)) * 100,
    y: visibleNodes <= 1 ? 38 : ((level + 1) / (safeDepth + 1.8)) * 68,
  };
};

export function ArrayBinaryTreeCanvas({
  nodes,
  overlay,
  maxVisibleNodes = DEFAULT_MAX_VISIBLE_TREE_NODES,
  className,
}: ArrayBinaryTreeCanvasProps) {
  const visibleNodes = nodes.slice(0, maxVisibleNodes);
  const indexedNodes = visibleNodes
    .map((node, index) => ({ index, node }))
    .filter((entry): entry is { index: number; node: ArrayBinaryTreeNode } =>
      Boolean(entry.node),
    );

  const maxDepth = Math.floor(Math.log2(Math.max(visibleNodes.length, 1)));
  const positions = visibleNodes.map((_, index) =>
    getNodePosition(index, maxDepth, visibleNodes.length),
  );

  return (
    <div
      className={cn(
        "w-full glass rounded-xl p-4 lg:p-6 h-[50vh] min-h-[300px] lg:h-[650px] relative overflow-hidden",
        className,
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {indexedNodes.map(({ index }) => {
          const leftChildIndex = index * 2 + 1;
          const rightChildIndex = index * 2 + 2;
          const parentPosition = positions[index];
          const hasLeftChild = Boolean(visibleNodes[leftChildIndex]);
          const hasRightChild = Boolean(visibleNodes[rightChildIndex]);

          return (
            <g key={`edge-${index}`}>
              {hasLeftChild && (
                <line
                  x1={parentPosition.x}
                  y1={parentPosition.y}
                  x2={positions[leftChildIndex].x}
                  y2={positions[leftChildIndex].y}
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="0.35"
                />
              )}
              {hasRightChild && (
                <line
                  x1={parentPosition.x}
                  y1={parentPosition.y}
                  x2={positions[rightChildIndex].x}
                  y2={positions[rightChildIndex].y}
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="0.35"
                />
              )}
            </g>
          );
        })}
      </svg>

      {indexedNodes.map(({ index, node }) => {
        const position = positions[index];

        return (
          <div
            key={`node-${index}`}
            className={cn(
              "absolute z-10 -translate-x-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full text-[11px] lg:text-xs font-semibold text-white flex items-center justify-center transition-all duration-100 bg-gray-500/80",
              node.className,
            )}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={node.title}
          >
            {node.label}
          </div>
        );
      })}

      {overlay}
    </div>
  );
}
