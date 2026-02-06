import { MonitorPlay } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AlgorithmDetailsProps {
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

export function AlgorithmDetails({
  timeComplexity,
  spaceComplexity,
  description,
}: AlgorithmDetailsProps) {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MonitorPlay className="w-4 h-4" />
        Algorithm Details
      </h3>
      <div className="text-sm space-y-2 text-muted-foreground">
        <p>
          <strong className="text-foreground">Time Complexity:</strong>{" "}
          {timeComplexity}
        </p>
        <p>
          <strong className="text-foreground">Space Complexity:</strong>{" "}
          {spaceComplexity}
        </p>
        <p>{description}</p>
      </div>
    </Card>
  );
}
