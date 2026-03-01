from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware.logging import (
    DomainException,
    domain_exception_handler,
    setup_logging,
    universal_exception_handler,
)
from routes.health import router as health_router
from routes.lifts import router as lifts_router

# Initialize structured logging
setup_logging()

app = FastAPI(
    title="Polyglot Powerlifting API",
    description="Auto-generated Code-First API for calculating powerlifting coefficients.",
    version="0.3.0"
)

# Exception handlers
app.add_exception_handler(DomainException, domain_exception_handler)
app.add_exception_handler(Exception, universal_exception_handler)

# Allow our SvelteKit and React Native apps to talk to this backend
# Note: allow_origins=["*"] is restricted when allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Set to False since we use Authorization headers, not Cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lifts_router)
app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Polyglot Powerlifting API. View docs at /docs"}

