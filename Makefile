SHELL := /bin/bash
.PHONY: dev fastapi-dev fastapi-test svelte-dev nextjs-dev svelte-test-e2e svelte-test-unit gen-types

# Starts the FastAPI development server with hot-reloading
fastapi-dev:
	cd backends/fastapi && uv run fastapi dev main.py

# Starts all development servers concurrently
dev:
	make -j 3 fastapi-dev svelte-dev nextjs-dev

# Runs the complete pytest suite and Ruff linter for the FastAPI backend
fastapi-test:
	cd backends/fastapi && uv run ruff check . && uv run pytest

# Starts the SvelteKit development server with hot-reloading
svelte-dev:
	cd frontends/svelte-web && npx pnpm run dev

# Starts the Next.js backend development server
nextjs-dev:
	cd backends/nextjs && pnpm run dev

# Runs the SvelteKit End-to-End browser tests (Playwright)
svelte-test-e2e:
	cd frontends/svelte-web && npx pnpm run test:e2e

# Runs the SvelteKit Unit test suite (Vitest + jsdom)
svelte-test-unit:
	cd frontends/svelte-web && npx pnpm run test:unit

# Generates frontend TypeScript schemas based on the FastAPI OpenAPI spec
gen-types:
	cd frontends/svelte-web && npx pnpm run gen-types && npx prettier --write src/lib/core/schemas/openapi.ts
