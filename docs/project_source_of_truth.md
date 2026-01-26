This is the regenerated **base project source of truth** (SOT) for your Algorithms and Complexities visualization course project, aligned with a Vite + vanilla React + shadcn/ui stack and Excalifont typography. [ui.shadcn](https://ui.shadcn.com/docs/installation/vite)

## Product scope

Build a learning-focused web app where students can **visualize algorithm operations** step-by-step, with controls to play, pause, step forward/back, reset, and adjust speed.

Each algorithm gets its own dedicated page that includes: a canvas visualization area, user inputs (e.g., array values, graph edges, stack operations), and action buttons that trigger/animate the algorithm’s operations.

Non-goals (to keep scope realistic for a course): full proofs, exhaustive benchmarking, and advanced 3D visuals; prioritize clarity, correctness, and interactivity.

## Information architecture

Home page: an ordered list of algorithms (grouped and sortable by category and difficulty).

Recommended ordering scheme:

- Arrays & Sorting: Bubble, Selection, Insertion, Merge, Quick, Heap.
- Searching: Linear, Binary.
- Data structures: Stack, Queue, Linked List (basic ops).
- Graphs: BFS, DFS, Dijkstra (optional, time permitting).
- Dynamic programming (optional): Fibonacci memo/tab, Knapsack mini-demo.

Routing: `/` for Home, `/algorithms/:slug` for the algorithm detail page, and an optional `/about` page explaining how to use the visualizer and what the UI symbols mean.

## Algorithm page contract

Every algorithm page should implement the same UI contract so the app feels consistent:

- Canvas panel: primary visualization surface (use `<canvas>` 2D or SVG/DOM rendering; keep it deterministic and resolution-aware).
- Inputs panel: algorithm-specific inputs (e.g., “Array values”, “Target value”, “Push/Pop value”, “Graph edges”).
- Controls panel (standardized):
  - Run / Pause
  - Step forward / Step back (if feasible; otherwise Step forward only with Reset)
  - Reset
  - Speed slider
  - “Load example” and “Randomize” (where it makes sense)
- State readout (small but useful):
  - Current step number
  - Operation description (e.g., “Compare i and j”, “Swap”, “Push”, “Pop”)
  - Key variables (e.g., `i`, `j`, pivot) when relevant

Implementation rule: represent an algorithm as a generator of “steps” (immutable snapshots or patch-based events) so the UI can replay/step through operations reliably.

## Tech stack decisions

- Build tooling: Vite + React (“vanilla React with Vite”), with Node versions aligned to Vite’s current requirements (Vite documents Node 20.19+ or 22.12+). [vite](https://vite.dev/guide/)
- UI components: shadcn/ui components installed/configured using the Vite-specific installation guide. [ui.shadcn](https://ui.shadcn.com/docs/installation/vite)
- Typography: Excalifont as the primary display/body font choice (Excalifont is noted as the successor to Virgil for improved legibility in Excalidraw’s ecosystem). [plus.excalidraw](https://plus.excalidraw.com/virgil)
- Font loading approach: load Excalifont via local files or a hosted source and wire it using CSS font loading (commonly via `@font-face`). [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-load-and-use-custom-fonts-with-css)

Suggested folder structure (simple, course-friendly):

- `src/pages/` (Home, AlgorithmPage)
- `src/algorithms/` (each algorithm exports metadata + step generator)
- `src/components/` (shared UI: ControlBar, InputPanel, CanvasStage)
- `src/lib/` (utilities: random array, validation, timing/animation helpers)
- `src/styles/` (global styles, font setup)

## Milestones (minimum shippable)

1. App shell: routing, layout, Home list populated from a single `algorithms/index.ts` registry.
2. One fully-polished algorithm page (e.g., Bubble Sort) implementing the full “page contract”.
3. Add 3–5 more algorithms reusing the same contract (fast to scale once the framework is right).
4. UX polish: consistent controls, input validation, presets/examples, keyboard shortcuts (Space = play/pause, arrows = step).
5. Final pass: accessibility basics (focus states, labels), performance (avoid unnecessary re-renders), and deployment (GitHub Pages/Netlify/Vercel).

If you tell me which algorithms your syllabus requires (or your professor’s list), I can generate the initial `algorithms` registry (names, slugs, categories, and default examples) to lock down the Home page ordering.
