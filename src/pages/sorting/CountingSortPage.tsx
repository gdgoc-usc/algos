import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { countingSortDefinition } from "@/algorithms/sorting/definitions/counting-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function CountingSortPage() {
  const metadata = getAlgorithmMetadata(countingSortDefinition.slug);
  const playback = useSortingPlayback(countingSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Counting Sort"}
      description={metadata?.description}
      playback={playback}
      details={countingSortDefinition.details}
    />
  );
}
