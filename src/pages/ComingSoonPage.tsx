import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveLeft, Construction } from "lucide-react";
import { algorithms } from "@/algorithms";

export function ComingSoonPage() {
  const { slug } = useParams();
  const algorithm = algorithms.find((a) => a.slug === slug);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4">
      <div className="p-6 rounded-full bg-muted/50 border-4 border-muted">
        <Construction className="w-16 h-16 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {algorithm ? algorithm.name : "Coming Soon"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          We are currently working hard to implement this visualization. Check
          back later!
        </p>
      </div>

      <Button asChild variant="outline" size="lg" className="gap-2">
        <Link to="/">
          <MoveLeft className="w-4 h-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
