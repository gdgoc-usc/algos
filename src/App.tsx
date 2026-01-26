import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

export function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans bg-background text-foreground">
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
    </Router>
  );
}

export default App;
