import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { bubbleSortDefinition } from "@/algorithms/sorting/definitions/bubble-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function BubbleSortPage() {
  const metadata = getAlgorithmMetadata(bubbleSortDefinition.slug);
  const playback = useSortingPlayback(bubbleSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Bubble Sort"}
      description={metadata?.description}
      playback={playback}
      details={bubbleSortDefinition.details}
    />
  );
}
