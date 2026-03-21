import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { shellSortDefinition } from "@/algorithms/sorting/definitions/shell-sort";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function ShellSortPage() {
  const metadata = getAlgorithmMetadata(shellSortDefinition.slug);
  const playback = useSortingPlayback(shellSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Shell Sort"}
      description={metadata?.description}
      playback={playback}
      details={shellSortDefinition.details}
    />
  );
}
