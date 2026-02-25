# Polyglot Stack Learning Project
## App: Powerlifting Coefficient Calculator

Calculate and track Wilks, DOTS, IPF GL, and Reshel scores based on bodyweight, gender, equipment, and lift totals. History persists locally when anonymous; syncs to the cloud when logged in.

## Developer Background
- **Strong**: C#, MAUI, Git  
- **Beginner/Intermediate**: Svelte 5, TypeScript, Python, FastAPI, OpenAPI, linting  
- **Learning goals**: SvelteKit (full-stack), Flutter/Dart, React Native + Next.js, WSL/Linux environment setup  
- **Hardware**: Windows PC, Android phone (no iOS device)
- **TypeScript from day one** — no plain JS anywhere

---

## AI Collaboration Guidelines
- **Explain Everything**: The AI must explain *what* commands it runs, *how* tools work under the hood (like SSH, WSL, or networking), and *why* specific approaches are chosen. No "black box" magic. The goal is deep understanding. The AI must explain EVERY step before moving on, avoiding large dumps of undefined code.
- **Commit Frequency**: The AI should commit frequently, particularly separating "Initialization/Scaffolding" steps from "Configuration/Styling" steps so the Git history serves as a clean learning log.
- **Explicit Permission**: The AI must NEVER commit or push code to Git without explicitly asking the user for permission first.
- **Industry Best Practices**: The AI must use and explain modern design patterns (e.g., repository pattern, dependency injection, middleware) rather than taking quick-and-dirty shortcuts. Code should be clean, modular, and testable from the start.

---

## Auth + Storage Pattern
```
Anonymous  →  localStorage / SharedPreferences  →  clearable with one tap
Logged in  →  Supabase (free PostgreSQL + Auth)  →  persists across devices
First login → prompt to migrate local history to account
```

**Why Supabase (free tier):**
- PostgreSQL — familiar concepts, works with FastAPI/SQLAlchemy
- Auth built in (email/password + Google/GitHub OAuth)
- REST API auto-generated from schema — no backend needed for simple queries
- Row Level Security — users only see their own data
- Free: 500MB DB, 50k monthly active users

---

## Data Model
```sql
-- Supabase table (same shape used for local storage)
lifts (
  id          uuid primary key,
  user_id     uuid references auth.users,  -- null = anonymous
  created_at  timestamptz,
  bodyweight  numeric,
  gender      text,        -- 'male' | 'female'
  equipment   text,        -- 'raw' | 'single-ply' | 'multi-ply'
  squat       numeric,
  bench       numeric,
  deadlift    numeric,
  total       numeric,     -- computed: squat + bench + deadlift
  wilks       numeric,
  dots        numeric,
  ipf_gl      numeric,
  reshel      numeric
)
```

---

## API Contract (define before any code)
```
POST   /lifts          calculate + save (or just return if anonymous)
GET    /lifts          list history (requires auth header or local)
DELETE /lifts/{id}     delete one entry
DELETE /lifts          clear all history

POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

Frontends send `Authorization: Bearer <token>` when logged in. Anonymous requests use local storage only — the API is not called for history at all in anonymous mode.

---

## Repository Structure
```
/spec
  openapi.yaml         ← define first
  coefficients.md      ← formula reference (Wilks, DOTS, IPF GL, Reshel)

/backends
  /fastapi             ← Python (familiar, build first)
  /nextjs              ← TypeScript (Next.js API routes)

/frontends
  /sveltekit           ← Phase 1
  /flutter             ← Phase 2
  /react-native        ← Phase 3
