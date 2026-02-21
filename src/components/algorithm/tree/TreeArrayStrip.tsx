import { cn } from "@/lib/utils";
import type { TreeArrayStripItem } from "@/components/algorithm/tree/types";

interface TreeArrayStripProps {
  items: TreeArrayStripItem[];
  className?: string;
}

export function TreeArrayStrip({ items, className }: TreeArrayStripProps) {
  return (
    <div className={cn("max-w-full overflow-x-auto", className)}>
      <div className="flex items-center gap-1.5 min-w-max">
        {items.map((item) => (
          <div
            key={`tree-array-${item.index}`}
            className={cn(
              "min-w-11 rounded border px-1.5 py-1 text-center leading-tight border-border bg-background/50 text-foreground",
              item.className,
            )}
            title={item.title}
          >
            <div className="font-mono text-[10px] text-muted-foreground">
              {item.index}
            </div>
            <div className="font-mono text-[11px] font-semibold">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
