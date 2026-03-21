import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { insertionSortDefinition } from "@/algorithms/sorting/definitions/insertion-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function InsertionSortPage() {
  const metadata = getAlgorithmMetadata(insertionSortDefinition.slug);
  const playback = useSortingPlayback(insertionSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Insertion Sort"}
      description={metadata?.description}
      playback={playback}
      details={insertionSortDefinition.details}
    />
  );
}
