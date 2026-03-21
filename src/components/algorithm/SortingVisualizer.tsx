import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  SortingAnimationFrame,
  SortingBucketGroup,
} from "@/types/sorting";

interface SortingVisualizerProps {
  data: SortingAnimationFrame;
  arraySize: number[];
  currentFrame: number;
  totalFrames: number;
  onScrub: (value: number[]) => void;
}

type VisualizationLevel = {
  key: string;
  label: string;
  values: number[];
  rangeStart?: number;
  rangeEnd?: number;
  activeIndices?: number[] | null;
  blueIndices?: number[];
  sortedIndices?: number[];
  tooltipKind?: "value" | "countBucket";
};

const getGapClassName = (itemCount: number): string => {
  if (itemCount > 60) {
    return "gap-px";
  }

  if (itemCount > 30) {
    return "gap-px";
  }

  return "gap-1";
};

const isCountBucketLevel = (level: VisualizationLevel): boolean =>
  level.tooltipKind === "countBucket";

const getBarHeightPercent = (value: number, maxValue: number): string => {
  if (maxValue <= 0 || value <= 0) {
    return "3%";
  }

  return `${Math.max((value / maxValue) * 100, 8)}%`;
};

const getLevelMaxValue = (
  level: VisualizationLevel,
  data: SortingAnimationFrame,
): number => {
  if (isCountBucketLevel(level)) {
    return Math.max(data.array.length, 1);
  }

  return Math.max(...level.values, 1);
};

const getLevelTitle = (level: VisualizationLevel): string => {
  if (level.rangeStart !== undefined && level.rangeEnd !== undefined) {
    return `${level.label} (${level.rangeStart} to ${level.rangeEnd})`;
  }

  return level.label;
};

