import { algorithms, type AlgorithmCategory } from "@/algorithms";
import { CardItem } from "@/components/card-item";
import { ModeToggle } from "@/components/mode-toggle";
import { SEOHead } from "@/components/SEOHead";

export function HomePage() {
  const categories: AlgorithmCategory[] = [
    "Arrays & Sorting",
    "Searching",
    "Data Structures",
    "Graphs",
    "Dynamic Programming",
  ];

  return (
    <div className="container mx-auto py-12 px-4 space-y-12 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <SEOHead />
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Algorithms Visualization
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualize, interact, and understand complex algorithms step-by-step.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => {
          const categoryAlgorithms = algorithms.filter(
            (algo) => algo.category === category,
          );

          if (categoryAlgorithms.length === 0) return null;

          return (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryAlgorithms.map((algo) => (
                  <CardItem
                    key={algo.slug}
                    title={algo.name}
                    description={algo.description}
                    slug={algo.slug}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
