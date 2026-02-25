from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.lifts import router as lifts_router

app = FastAPI(
    title="Polyglot Powerlifting API",
    description="Auto-generated Code-First API for calculating powerlifting coefficients.",
    version="0.1.0"
)

# Allow our SvelteKit and React Native apps to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lifts_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Polyglot Powerlifting API. View docs at /docs"}