export function SortingVisualizer({
  data,
  arraySize,
  currentFrame,
  totalFrames,
  onScrub,
}: SortingVisualizerProps) {
  const hasBucketGrid = data.bucketGroups !== undefined;
  const hasExtendedLayers =
    !hasBucketGrid &&
    (data.bucketValues !== undefined || data.outputValues !== undefined);
  const levels: VisualizationLevel[] = hasExtendedLayers
    ? [
        {
          key: "input",
          label: data.arrayLabel || "Input",
          values: data.array,
          activeIndices: data.activeIndices,
          blueIndices: data.blueIndices,
          sortedIndices: data.sortedIndices,
        },
        {
          key: "buckets",
          label: data.bucketLabel || "Buckets",
          values: data.bucketValues || [],
          rangeStart: data.bucketRangeStart,
          rangeEnd: data.bucketRangeEnd,
          activeIndices: data.bucketActiveIndices,
          blueIndices: data.bucketBlueIndices,
          sortedIndices: data.bucketSortedIndices,
          tooltipKind:
            data.bucketRangeStart !== undefined &&
            data.bucketRangeEnd !== undefined
              ? "countBucket"
              : "value",
        },
        {
          key: "output",
          label: data.outputLabel || "Output",
          values: data.outputValues || [],
          activeIndices: data.outputActiveIndices,
          blueIndices: data.outputBlueIndices,
          sortedIndices: data.outputSortedIndices || [],
        },
      ]
    : [
        {
          key: "input",
          label: data.arrayLabel || "Array",
          values: data.array,
          activeIndices: data.activeIndices,
          blueIndices: data.blueIndices,
          sortedIndices: data.sortedIndices,
        },
      ];

  const renderLegacyBars = (level: VisualizationLevel): ReactNode => {
    const maxValue = getLevelMaxValue(level, data);

    return level.values.map((value, idx) => {
      const isSorted = level.sortedIndices?.includes(idx) || false;
      const isActive = level.activeIndices?.includes(idx) || false;
      const isBlue = level.blueIndices?.includes(idx) || false;
      const tooltipText =
        isCountBucketLevel(level) && level.rangeStart !== undefined
          ? `index=${idx}, value=${level.rangeStart + idx}, count=${value}`
          : `index=${idx}, value=${value}`;

      return (
        <TooltipProvider key={`${level.key}-${idx}`}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={`flex-1 rounded-t-md transition-all duration-75 ease-out cursor-pointer hover:brightness-110 origin-bottom ${
                  data.completed
                    ? "bg-green-500/80 animate-sorting-wave"
                    : isSorted
                      ? "bg-green-500/80"
                      : isBlue
                        ? "bg-blue-500/80 scale-y-105 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : isActive
                          ? "bg-red-500/80 scale-y-105 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                          : "bg-gray-500/80"
                }`}
                style={{
                  height: getBarHeightPercent(value, maxValue),
                  animationDelay: data.completed
                    ? `${idx * (600 / Math.max(level.values.length, 1))}ms`
                    : "0s",
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-mono">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  const renderBucketGridBars = (
    level: VisualizationLevel,
    emptyStateLabel?: string,
  ): ReactNode => {
    if (level.values.length === 0) {
      if (!emptyStateLabel) {
        return null;
      }

      return (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          {emptyStateLabel}
        </div>
      );
    }

    const maxValue = getLevelMaxValue(level, data);

    return level.values.map((value, idx) => {
      const isSorted = level.sortedIndices?.includes(idx) || false;
      const isActive = level.activeIndices?.includes(idx) || false;
      const isBlue = level.blueIndices?.includes(idx) || false;
      const animateCompletedWave = data.completed && level.key !== "input";
      const showCompletedGreen = data.completed && level.key !== "input";
      const tooltipText =
        isCountBucketLevel(level) && level.rangeStart !== undefined
          ? `index=${idx}, value=${level.rangeStart + idx}, count=${value}`
          : `index=${idx}, value=${value}`;

      return (
        <TooltipProvider key={`${level.key}-${idx}`}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={`flex-1 rounded-t-md transition-all duration-75 ease-out cursor-pointer hover:brightness-110 origin-bottom ${
                  data.completed
                    ? showCompletedGreen
                      ? animateCompletedWave
                        ? "bg-green-500/80 animate-sorting-wave"
                        : "bg-green-500/80"
                      : "bg-gray-500/80"
                    : isSorted
                      ? "bg-green-500/80"
                      : isBlue
                        ? "bg-blue-500/80 scale-y-105 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : isActive
                          ? "bg-red-500/80 scale-y-105 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                          : "bg-gray-500/80"
                }`}
                style={{
                  height: getBarHeightPercent(value, maxValue),
                  animationDelay: animateCompletedWave
                    ? `${idx * (600 / Math.max(level.values.length, 1))}ms`
                    : "0s",
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-mono">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  const renderBucketGridLevel = (
    level: VisualizationLevel,
    options?: {
      containerClassName?: string;
      emptyStateLabel?: string;
    },
  ) => (
    <div key={level.key} className="min-h-0 flex flex-1 flex-col gap-2">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
        {getLevelTitle(level)}
      </span>
      <div
        className={`min-h-0 flex-1 rounded-lg border border-border/40 bg-background/30 p-2 lg:p-3 flex items-end justify-center ${options?.containerClassName || getGapClassName(level.values.length)}`}
      >
        {renderBucketGridBars(level, options?.emptyStateLabel)}
      </div>
    </div>
  );

  const renderBucketPanel = (
    bucketGroup: SortingBucketGroup,
    index: number,
  ) => {
    const isActiveBucket =
      Boolean(bucketGroup.activeIndices?.length) ||
      Boolean(bucketGroup.blueIndices?.length);
    const hasValues = bucketGroup.values.length > 0;

    const getBucketValueClassName = (valueIndex: number): string => {
      const isSorted = bucketGroup.sortedIndices?.includes(valueIndex) || false;
      const isActive = bucketGroup.activeIndices?.includes(valueIndex) || false;
      const isBlue = bucketGroup.blueIndices?.includes(valueIndex) || false;

      if (data.completed || isSorted) {
        return "border-green-500/70 bg-green-500/15 text-green-700 dark:text-green-300";
      }

      if (isBlue) {
        return "border-blue-500/70 bg-blue-500/15 text-blue-700 shadow-[0_0_0_1px_rgba(59,130,246,0.2)] dark:text-blue-300";
      }

      if (isActive) {
        return "border-red-500/70 bg-red-500/15 text-red-700 shadow-[0_0_0_1px_rgba(239,68,68,0.2)] dark:text-red-300";
      }

      return "border-border/60 bg-background/85 text-foreground";
    };

    return (
      <div
        key={`bucket-${bucketGroup.label}-${bucketGroup.rangeStart}-${bucketGroup.rangeEnd}-${index}`}
        className={`grid w-full min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
          isActiveBucket
            ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.18)]"
            : "border-border/40 bg-background/20"
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border bg-background/80 font-mono text-xl ${
            isActiveBucket
              ? "border-primary/60 text-primary"
              : "border-border/50 text-muted-foreground"
          }`}
        >
          {index}
        </div>

        <div className="min-w-0 overflow-x-auto pb-1">
          <div className="flex min-h-12 min-w-max items-center gap-2">
            {hasValues ? (
              bucketGroup.values.map((value, valueIndex) => (
                <div
                  key={`${bucketGroup.label}-${valueIndex}-${value}`}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg leading-none text-muted-foreground/70">
                    {valueIndex === 0 ? "→" : "→"}
                  </span>
                  <div
                    className={`min-w-14 shrink-0 rounded-[4px] border px-3 py-2 text-center font-mono text-sm transition-colors ${getBucketValueClassName(valueIndex)}`}
                  >
                    {value}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs italic text-muted-foreground">
                empty
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

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

      <div
        className={`w-full glass rounded-xl p-4 lg:p-6 h-[50vh] min-h-[300px] lg:h-[650px] relative overflow-hidden ${
          hasBucketGrid || hasExtendedLayers
            ? "flex flex-col gap-3"
            : "flex items-end justify-center"
        } ${hasBucketGrid || hasExtendedLayers ? "" : getGapClassName(arraySize[0])}`}
      >
        {hasBucketGrid ? (
          <>
            {renderBucketGridLevel(
              {
                key: "input",
                label: data.arrayLabel || "Input",
                values: data.array,
                activeIndices: data.activeIndices,
                blueIndices: data.blueIndices,
                sortedIndices: data.sortedIndices,
                tooltipKind: "value",
              },
              {
                containerClassName: getGapClassName(data.array.length),
                emptyStateLabel: "No input values",
              },
            )}

            <div className="min-h-0 flex-[1.4] flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                Bucket Array
              </span>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
                <div className="w-full min-w-0 space-y-2 rounded-lg border border-border/30 bg-background/20 p-3">
                  {data.bucketGroups?.map(renderBucketPanel)}
                </div>
              </div>
            </div>

            {renderBucketGridLevel(
              {
                key: "output",
                label: data.outputLabel || "Output",
                values: data.outputValues || [],
                activeIndices: data.outputActiveIndices,
                blueIndices: data.outputBlueIndices,
                sortedIndices: data.outputSortedIndices || [],
                tooltipKind: "value",
              },
              {
                containerClassName: getGapClassName(
                  (data.outputValues || []).length,
                ),
                emptyStateLabel: "Output builds here",
              },
            )}
          </>
        ) : hasExtendedLayers ? (
          levels.map((level) => (
            <div key={level.key} className="min-h-0 flex-1 flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                {getLevelTitle(level)}
              </span>
              <div
                className={`min-h-0 flex-1 rounded-lg border border-border/40 bg-background/30 p-2 lg:p-3 flex items-end justify-center ${getGapClassName(level.values.length)}`}
              >
                {renderLegacyBars(level)}
              </div>
            </div>
          ))
        ) : (
          renderLegacyBars(levels[0])
        )}
      </div>

      {/* Scrubber / Progress */}
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
