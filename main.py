import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.sessions import SessionMiddleware

from connect import db_connection
from rutas import ai, auth, plantillas, portafolios

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent

SESSION_SECRET = os.getenv('SESSION_SECRET')
if not SESSION_SECRET:
    raise RuntimeError('Falta SESSION_SECRET en .env')

app = FastAPI(title='PortafolioGen API', version='5.1.1')
app.add_middleware(GZipMiddleware, minimum_size=700)
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    session_cookie='portafoliogen_session',
    max_age=60 * 60 * 8,
    same_site='lax',
    https_only=False,
)

app.include_router(auth.router)
app.include_router(portafolios.router)
app.include_router(plantillas.router)
app.include_router(ai.router)


@app.middleware('http')
async def add_response_headers(request, call_next):
    response = await call_next(request)
    response.headers.setdefault('X-Content-Type-Options', 'nosniff')
    response.headers.setdefault('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.setdefault('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    if request.url.path.startswith('/js/'):
        response.headers.setdefault('Cache-Control', 'public, max-age=3600')
    elif request.url.path == '/':
        response.headers.setdefault('Cache-Control', 'no-cache')
    return response


@app.get('/api/health', tags=['Estado'])
def health():
    try:
        with db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
                cursor.fetchone()
        return {'ok': True, 'database': 'connected'}
    except Exception as exc:
        print(f'[DB ERROR] health: {exc}')
        return {'ok': False, 'database': 'disconnected'}


@app.get('/', include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / 'index.html')


app.mount('/js', StaticFiles(directory=BASE_DIR / 'js'), name='js')


@app.on_event('startup')
def validate_environment():
    required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET']
    missing = [key for key in required if not os.getenv(key)]
    if missing:
        raise RuntimeError(f"Faltan variables de entorno: {', '.join(missing)}")
