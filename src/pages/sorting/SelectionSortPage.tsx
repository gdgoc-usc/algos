import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { selectionSortDefinition } from "@/algorithms/sorting/definitions/selection-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function SelectionSortPage() {
  const metadata = getAlgorithmMetadata(selectionSortDefinition.slug);
  const playback = useSortingPlayback(selectionSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Selection Sort"}
      description={metadata?.description}
      playback={playback}
      details={selectionSortDefinition.details}
    />
  );
}
