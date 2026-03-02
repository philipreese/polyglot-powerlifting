SHELL := /bin/bash
.PHONY: dev build test api-dev api-test svelte-dev web-test-e2e web-test-unit gen-types polylifts-build polylifts-test build test web-check

# Starts the FastAPI development server with hot-reloading
api-dev:
	cd backends/fastapi && uv run fastapi dev main.py

# Starts both backend and frontend development servers concurrently
dev:
	make -j 2 api-dev svelte-dev

# Runs the complete pytest suite and Ruff linter for the FastAPI backend
api-test:
	cd backends/fastapi && uv run ruff check . && uv run pytest

# Starts the SvelteKit development server with hot-reloading
svelte-dev:
	cd frontends/svelte-web && npx pnpm run dev

# Runs the SvelteKit End-to-End browser tests (Playwright)
web-test-e2e:
	cd frontends/svelte-web && npx pnpm run test:e2e

# Runs the SvelteKit Unit test suite (Vitest + jsdom)
web-test-unit:
	cd frontends/svelte-web && npx pnpm run test:unit

# Generates frontend TypeScript schemas based on the FastAPI OpenAPI spec
gen-types:
	cd frontends/svelte-web && npx pnpm run gen-types && npx prettier --write src/lib/core/schemas/openapi.ts

# Builds the shared polylifts package
polylifts-build:
	cd packages/polylifts && npx pnpm run build

# Runs unit tests for the shared polylifts package
polylifts-test:
	cd packages/polylifts && pnpm run test

# Runs SvelteKit type checking
web-check:
	cd frontends/svelte-web && pnpm run check

# Builds everything for production using Turborepo
build:
	pnpm build

# Runs the complete verification suite using Turborepo
test:
	pnpm test
