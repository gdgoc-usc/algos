import { Badge } from "@/components/ui/badge";

interface SortingStatsProps {
  comparisons: number;
  swaps: number;
}

export function SortingStats({ comparisons, swaps }: SortingStatsProps) {
  return (
    <div className="flex gap-2 w-full">
      <Badge
        variant="outline"
        className="text-sm px-3 py-3 flex-1 justify-center"
      >
        Comparisons: {comparisons}
      </Badge>
      <Badge
        variant="outline"
        className="text-sm px-3 py-3 flex-1 justify-center"
      >
        Swaps: {swaps}
      </Badge>
    </div>
  );
}
