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

Algorithms are implemented as **generators** or state machines that produce a sequence of "steps".

- **Step**: An immutable snapshot or a defined patch event describing the state of the algorithm at a specific moment.
- **Replayability**: The UI consumes these steps to render the visualization at any specific index, allowing for reliable forward/backward navigation.

## File Structure

```
src/
├── pages/          # Route components (Home, AlgorithmPage)
├── algorithms/     # Algorithm logic (generators, metadata)
├── components/     # Shared UI components (CanvasStage, ControlBar)
├── lib/            # Utilities (randomizers, validators)
└── styles/         # Global styles and font setups
```
