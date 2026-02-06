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

export function SortingVisualizer({
  data,
  arraySize,
  currentFrame,
  totalFrames,
  onScrub,
}: SortingVisualizerProps) {
  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{data.description}</span>
        <Badge variant="secondary" className="font-mono text-xs">
          Step {currentFrame + 1} / {totalFrames}
        </Badge>
      </div>

      <div
        className={`w-full bg-muted/30 rounded-xl border p-4 lg:p-6 flex items-end justify-center h-[50vh] min-h-[300px] lg:h-[650px] relative overflow-hidden ${
          arraySize[0] > 60 ? "gap-px" : arraySize[0] > 30 ? "gap-px" : "gap-1"
        }`}
      >
        {data.array.map((value, idx) => {
          const isSorted = data.sortedIndices.includes(idx);
          const isActive = data.activeIndices?.includes(idx);
          const isBlue = data.blueIndices?.includes(idx);
          return (
            <TooltipProvider key={idx}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex-1 rounded-t-md transition-all duration-75 ease-out cursor-pointer hover:brightness-110 ${
                      isSorted
                        ? "bg-green-500/80"
                        : isBlue
                          ? "bg-blue-500/80 scale-y-105 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          : isActive
                            ? "bg-red-500/80 scale-y-105 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            : "bg-primary/80"
                    }`}
                    style={{ height: `${value}%` }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-mono">{value}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
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
