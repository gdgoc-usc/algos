import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectAdditionToastCardProps {
  title: string;
  description: string;
  onHide: () => void;
}

export function ProjectAdditionToastCard({
  title,
  description,
  onHide,
}: ProjectAdditionToastCardProps) {
  return (
    <div className="w-full max-w-full sm:w-[var(--width)] font-sans bg-background/50 backdrop-blur-md border border-primary/50 rounded-2xl p-4 overflow-hidden text-foreground shadow-[0_14px_32px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_36px_rgba(0,0,0,0.28)]">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-google-blue/20 bg-google-blue/10 text-google-blue">
            <Megaphone
              aria-hidden="true"
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="pt-0.5 text-base font-bold tracking-tight text-foreground">
                {title}
              </h3>

              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-6 rounded-full border-border/50 bg-background/70 px-2 text-[0.65rem] text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                onClick={onHide}
              >
                Hide
              </Button>
            </div>

            <p className="max-w-[31ch] text-[0.8rem] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
