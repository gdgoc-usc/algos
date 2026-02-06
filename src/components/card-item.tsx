import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  title: string;
  description: string;
  slug: string;
  implemented?: boolean;
  className?: string;
}

export function CardItem({
  title,
  description,
  slug,
  implemented,
  className,
}: CardItemProps) {
  return (
    <Link
      to={`/algorithms/${slug}`}
      className={cn("group block relative h-full", className)}
    >
      <div
        className="h-full bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300 ease-out 
        hover:border-primary/50 hover:bg-muted/30
        hover:-translate-y-1 relative overflow-hidden"
      >
        <div className="flex flex-col h-full justify-between space-y-4 relative z-10">
          <div className="space-y-3">
            <h3 className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div className="pt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {implemented ? (
              <>
                <span>Visualize</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            ) : (
              <span>Coming Soon</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
