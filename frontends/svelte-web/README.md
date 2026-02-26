# Polyglot Powerlifting Frontend (Sveltekit)

A high-performance coefficients calculator built with **Svelte 5** and **TypeScript**, following a Feature-Sliced architecture.

## 🚀 Key Features
- **Svelte 5 Runes**: Modern state management using `$state`, `$derived`, and `$effect`.
- **Feature-Sliced Architecture**: Organized by domain (calculator, history, auth) for maximum scalability.
- **Offline-First Sync**: Anonymous calculations are persisted to `localStorage` and synchronized to the cloud upon login.
- **Type-Safe API**: End-to-end safety via Zodios and OpenAPI schema generation.

## 🛠️ Setup & Development

### 1. Environment Variables
Copy the example file and configure your Supabase instance:
```bash
cp .env.example .env
```
Ensure you use the standardized names:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 2. Dependencies
```bash
pnpm install
```

### 3. Local Development
```bash
pnpm run dev
```

### 4. Code Generation
If the backend API changes, update the frontend types using:
```bash
# From the root directory
make gen-types
```

## 🧪 Testing
We maintain high quality through a mix of unit and E2E tests:
- **Unit (Vitest)**: `pnpm run test:unit`
- **E2E (Playwright)**: `pnpm run test:e2e`

## 🏗️ Architecture
- `/src/lib/features`: Encapsulated domain logic.
- `/src/lib/core`: Shared infrastructure (API client, Supabase init).
- `/src/lib/components/ui`: Reusable, atomic UI components.
