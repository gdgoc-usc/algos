import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { strandSortDefinition } from "@/algorithms/sorting/definitions/strand-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function StrandSortPage() {
  const metadata = getAlgorithmMetadata(strandSortDefinition.slug);
  const playback = useSortingPlayback(strandSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Strand Sort"}
      description={metadata?.description}
      playback={playback}
      details={strandSortDefinition.details}
    />
  );
}
