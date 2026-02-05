import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4">
      <div className="space-y-4">
        <h1 className="text-9xl font-bold tracking-tighter opacity-10">404</h1>
        <h2 className="text-4xl font-bold tracking-tight">Page not found</h2>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or never existed.
        </p>
      </div>

      <Button asChild variant="outline" size="lg" className="gap-2">
        <Link to="/">
          <MoveLeft className="w-4 h-4" />
          Back into safety
        </Link>
      </Button>
    </div>
  );
}
