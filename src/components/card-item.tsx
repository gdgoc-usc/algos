import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CardAccentColor = "blue" | "red" | "yellow" | "green";

const cardAccentStyles = {
  blue: {
    border: "hover:border-google-blue/50",
    text: "group-hover:text-google-blue",
    icon: "border-google-blue/20 bg-google-blue/10 text-google-blue",
  },
  red: {
    border: "hover:border-google-red/50",
    text: "group-hover:text-google-red",
    icon: "border-google-red/20 bg-google-red/10 text-google-red",
  },
  yellow: {
    border: "hover:border-google-yellow/50",
    text: "group-hover:text-google-yellow",
    icon: "border-google-yellow/20 bg-google-yellow/10 text-google-yellow",
  },
  green: {
    border: "hover:border-google-green/50",
    text: "group-hover:text-google-green",
    icon: "border-google-green/20 bg-google-green/10 text-google-green",
  },
} satisfies Record<
  CardAccentColor,
  {
    border: string;
    icon: string;
    text: string;
  }
>;

interface CardItemProps {
  title: string;
  description: string;
  slug: string;
  icon: LucideIcon;
  implemented?: boolean;
  className?: string;
  color?: CardAccentColor;
}

export function CardItem({
  title,
  description,
  slug,
  icon: Icon,
  implemented,
  className,
  color = "blue",
}: CardItemProps) {
  const accent = cardAccentStyles[color];

  return (
    <Link
      to={`/algorithms/${slug}`}
      className={cn("group block relative h-full", className)}
    >
      <div
        className={cn(
          "h-full bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300 ease-out hover:bg-muted/30 hover:-translate-y-1 relative overflow-hidden",
          accent.border,
        )}
      >
        <div className="flex flex-col h-full justify-between space-y-4 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                  accent.icon,
                )}
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3
                className={cn(
                  "font-bold text-xl tracking-tight transition-colors",
                  accent.text,
                )}
              >
                {title}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "pt-4 flex items-center text-sm font-medium text-muted-foreground transition-colors",
              accent.text,
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
