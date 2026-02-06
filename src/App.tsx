import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { BubbleSortPage } from "@/pages/sorting/BubbleSortPage";
import { SelectionSortPage } from "@/pages/sorting/SelectionSortPage";
import { InsertionSortPage } from "@/pages/sorting/InsertionSortPage";
import { ThemeProvider } from "@/components/theme-provider";
import { algorithms } from "@/algorithms";
import { HelmetProvider } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";

function AlgorithmRoute() {
  const { slug } = useParams();
  const algorithm = algorithms.find((a) => a.slug === slug);

  if (!algorithm) {
    return <NotFoundPage />;
  }

  if (!algorithm.implemented) {
    return <ComingSoonPage />;
  }

  if (slug === "bubble-sort") {
    return (
      <>
        <SEOHead
          title={`${algorithm.name} - Algos`}
          description={algorithm.description}
          url={`/algorithms/${algorithm.slug}`}
        />
        <BubbleSortPage />
      </>
    );
  }

  if (slug === "selection-sort") {
    return (
      <>
        <SEOHead
          title={`${algorithm.name} - Algos`}
          description={algorithm.description}
          url={`/algorithms/${algorithm.slug}`}
        />
        <SelectionSortPage />
      </>
    );
  }

  if (slug === "insertion-sort") {
    return (
      <>
        <SEOHead
          title={`${algorithm.name} - Algos`}
          description={algorithm.description}
          url={`/algorithms/${algorithm.slug}`}
        />
        <InsertionSortPage />
      </>
    );
  }

  return (
    <div className="p-12 text-center text-xl">
      <SEOHead
        title={`${algorithm.name} - Algos`}
        description={algorithm.description}
        url={`/algorithms/${algorithm.slug}`}
      />
      Algorithm Visualization Placeholder for: {algorithm.name}
    </div>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <div className="min-h-screen font-sans bg-background text-foreground flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/algorithms/:slug" element={<AlgorithmRoute />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
