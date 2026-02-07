# Contributing to Algos

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **Algos**, which is hosted in the [Main Repository] on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [React](https://react.dev) + [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Linting**: ESLint + Prettier

## specific

## Getting Started

1.  **Fork and Clone**: Fork the repository and clone it locally.

    ```bash
    git clone https://github.com/YOUR-USERNAME/algos.git
    cd algos
    ```

2.  **Install Dependencies**: We use `bun` for package management.

    ```bash
    bun install
    ```

3.  **Run Development Server**:

    ```bash
    bun run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Development Workflow

### Linting and Formatting

We use **ESLint** and **Prettier** to maintain code quality. Configuration is enforced via **Husky** pre-commit hooks.

- **Lint**: `bun run lint`
- **Format**: `bunx prettier --write .`

### Commit Convention

We follow the **Conventional Commits** specification. Please format your commit messages as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Example:**

```
feat(sorting): add merge sort visualization
fix(bubble-sort): resolve state update issue during animation
chore(husky): add linting to pre-commit hook
```

## Pull Requests

1.  Create a new branch for your feature or fix: `git checkout -b feat/my-feature`
2.  Make your changes and commit them following the conventions.
3.  Push your branch to your fork.
4.  Submit a Pull Request to the `main` branch of the original repository.
5.  Wait for review and address any feedback.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
