import bcrypt

from fastapi import HTTPException, Request


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(rounds=12)
    ).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8")
        )

    except (ValueError, TypeError, AttributeError):
        return False


def require_auth(request: Request) -> dict:
    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Debes iniciar sesión."
        )

    try:
        user_id = int(user_id)

    except (TypeError, ValueError):
        request.session.clear()

        raise HTTPException(
            status_code=401,
            detail="Sesión inválida."
        )

    return {
        "id_usuario": user_id
    }