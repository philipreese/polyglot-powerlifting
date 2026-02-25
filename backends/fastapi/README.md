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

### 4. Testing the Production Container
To verify the Docker image works locally before deploying to Render, you can use Podman (a drop-in replacement for Docker):

1. **Build the Image:**
```bash
podman build -t polyglot-api .
```

2. **Run the Container:**
Pass in your keys (the image requires them) and map port 8000. 
*(Note: If you are running WSL, you must use `--network=host` instead of `-p 8000:8000` so Windows can see the port).*
```bash
podman run -p 8000:8000 \
  -e SUPABASE_URL="YOUR_URL_HERE" \
  -e SUPABASE_KEY="YOUR_PUBLISHABLE_KEY_HERE" \
  polyglot-api
```
The API will then be available at `http://127.0.0.1:8000`.
