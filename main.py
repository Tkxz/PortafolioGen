import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from connect import db_connection
from rutas import ai, auth, portafolios

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="PortafolioGen API",
    version="5.0.0"
)

SESSION_SECRET = os.getenv("SESSION_SECRET")

if not SESSION_SECRET:
    raise RuntimeError("Falta SESSION_SECRET en el archivo .env")

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    session_cookie="portafoliogen_session",
    max_age=60 * 60 * 8,
    same_site="lax",
    https_only=False
)

app.include_router(auth.router)
app.include_router(portafolios.router)
app.include_router(ai.router)


@app.get("/api/health", tags=["Estado"])
def health():
    try:
        with db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()

        return {
            "ok": True,
            "database": "connected"
        }

    except Exception as exc:
        print(f"[DB ERROR] health: {exc}")

        return {
            "ok": False,
            "database": "disconnected"
        }


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / "index.html")


app.mount(
    "/js",
    StaticFiles(directory=BASE_DIR / "js"),
    name="js"
)