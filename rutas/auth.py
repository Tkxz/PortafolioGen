import re

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from connect import db_connection
from security import hash_password, verify_password

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


class RegisterData(BaseModel):
    name: str
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


def normalize_email(email: str) -> str:
    return str(email or "").strip().lower()


@router.post("/register", status_code=201)
def register(data: RegisterData, request: Request):
    name = data.name.strip()
    email = normalize_email(data.email)
    password = data.password

    if len(name) < 2 or len(name) > 120:
        raise HTTPException(
            status_code=400,
            detail="El nombre debe tener entre 2 y 120 caracteres."
        )

    if len(email) > 190 or not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(
            status_code=400,
            detail="Correo electrónico inválido."
        )

    if len(password) < 8 or len(password) > 72:
        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener entre 8 y 72 caracteres."
        )

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:

                cursor.execute(
                    """
                    SELECT id_formulario
                    FROM Formulario
                    WHERE email = %s
                    LIMIT 1
                    """,
                    (email,)
                )

                if cursor.fetchone():
                    raise HTTPException(
                        status_code=409,
                        detail="Ya existe una cuenta con ese correo."
                    )

                password_hash = hash_password(password)

                cursor.execute(
                    """
                    INSERT INTO Formulario
                    (
                        name_user,
                        email,
                        password
                    )
                    VALUES (%s, %s, %s)
                    """,
                    (
                        name,
                        email,
                        password_hash
                    )
                )

                formulario_id = cursor.lastrowid

                cursor.execute(
                    """
                    INSERT INTO Usuarios
                    (
                        formulario_id,
                        name,
                        email_user
                    )
                    VALUES (%s, %s, %s)
                    """,
                    (
                        formulario_id,
                        name,
                        email
                    )
                )

                usuario_id = cursor.lastrowid

            connection.commit()

        except HTTPException:
            connection.rollback()
            raise

        except Exception as exc:
            connection.rollback()

            print(f"[DB ERROR] register: {exc}")

            raise HTTPException(
                status_code=500,
                detail="No se pudo crear la cuenta."
            )

    request.session.clear()
    request.session["user_id"] = usuario_id

    user = {
        "id_usuario": usuario_id,
        "name": name,
        "email_user": email,
        "portafolios": 0
    }

    return {
        "message": "Cuenta creada correctamente.",
        "user": user
    }


@router.post("/login")
def login(data: LoginData, request: Request):
    email = normalize_email(data.email)

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:

                cursor.execute(
                    """
                    SELECT
                        f.id_formulario,
                        f.password,
                        u.id_usuario,
                        u.name,
                        u.email_user,
                        u.portafolios
                    FROM Formulario AS f

                    INNER JOIN Usuarios AS u
                        ON u.formulario_id = f.id_formulario

                    WHERE f.email = %s

                    LIMIT 1
                    """,
                    (email,)
                )

                user = cursor.fetchone()

        except Exception as exc:
            print(f"[DB ERROR] login: {exc}")

            raise HTTPException(
                status_code=500,
                detail="No se pudo iniciar sesión."
            )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos."
        )

    if not verify_password(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos."
        )

    usuario_id = user["id_usuario"]

    user.pop("password", None)
    user.pop("id_formulario", None)

    request.session.clear()
    request.session["user_id"] = usuario_id

    return {
        "message": "Sesión iniciada correctamente.",
        "user": user
    }


@router.post("/logout")
def logout(request: Request):
    request.session.clear()

    return {
        "message": "Sesión cerrada correctamente."
    }


@router.get("/me")
def me(request: Request):
    usuario_id = request.session.get("user_id")

    if not usuario_id:
        return {
            "user": None
        }

    try:
        usuario_id = int(usuario_id)

    except (TypeError, ValueError):
        request.session.clear()

        return {
            "user": None
        }

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:

                cursor.execute(
                    """
                    SELECT
                        id_usuario,
                        name,
                        email_user,
                        portafolios
                    FROM Usuarios
                    WHERE id_usuario = %s
                    LIMIT 1
                    """,
                    (usuario_id,)
                )

                user = cursor.fetchone()

        except Exception as exc:
            print(f"[DB ERROR] me: {exc}")

            raise HTTPException(
                status_code=500,
                detail="No se pudo cargar el usuario."
            )

    if not user:
        request.session.clear()

        return {
            "user": None
        }

    return {
        "user": user
    }