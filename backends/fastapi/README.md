# Polyglot Powerlifting API (FastAPI)

This is the Python backend for the polyglot powerlifting calculator. It calculates powerlifting coefficients (Wilks, DOTS, IPF GL, Reshel) and securely saves user history to Supabase.

## 🚀 Key Features
- **Clean Architecture**: Implementation of Repository and Service Layer patterns.
- **Dependency Injection**: Modular components via FastAPI's `Depends` system.
- **Structured Logging**: Production-grade observability with `structlog`.
- **Global Error Handling**: Centralized management of `DomainException` for consistent API responses.
- **Type Safety**: Pydantic v2 models for request validation and response schemas.

## 🛠️ Local Development

### 1. Environment Variables
Copy the `.env.example` file to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```
Standardized on:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 2. Running the Server
FastAPI dev server via `uv`:
```bash
uv run fastapi dev main.py
```

## 🏗️ Architecture
The backend follows an enterprise-grade pattern for testability:
- **Repositories**: `repositories/` isolates all database logic.
- **Services**: `services/` encapsulates business logic and orchestration.
- **Middleware**: Global exception handling and request logging.

## 🧪 Testing
Run the pytest suite:
```bash
# From this directory
uv run pytest

# Or from root
make api-test
```

## 🐳 Docker / Deployment
The API is containerized for deployment (e.g., to Render).
```bash
podman build -t polyglot-api .
```
Interactive Swagger UI is available at `/docs` when running.
# trigger sync
