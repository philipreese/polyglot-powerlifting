.PHONY: api-dev api-test

# Starts the FastAPI development server with hot-reloading
api-dev:
	cd backends/fastapi && uv run fastapi dev main.py

# Runs the complete pytest suite and Ruff linter for the FastAPI backend
api-test:
	cd backends/fastapi && uv run ruff check . && uv run pytest
