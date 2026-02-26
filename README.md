# Polyglot Powerlifting

A multi-frontend powerlifting coefficient calculator built to learn the modern polyglot stack.

*   [**Learning Plan**](./LEARNING_PLAN.md) - The roadmap and architecture for this project.
*   [**API Specification**](./spec/coefficients.md) - The math and coefficients required for the backend.
*   [**Database Schema**](./spec/schema.sql) - The Supabase PostgreSQL initialization script.
*   [**Branding Guide**](./docs/branding.md) - The typography, colors, and styling rules for all frontends.

## Project Structure

This is a monorepo managed by `pnpm`. It contains the following core directories:

- `/spec`: API specifications (OpenAPI) and math formulas for coefficients.
- `/backends`: 
  - FastAPI (Python)
  - Next.js API Routes (TypeScript)
- `/frontends`:
  - SvelteKit (Web)
  - React Native (Mobile)
  - Flutter (Mobile)

## 🛠️ Useful Commands

The root uses a `Makefile` to simplify common development tasks.

```bash
# Start both API and Svelte dev servers (requires tmux or separate windows)
make api-dev
make svelte-dev

# Run all tests
make api-test
make web-test-unit
make web-test-e2e

# Generate frontend TypeScript types from API spec
make gen-types
```

## Developer Environment Setup

This project supports multiple development workflows depending on your operating system and preferences.

### 1. WSL (Windows Subsystem for Linux) - **Recommended**
If you are on Windows, developing natively inside WSL 2 (Ubuntu) is the recommended approach for the web and backend stacks.

### 2. DevContainer (Docker) - Cross-Platform
If you want a guaranteed, pre-configured environment without installing Node or Python globally, use the included DevContainer.

### 3. Native macOS / Linux
You can develop directly on your host machine without WSL or Docker. Run `pnpm install` at the root.

## Developer Experience (DX)

We maintain unified code formatting across all languages using:
- **EditorConfig**: Standardizes indentations.
- **Prettier**: Formats Web/Mobile code (JS, TS, Svelte).
- **ESLint**: Lints Web/Mobile code.
- **Ruff**: Extremely fast Python linter and formatter.

*See `LEARNING_PLAN.md` for the complete architectural roadmap and progress checklist.*