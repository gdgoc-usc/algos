import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SortingControlsProps {
  isPlaying: boolean;
  isCompleted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onRandomize: () => void;
  speed: number[];
  onSpeedChange: (value: number[]) => void;
  arraySize: number[];
  onSizeChange: (value: number[]) => void;
  currentFrame: number;
  totalFrames: number;
  onNext: () => void;
  onPrev: () => void;
}

export function SortingControls({
  isPlaying,
  isCompleted,
  onPlay,
  onPause,
  onReset,
  onRandomize,
  speed,
  onSpeedChange,
  arraySize,
  onSizeChange,
  currentFrame,
  totalFrames,
  onNext,
  onPrev,
}: SortingControlsProps) {
  return (
    <div className="w-full lg:w-80 space-y-4">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Controls</span>
            <Badge
              variant={
                isPlaying ? "default" : isCompleted ? "default" : "secondary"
              }
              className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isCompleted ? "COMPLETED" : isPlaying ? "RUNNING" : "PAUSED"}
            </Badge>
          </div>

          {/* Main Playback Controls */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={isPlaying ? onPause : onPlay}
              className="w-full"
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />{" "}
                  {isCompleted ? "Replay" : "Play"}
                </>
              )}
            </Button>
            <Button onClick={onReset} variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>

          <Button onClick={onRandomize} variant="secondary" className="w-full">
            <Shuffle className="w-4 h-4 mr-2" /> Randomize
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Speed</span>
              <span>{speed[0]}%</span>
            </div>
            <Slider
              value={speed}
              onValueChange={onSpeedChange}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Size</span>
              <span>{arraySize[0]} items</span>
            </div>
            <Slider
              value={arraySize}
              onValueChange={onSizeChange}
              min={10}
              max={100}
              step={5}
            />
          </div>
        </div>

        {/* Step Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onPrev}
            variant="outline"
            disabled={currentFrame === 0}
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button
            onClick={onNext}
            variant="outline"
            disabled={currentFrame === totalFrames - 1}
            title="Next Step"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
