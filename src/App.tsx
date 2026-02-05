import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen font-sans bg-background text-foreground flex flex-col">
          <header className="container mx-auto p-4 flex justify-end">
            <ModeToggle />
          </header>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/algorithms/:slug"
                element={
                  <div className="p-12 text-center text-xl">
                    Algorithm Visualization Placeholder
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
