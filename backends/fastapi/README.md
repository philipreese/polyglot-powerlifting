# Polyglot Powerlifting API (FastAPI)

This is the Python backend for the polyglot powerlifting calculator. It is responsible for calculating powerlifting coefficients (Wilks, DOTS, IPF GL, Reshel) and securely saving user history to Supabase.

## Requirements
*   [uv](https://docs.astral.sh/uv/) (The ultra-fast Python package manager)

## Local Development

### 1. Environment Variables
Copy the `.env.example` file to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```
*(Ask your team or check your Supabase dashboard for the `SUPABASE_URL` and `SUPABASE_KEY`).*

### 2. Running the Server
Because we use `uv`, you don't need to manually activate virtual environments. You can run the FastAPI development server with one command:

```bash
uv run fastapi dev main.py
```
*(This is the modern, built-in CLI for FastAPI that automatically includes hot-reloading!)*

### 3. Viewing the API Docs
Once the server is running, visit:
*   **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   **Alternative ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
