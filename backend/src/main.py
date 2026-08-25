import sys
import os

# Adiciona o diretório src ao sys.path para importações relativas limpas
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from adapters.database.models import init_db
from adapters.api.routes.api_routes import router as api_router

app = FastAPI(
    title="PingoSolar API — Dessalinização Solar & PIML",
    description="API de telemetria IoT, inferência Physics-Informed ML (Dunkle) e Gêmeo Digital",
    version="1.0.0"
)

# Habilita CORS para o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "system": "PingoSolar IoT & PIML Core API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
