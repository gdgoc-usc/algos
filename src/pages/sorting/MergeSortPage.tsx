import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { mergeSortDefinition } from "@/algorithms/sorting/definitions/merge-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function MergeSortPage() {
  const metadata = getAlgorithmMetadata(mergeSortDefinition.slug);
  const playback = useSortingPlayback(mergeSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Merge Sort"}
      description={metadata?.description}
      playback={playback}
      details={mergeSortDefinition.details}
    />
  );
}
