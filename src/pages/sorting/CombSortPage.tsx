import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { combSortDefinition } from "@/algorithms/sorting/definitions/comb-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function CombSortPage() {
  const metadata = getAlgorithmMetadata(combSortDefinition.slug);
  const playback = useSortingPlayback(combSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Comb Sort"}
      description={metadata?.description}
      playback={playback}
      details={combSortDefinition.details}
    />
  );
}
