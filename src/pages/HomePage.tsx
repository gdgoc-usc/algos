import { algorithms, type AlgorithmCategory } from "@/algorithms";
import { GDG_INFO } from "@/lib/constants";
import { CardItem } from "@/components/card-item";
import { ModeToggle } from "@/components/mode-toggle";

import { SEOHead } from "@/components/SEOHead";
import { ArrowRight, Code2 } from "lucide-react";

export function HomePage() {
  const categories: AlgorithmCategory[] = [
    "Sorting",
    "Searching",
    "Data Structures",
    "Graphs",
    "Dynamic Programming",
  ];

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <SEOHead />
      <main className="container mx-auto px-4 py-16 space-y-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-12 relative">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground pb-4">
            algos-visualizer
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Visualize, interact, and understand complex data structures and
            algorithms with our
            <span className="text-foreground font-semibold">
              {" "}
              next-gen
            </span>{" "}
            step-by-step visualizer.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <a
              href="#algorithms"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:scale-105 active:scale-95 shadow-primary/25"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GDG_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium transition-transform hover:scale-105 active:scale-95 border border-border/50"
            >
              <Code2 className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>

        {/* Algorithm Categories */}
        <div id="algorithms" className="space-y-20">
          {categories.map((category, index) => {
            const categoryAlgorithms = algorithms.filter(
              (algo) => algo.category === category,
            );

            if (categoryAlgorithms.length === 0) return null;

            // Cycle through Google colors
            const colors: ("blue" | "red" | "yellow" | "green")[] = [
              "blue",
              "red",
              "yellow",
              "green",
            ];
            const categoryColor = colors[index % colors.length];

            return (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {category}
                  </h2>
                  <div
                    className={`h-1 w-12 rounded-full bg-google-${categoryColor}`}
                  />
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryAlgorithms.map((algo) => (
                    <CardItem
                      key={algo.slug}
                      title={algo.name}
                      description={algo.description}
                      slug={algo.slug}
                      implemented={algo.implemented}
                      color={categoryColor}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
