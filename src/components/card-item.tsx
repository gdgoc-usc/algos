import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  title: string;
  description: string;
  slug: string;
  implemented?: boolean;
  className?: string;
  color?: "blue" | "red" | "yellow" | "green";
}

export function CardItem({
  title,
  description,
  slug,
  implemented,
  className,
  color = "blue",
}: CardItemProps) {
  const colorStyles = {
    blue: "hover:border-google-blue/50 group-hover:text-google-blue",
    red: "hover:border-google-red/50 group-hover:text-google-red",
    yellow: "hover:border-google-yellow/50 group-hover:text-google-yellow",
    green: "hover:border-google-green/50 group-hover:text-google-green",
  };

  return (
    <Link
      to={`/algorithms/${slug}`}
      className={cn("group block relative h-full", className)}
    >
      <div
        className={cn(
          "h-full bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300 ease-out hover:bg-muted/30 hover:-translate-y-1 relative overflow-hidden",
          colorStyles[color],
        )}
      >
        <div className="flex flex-col h-full justify-between space-y-4 relative z-10">
          <div className="space-y-3">
            <h3
              className={cn(
                "font-bold text-xl tracking-tight transition-colors",
                colorStyles[color].split(" ")[1],
              )}
            >
              {title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "pt-4 flex items-center text-sm font-medium text-muted-foreground transition-colors",
              colorStyles[color].split(" ")[1],
            )}
          >
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
