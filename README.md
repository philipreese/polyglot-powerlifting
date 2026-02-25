# Polyglot Powerlifting

A multi-language powerlifting coefficient calculator building upon SvelteKit, FastAPI, Next.js, React Native, and Flutter.

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

## Developer Environment Setup

This project supports multiple development workflows depending on your operating system and preferences.

### 1. WSL (Windows Subsystem for Linux) - **Recommended**
If you are on Windows, developing natively inside WSL 2 (Ubuntu) is the recommended approach for the web and backend stacks.

**Prerequisites:**
1. Install WSL 2 and Ubuntu (`wsl --install`).
2. Install [Node.js 20+](https://nodejs.org/) via `nvm`.
3. Install [pnpm](https://pnpm.io/): `npm install -g pnpm`.
4. Install Python 3.12+ and [uv](https://github.com/astral-sh/uv).
5. Clone this repository directly into your WSL filesystem (e.g., `~/workspace/polyglot-powerlifting`).

### 2. DevContainer (Docker) - Cross-Platform
If you want a guaranteed, pre-configured environment without installing Node or Python globally, use the included DevContainer. This works uniformly across Windows, macOS, and Linux.

**Prerequisites:**
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Install VS Code and the **Dev Containers** extension.
3. Open the repository in VS Code.
4. When prompted, click **Reopen in Container** (or use the Command Palette).
   - Docker will build a pristine Ubuntu Linux container with Node 20, Python 3.12, `pnpm`, and all required VS Code extensions automatically installed.

### 3. Native macOS / Linux
You can develop directly on your host machine without WSL or Docker.

**Prerequisites:**
1. Install Node.js 20+ and `pnpm`.
2. Install Python 3.12+ and `uv`.
3. Clone the repository and run `pnpm install` at the root.

---

*See `LEARNING_PLAN.md` for the complete architectural roadmap and progress checklist.*