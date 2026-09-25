# PortafolioGen - FastAPI + MySQL + NVIDIA API

Versión del proyecto reestructurada con FastAPI, MySQL y generación de contenido mediante la API de NVIDIA.

La autenticación ya no usa JWT. El inicio de sesión funciona con una cookie `HttpOnly` y un identificador de sesión aleatorio cuyo hash se guarda en MySQL.

## Estructura

```text
portafoliogen-fastapi/
├── main.py
├── connect.py
├── security.py
├── ia.py
├── requirements.txt
├── .env.example
├── rutas/
│   ├── auth.py
│   ├── portafolios.py
│   └── ai.pya
│   └── plantillas.py
├── js/
│   ├── app.js
│   └── templates.js
└── index.html
```

## 1. Crear la base de datos

Ejecuta `database/schema.sql` en MySQL. Además de usuarios y portafolios, se crea la tabla `Sesiones` para mantener sesiones de forma segura sin JWT.

## 2. Variables de entorno

Copia `.env.example` como `.env` con `copy .env.example .env` y completa los datos de MySQL y NVIDIA:

```env
PORT=8000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD_MYSQL
DB_NAME=portafoliogen
NVIDIA_API_KEY=REEMPLAZAR_CON_CLAVE_PERSONAL
NVIDIA_MODEL=google/diffusiongemma-26b-a4b-it
```

## 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 4. Iniciar

```bash
uvicorn main:app --reload --port 8000
```

Abre `http://127.0.0.1:8000`.

La documentación de la API queda en `http://127.0.0.1:8000/docs`.

## Autenticación

- Las contraseñas se guardan con bcrypt.
- Al iniciar sesión se genera un identificador aleatorio con `secrets.token_urlsafe`.
- En MySQL solo se guarda el SHA-256 de ese identificador.
- El navegador recibe el identificador mediante una cookie `HttpOnly`.
- JavaScript no puede leer esa cookie, por lo que ya no se guarda ningún token en `localStorage`.
- Las sesiones duran 8 horas y se eliminan al cerrar sesión.

Para producción mediante HTTPS, cambia `secure=False` por `secure=True` en `rutas/auth.py` para que la cookie solo viaje por HTTPS.
