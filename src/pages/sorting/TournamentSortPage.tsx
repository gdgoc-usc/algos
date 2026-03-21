import { useState } from "react";
import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { tournamentSortDefinition } from "@/algorithms/sorting/tournament-sort/definition";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { SortingVisualizer } from "@/components/algorithm/SortingVisualizer";
import { TournamentTreeVisualizer } from "@/components/algorithm/TournamentTreeVisualizer";
import { Button } from "@/components/ui/button";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

type ViewMode = "bars" | "tree";

export function TournamentSortPage() {
  const metadata = getAlgorithmMetadata(tournamentSortDefinition.slug);
  const playback = useSortingPlayback(tournamentSortDefinition);
  const [viewMode, setViewMode] = useState<ViewMode>("bars");

  return (
    <SortingPageScaffold
      title={metadata?.name || "Tournament Sort"}
      description={metadata?.description}
      playback={playback}
      details={tournamentSortDefinition.details}
      visualization={
        <div className="flex-1 w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "bars" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bars")}
            >
              Bars
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tree")}
            >
              Tree
            </Button>
          </div>

          {viewMode === "bars" ? (
            <SortingVisualizer
              data={playback.data}
              arraySize={playback.arraySize}
              currentFrame={playback.currentFrame}
              totalFrames={playback.totalFrames}
              onScrub={playback.handleScrub}
            />
          ) : (
            <TournamentTreeVisualizer
              data={playback.data}
              currentFrame={playback.currentFrame}
              totalFrames={playback.totalFrames}
              onScrub={playback.handleScrub}
            />
          )}
        </div>
      }
    />
  );
}
