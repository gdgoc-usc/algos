# Architecture & Information Architecture

## Application Structure

The application is built as a Single Page Application (SPA) using Vite and React.

### Routing

- **`/` (Home)**: Displays a categorized list of available algorithms.
- **`/algorithms/:slug` (Algorithm Details)**: Dedicated page for visualizing a specific algorithm.
- **`/about` (Optional)**: Guide on how to use the visualizer.

## Algorithm Page Contract

To ensure consistency, every algorithm page implements a shared UI pattern:

1.  **Canvas Panel**: The primary visualization area (Canvas 2D or SVG). Visualizes the data structures and algorithm steps.
2.  **Inputs Panel**: Algorithm-specific configuration (e.g., array size, custom values, graph nodes).
3.  **Controls Panel**: Standard playback controls:
    - Play / Pause
    - Step Forward / Backward
    - Reset
    - Speed Slider
    - Load Example / Randomize
4.  **State Readout**: Displays the current step number, a text description of the operation, and key variable values (i.e., local variables like `i`, `j`).

## Data Flow: Step Generators

Algorithms are implemented as pure **frame generators** that produce a sequence of immutable visualization steps. Route pages are thin wrappers that compose shared playback/state hooks with the correct generator and visualizer.

- **Step**: An immutable snapshot or a defined patch event describing the state of the algorithm at a specific moment.
- **Replayability**: The UI consumes these steps to render the visualization at any specific index, allowing for reliable forward/backward navigation.
- **Playback Layer**: Shared hooks manage scrubbing, stepping, speed, randomization, and audio so sorting pages do not duplicate the same control logic.

## File Structure

```
src/
├── pages/                # Thin route/page wrappers
├── algorithms/           # Metadata plus pure algorithm/frame generators
│   └── sorting/
│       ├── definitions/  # Single-file sorting algorithm definitions
│       ├── shared/       # Cross-algorithm helpers and utilities
│       └── */            # Multi-file algorithms with local helpers/phases
├── components/           # Shared UI scaffolds and visualizers
├── hooks/                # Shared playback/state hooks
├── lib/                  # General utilities
└── types/                # Shared type contracts
```
