import type { ReactNode } from "react";
import {
  AlgorithmDetails,
  type AlgorithmDetailsProps,
} from "@/components/algorithm/AlgorithmDetails";
import { AlgorithmPageHeader } from "@/components/algorithm/AlgorithmPageHeader";
import { SortingControls } from "@/components/algorithm/SortingControls";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { SortingStats } from "@/components/algorithm/SortingStats";
import type { SortingPlaybackState } from "@/hooks/use-sorting-playback";

interface SortingPageScaffoldProps {
  title: string;
  description?: string;
  playback: SortingPlaybackState;
  visualization?: ReactNode;
  details: AlgorithmDetailsProps;
}

export function SortingPageScaffold({
  title,
  description,
  playback,
  visualization,
  details,
}: SortingPageScaffoldProps) {
  return (
    <div className="container mx-auto py-6 px-4 space-y-8 min-h-screen flex flex-col">
      <AlgorithmPageHeader
        title={title}
        description={description}
        isMuted={playback.isMuted}
        onToggleMute={playback.handleToggleMute}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        {visualization || (
          <SortingVisualizer
            data={playback.data}
            arraySize={playback.arraySize}
            currentFrame={playback.currentFrame}
            totalFrames={playback.totalFrames}
            onScrub={playback.handleScrub}
          />
        )}

        <div className="w-full lg:w-80 space-y-4">
          <SortingStats
            comparisons={playback.data.stats.comparisons}
            swaps={playback.data.stats.swaps}
          />
          <SortingControls
            isPlaying={playback.isPlaying}
            isCompleted={playback.data.completed}
            onPlay={playback.handlePlay}
            onPause={playback.handlePause}
            onReset={playback.handleReset}
            onRandomize={playback.handleRandomize}
            speed={playback.speed}
            onSpeedChange={playback.setSpeed}
            arraySize={playback.arraySize}
            onSizeChange={playback.setArraySize}
            currentFrame={playback.currentFrame}
            totalFrames={playback.totalFrames}
            onNext={playback.handleNext}
            onPrev={playback.handlePrev}
          />
          <AlgorithmDetails {...details} />
        </div>
      </div>
    </div>
  );
}
