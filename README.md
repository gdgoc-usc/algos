<div align="center">
  <img src="public/logo.png" alt="GDG Logo" width="48"  />
  <h1>Algorithms Visualizer</h1>
  <p>
    <strong>Google Developer Groups on Campus - University of San Carlos</strong>
  </p>
  <p>
    Visualize, interact, and understand complex data structures and algorithms with our next-gen step-by-step visualizer.
  </p>
</div>

## 🚀 Features

- **Step-by-Step Visualization**: Play, pause, step forward/back, and reset execution.
- **Interactive Controls**: Adjust speed, randomize inputs, and load examples.
- **Dedicated Algorithm Pages**: Focused environment for each algorithm (Sorting, Searching, Graphs, etc.).
- **Consistent UI**: Standardized "Page Contract" ensuring a familiar experience across all visualizations.
- **Community Driven**: Built and maintained by the GDG-USC community.

## 🛠️ Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: Tailwind CSS + Google Brand Colors
- **Typography**: Excalifont (Hand-drawn aesthetic)

## 🏎️ Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- Bun (Preferred package manager)

### Installation

```bash
bun install
```

### Running Locally

```bash
bun dev
```

The application will be available at `http://localhost:5173`.

## 🤝 Contributing

We welcome contributions from the community! This project uses **Husky** and **Commitlint** to ensure code quality.

### Guidelines

1. **Conventional Commits**: All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.
   - ✅ `feat: add bubble sort visualization`
   - ✅ `fix: resolve mobile layout issue`
   - ❌ `added stuff`
2. **Linting & Formatting**: Code is automatically linted and formatted on commit using `eslint` and `prettier`.
3. **Type Checking**: A strict type check runs before you push (`pre-push` hook).

### Steps to Participate

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes.
4. Commit your changes: `git commit -m "feat: your feature"`.
5. Push to the branch: `git push origin feature/your-feature-name`.
6. Submit a Pull Request.

## 📚 Documentation

For more detailed information, please refer to the documentation:

- [Architecture & Information Architecture](docs/architecture.md)
- [Branding & Design Guidelines](docs/branding.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Project Source of Truth](docs/project_source_of_truth.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the GDG on Campus - University of San Carlos Community
</div>
