import { getAlgorithmMetadata } from "@/algorithms/metadata";
import { bucketSortDefinition } from "@/algorithms/sorting/bucket-sort/definition";
import { SortingPageScaffold } from "@/components/algorithm/SortingPageScaffold";
import { useSortingPlayback } from "@/hooks/use-sorting-playback";

export function BucketSortPage() {
  const metadata = getAlgorithmMetadata(bucketSortDefinition.slug);
  const playback = useSortingPlayback(bucketSortDefinition);

  return (
    <SortingPageScaffold
      title={metadata?.name || "Bucket Sort"}
      description={metadata?.description}
      playback={playback}
      details={bucketSortDefinition.details}
    />
  );
}