```

---

## Prerequisites — Tools, Services & Setup

> Install these **just-in-time** per phase — don't install everything on day one.

### Phase 0 (before any code)
We will use **WSL (Windows Subsystem for Linux)** for the backend and web stacks (FastAPI, SvelteKit, Next.js) because it closely mirrors production servers and is the industry standard. Later, for mobile apps (Flutter/React Native), we might use native Windows to easily bridge to your Android phone.

| What | Why | How |
|---|---|---|
| **WSL 2 (Ubuntu)** | Core Linux environment | Open PowerShell as Admin: `wsl --install` |
| **Antigravity Editor**| Connects your editor to Linux | Use the built-in remote connection to WSL |
| **Git** | Version control | Pre-installed in Ubuntu; verify with `git --version` |
| **SSH key** | Secure Git auth | `ssh-keygen -t ed25519` **inside** the WSL terminal |
| **Node.js (LTS)** | JS/TS runtime | Install via `nvm` (Node Version Manager) inside WSL |
| **pnpm** | Fast Node package manager | `npm install -g pnpm` (after Node is installed) |
| **Python 3.12+** | FastAPI runtime | Pre-installed, or use `sudo apt install python3` |
| **uv** | Python package/env manager | `curl -LsSf https://astral.sh/uv/install.sh \| sh` inside WSL |
| **Docker Desktop** | Containerization | Install on Windows, go to Settings -> Resources -> WSL Integration to enable it for Ubuntu |

