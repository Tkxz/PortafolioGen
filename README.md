# PortafolioGen - FastAPI + MySQL + NVIDIA API

proyecto con FastAPI, MySQL y generación de contenido mediante la API de NVIDIA.

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
│   ├── ai.py
│   └── plantillas.py
├── js/
│   ├── app.js
│   └── templates.js
├── database/
│   └── schema.sql
└── index.html
```

## 1. Crear la base de datos

Crea la base de datos indicada en `DB_NAME` (por defecto `portafoliogen`) y ejecuta el esquema:

```sql
CREATE DATABASE portafoliogen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p portafoliogen < database/schema.sql
```

El esquema crea las tablas `Formulario`, `Usuarios`, `Portafolios` y `Plantillas`. La columna `html_template` es `MEDIUMTEXT` para guardar el HTML completo generado por la IA. Si ya tienes la tabla `Plantillas`, el script actualiza esa columna sin eliminar los datos existentes. Si `DB_NAME` tiene otro valor, selecciona esa base de datos al ejecutar el script.

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
- La sesión se almacena en una cookie firmada `HttpOnly`.
- JavaScript no puede leer esa cookie, por lo que ya no se guarda ningún token en `localStorage`.
- Las sesiones duran 8 horas y se eliminan al cerrar sesión.

Para producción mediante HTTPS, configura `https_only=True` en `main.py` para que la cookie solo viaje por HTTPS.
