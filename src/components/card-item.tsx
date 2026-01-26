import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  title: string;
  description: string;
  slug: string;
  className?: string;
}

export function CardItem({
  title,
  description,
  slug,
  className,
}: CardItemProps) {
  return (
    <Link
      to={`/algorithms/${slug}`}
      className={cn("group block relative h-full", className)}
    >
      <div className="h-full bg-card text-card-foreground border-2 border-primary rounded-lg p-6 transition-all duration-200 ease-in-out shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex flex-col h-full justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl tracking-tight flex items-center justify-between">
              {title}
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {description}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 group-hover:text-primary transition-colors">
              Visualize
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