### Phase 0 (signups — all free tier)
| Service | Why | URL |
|---|---|---|
| **GitHub** | Repo hosting, CI/CD | [github.com](https://github.com) (you have this) |
| **Supabase** | Database + Auth | [supabase.com](https://supabase.com) → New Project |
| **Vercel** | Web deployment | [vercel.com](https://vercel.com) → Sign in with GitHub |
| **Render** | FastAPI deployment | [render.com](https://render.com) → Sign in with GitHub |
| **Sentry** | Error monitoring (Phase 6) | [sentry.io](https://sentry.io) → Sign up free |

### Phase 1 (FastAPI)
| What | Why | How |
|---|---|---|
| **Ruff** | Python linter/formatter | `uv tool install ruff` |
| **pytest** | Python test runner | Added to `pyproject.toml` as dev dependency |

### Phase 2 (SvelteKit)
| What | Why | How |
|---|---|---|
| **Playwright** | E2E browser testing | `pnpm create playwright` (installs browsers automatically) |

### Phase 4 (React Native)
| What | Why | How |
|---|---|---|
| **Expo CLI** | React Native toolchain | `pnpm install -g expo-cli` |
| **Expo Go app** | Run on phone | Install from Google Play Store on your Android |

### Phase 5 (Flutter)
| What | Why | How |
|---|---|---|
| **Flutter SDK** | Dart + Flutter framework | [flutter.dev/get-started](https://flutter.dev/docs/get-started/install/windows) or `winget install Google.Flutter` |
| **Android Studio** | Android SDK + emulator (optional if using physical phone) | [developer.android.com/studio](https://developer.android.com/studio) |

---

## Sequential Learning Phases (Living Checklist)

> **Note**: This plan will be stored in the root of your new repository as `LEARNING_PLAN.md`. We will check items off as `[x]` as we complete them, and append new learning requests to the appropriate phase as they arise.

### Phase 0 — Prep & Infrastructure (Do this before coding)
- [x] **Git over SSH:** Generate an SSH keypair (`ssh-keygen`), add the public key to GitHub, and clone the empty repo using the `git@github.com` URL instead of HTTPS. Understand the difference.
- [x] **Spec & Design:** Document all 4 coefficient formulas (We will adopt a **Code-First API Design**, using FastAPI's Pydantic models to auto-generate our OpenAPI spec).
- [x] **Branding:** Define color palette (primary/surface/text), typography choices, and icon set (e.g. Material or Lucide) in a central design document (or Figma) so all 3 apps look like the same product
- [x] **Repo Setup:** Initialize Git (via SSH clone), create `.gitignore`, set up `pnpm` workspaces
- [x] **Environment:** Create `.devcontainer/` so your tools (Node, Python, Flutter) are consistent
- [x] **Database:** Set up Supabase free tier, create `lifts` table schema, enable Auth
- [x] **DX:** Add Prettier/ESLint configs for JS/TS, Ruff for Python

### Phase 1 — FastAPI Backend (The Foundation)
- [x] **Branching:** Create branch `feat/fastapi-init` from `main`
- [x] **Architecture:** Build nested `README.md` and `Makefile`, then organize files into `/routes`, `/models`, and `/services`
- [x] **Core:** Implement `POST`, `GET`, and `DELETE` /lifts endpoints based on your OpenAPI spec
- [x] **Validation:** Use **Pydantic v2** for robust request/response validation
- [x] **Logic:** Implement all 4 powerlifting formulas (Wilks, DOTS, IPF GL, Reshel) into `formulas.py`
- [x] **Database:** Configure `supabase` with `.env` and write the insertion/retrieval row logic
- [x] **Auth:** Verify Supabase JWTs in middleware to protect the history endpoints
- [x] **Documentation:** Explore the auto-generated Swagger UI at `/docs`
- [x] **Security:** Configure CORS properly so the web frontends can call it
- [x] **Containerization:** Write a `Dockerfile` using `uv` to build the API
- [x] **Commit:** Use conventional commits (e.g., `feat: add calculate endpoint`, `chore: add dockerfile`)
- [x] **Merge:** Open a Pull Request, review your own diff, merge into `main`
- [x] **CI/CD:** Set up GitHub Actions on `main` to run Ruff (linting) and pytest, then deploy to Render

### Phase 2 — SvelteKit Frontend (Familiar Territory)
- [x] **Branching:** Create branch `feat/svelte-web` from `main`
- [x] **Setup:** Initialize SvelteKit with TypeScript and Tailwind
- [ ] **State:** Use Svelte 5 runes + stores for the calculator state
- [ ] **Offline/Local:** Implement `localStorage` persistence for anonymous users
- [ ] **Integration:** Connect to FastAPI; build the login flow with Supabase Auth
- [ ] **Type Sync:** Write a script using `openapi-typescript` to auto-generate Svelte TypeScript types from the FastAPI `openapi.json`
- [ ] **Validation:** Add **Zod** to validate form inputs before sending to API
- [ ] **Testing:** Write your first **Playwright** E2E test (e.g., "User can calculate Wilks without logging in")
- [ ] **Merge:** Open PR, merge `feat/svelte-web` into `main`
- [ ] **Deploy:** Push `main` to Vercel (zero-config) and test the live FastAPI connection

### Phase 3 — Next.js Backend (The Swap)
- [ ] **Branching:** Create branch `feat/nextjs-api`
- [ ] **Core:** Recreate the exact same endpoints using Next.js API Routes (TypeScript)
- [ ] **Validation:** Use **Zod** to validate incoming JSON (mirroring Pydantic's role)
- [ ] **Merge:** Open PR, merge into `main`
- [ ] **The "Aha" Moment:** Go to Vercel, change your SvelteKit `VITE_API_URL` env var from Render (FastAPI) to Vercel (Next.js), and watch the frontend work perfectly.

### Phase 4 — React Native (Expo) - Mobile Introduction
- [ ] **Branching:** Create branch `feat/rn-mobile`
- [ ] **Setup:** Initialize Expo with TypeScript and Expo Router
- [ ] **UI:** Rebuild your components using `<View>`, `<Text>`, and native styling
- [ ] **State:** Learn **Zustand** for global state (auth status, history cache)
- [ ] **Data Fetching:** Introduce **TanStack Query** (React Query) to handle API calls, loading states, and caching
- [ ] **Storage:** Swap `localStorage` for React Native's `AsyncStorage`
- [ ] **Testing:** Run tests via Expo Go on your physical Android phone
- [ ] **Merge:** Open PR, merge into `main`

### Phase 5 — Flutter Frontend (The Benchmark)
- [ ] **Branching:** Create branch `feat/flutter-mobile`
- [ ] **Setup:** Initialize Flutter project (Dart)
- [ ] **State:** Implement **Riverpod** for robust state management
- [ ] **Storage:** Use `shared_preferences` for anonymous local history
- [ ] **Documentation:** Scatter `///` comments and run `dart doc` to see the generated site
- [ ] **Testing:** Write a Flutter Widget Test for the calculator UI
- [ ] **Comparison:** Run it on your Android phone and compare the gesture feel and animation smoothness to React Native
- [ ] **Merge:** Open PR, merge into `main`

### Phase 6 — Polish & Pro-Level Practices (Apply to all)
- [ ] **Branching:** Create branch `chore/observability-and-polish`
- [ ] **Monitoring:** Add **Sentry** SDKs to all 3 frontends and FastAPI. Force a crash and view the stack trace in Sentry.
- [ ] **Analytics/Performance:** Run a Lighthouse audit on SvelteKit; check `pnpm build --analyze` on Next.js
- [ ] **Accessibility:** Add `axe-core` to your Playwright tests to catch missing labels and bad contrast
- [ ] **Release:** Set up `release-please` for automated semantic versioning and CHANGELOG generation based on your conventional commits
- [ ] **Merge:** PR and merge into `main`. Watch `release-please` automatically tag `v1.0.0`

---

## Key Tech Notes

| Tech | Role | Like... |
|---|---|---|
| Supabase | Free Postgres + Auth + REST | Firebase but SQL |
| SvelteKit | Full-stack web framework | Svelte 5 + routing + SSR |
| Next.js API routes | Backend endpoints in TypeScript | FastAPI but TS |
| Node.js | JS runtime | .NET CLR |
| Dart | Flutter's language | C# (strongly typed, async/await) |
| Expo | React Native tooling | MAUI project templates |

---

## Free Deployment

| Service | Where | Notes |
|---|---|---|
| SvelteKit / Next.js | **Vercel** | Zero-config GitHub integration, free |
| FastAPI | **Render** | Free tier, cold starts on idle |
| Flutter web | Vercel | `flutter build web` → deploy |
| Flutter Android | APK sideload / Expo Go | Free for dev |
| React Native | **Expo Go** (dev) / EAS Build (prod) | Free tier |

> **GitHub Pages** is static-only. Works for pre-built Flutter web or Next.js static export, but you lose SSR. Vercel is strictly better and still free.

---

## CI/CD with GitHub Actions (free for public repos)
Each service gets its own workflow file in `.github/workflows/`. Path filters ensure only the changed service deploys:

```yaml
on:
  push:
    paths:
      - 'backends/fastapi/**'   # only runs when this folder changes
```

**Pipeline per service**: lint → test → build → deploy. Secrets (API keys, Supabase URL) stored in GitHub Secrets, never in code.

---

## Testing Strategy

| Level | SvelteKit / Next.js | Flutter | React Native |
|---|---|---|---|
| Unit | Vitest / Jest | `flutter_test` | Jest |
| Component | Svelte/React Testing Library | Widget tests | React Testing Library |
| Integration | Supertest / pytest | Integration tests | — |
| E2E | **Playwright** | Maestro | Maestro |

Learn Playwright early — it covers all web frontends and is the current industry standard.

---


## Is This Good React Job Prep?
Yes — Phase 4 (React Native + Next.js) directly targets React developer skills:
hooks, component patterns, Zustand, TanStack Query, Playwright, and testing.
Doing SvelteKit first helps — it teaches the same mental model with less boilerplate,
so React clicks faster when you get there.

---

## Recommended Start
1. Create `polyglot-powerlifting/` repo on GitHub (public — Vercel + Supabase free tiers prefer it)
2. Generate an SSH key locally and add it to GitHub (we will cover this together! Just ask)
3. Open as new workspace and clone the repo via SSH
4. Begin: *"Let's start Phase 0. Help me set up my SSH key to clone the repo, and let's copy the `polyglot_learning_plan.md` into the repo as `LEARNING_PLAN.md`!"*
