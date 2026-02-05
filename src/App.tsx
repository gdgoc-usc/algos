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
import { ThemeProvider } from "@/components/theme-provider";
import { algorithms } from "@/algorithms";

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
    return <BubbleSortPage />;
  }

  return (
    <div className="p-12 text-center text-xl">
      Algorithm Visualization Placeholder for: {algorithm.name}
    </div>
  );
}

export function App() {
  return (
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
  );
}

export default App;
