import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { gnomeSortDefinition } from "@/algorithms/sorting/definitions/gnome-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function GnomeSortPage() {
  const metadata = getAlgorithmMetadata(gnomeSortDefinition.slug);
  const playback = useSortingPlayback(gnomeSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Gnome Sort"}
      description={metadata?.description}
      playback={playback}
      details={gnomeSortDefinition.details}
    />
  );
}
