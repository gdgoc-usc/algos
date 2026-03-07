import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SortingAnimationFrame } from "@/types/sorting";

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

const getBarHeightPercent = (value: number, maxValue: number): string => {
  if (maxValue <= 0 || value <= 0) {
    return "3%";
  }

  return `${Math.max((value / maxValue) * 100, 8)}%`;
};

const getLevelTitle = (level: VisualizationLevel): string => {
  if (
    level.key === "buckets" &&
    level.rangeStart !== undefined &&
    level.rangeEnd !== undefined
  ) {
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
  const hasExtendedLayers =
    data.bucketValues !== undefined || data.outputValues !== undefined;
  const levels: VisualizationLevel[] = hasExtendedLayers
    ? [
        {
          key: "input",
          label: "Input",
          values: data.array,
          activeIndices: data.activeIndices,
          blueIndices: data.blueIndices,
          sortedIndices: data.sortedIndices,
        },
        {
          key: "buckets",
          label: "Buckets",
          values: data.bucketValues || [],
          rangeStart: data.bucketRangeStart,
          rangeEnd: data.bucketRangeEnd,
          activeIndices: data.bucketActiveIndices,
          blueIndices: data.bucketBlueIndices,
          sortedIndices: data.bucketSortedIndices,
        },
        {
          key: "output",
          label: "Output",
          values: data.outputValues || [],
          activeIndices: data.outputActiveIndices,
          blueIndices: data.outputBlueIndices,
          sortedIndices: data.outputSortedIndices || [],
        },
      ]
    : [
        {
          key: "input",
          label: "Array",
          values: data.array,
          activeIndices: data.activeIndices,
          blueIndices: data.blueIndices,
          sortedIndices: data.sortedIndices,
        },
      ];

  const renderBars = (level: VisualizationLevel) => {
    const maxValue = Math.max(...level.values, 1);

    return level.values.map((value, idx) => {
      const isSorted = level.sortedIndices?.includes(idx) || false;
      const isActive = level.activeIndices?.includes(idx) || false;
      const isBlue = level.blueIndices?.includes(idx) || false;
      const tooltipText =
        level.key === "buckets" && level.rangeStart !== undefined
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
          hasExtendedLayers
            ? "flex flex-col gap-3"
            : "flex items-end justify-center"
        } ${hasExtendedLayers ? "" : getGapClassName(arraySize[0])}`}
      >
        {hasExtendedLayers
          ? levels.map((level) => (
              <div
                key={level.key}
                className="min-h-0 flex-1 flex flex-col gap-2"
              >
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                  {getLevelTitle(level)}
                </span>
                <div
                  className={`min-h-0 flex-1 rounded-lg border border-border/40 bg-background/30 p-2 lg:p-3 flex items-end justify-center ${getGapClassName(level.values.length)}`}
                >
                  {renderBars(level)}
                </div>
              </div>
            ))
          : renderBars(levels[0])}
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
