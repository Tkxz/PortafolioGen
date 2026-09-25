import re

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from connect import db_connection
from security import hash_password, verify_password

router = APIRouter(prefix='/api/auth', tags=['Autenticación'])


class RegisterData(BaseModel):
    name: str
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


def normalize_email(email: str) -> str:
    return str(email or '').strip().lower()


def _public_user(row: dict) -> dict:
    return {
        'id_usuario': int(row['id_usuario']),
        'name': row['name'],
        'email_user': row['email_user'],
        'portafolios': int(row.get('portafolios', 0)),
    }


@router.post('/register', status_code=201)
def register(data: RegisterData, request: Request):
    name = data.name.strip()
    email = normalize_email(data.email)
    password = data.password

    if not 2 <= len(name) <= 120:
        raise HTTPException(status_code=400, detail='El nombre debe tener entre 2 y 120 caracteres.')
    if len(email) > 190 or not re.match(r'^\S+@\S+\.\S+$', email):
        raise HTTPException(status_code=400, detail='Correo electrónico inválido.')
    if not 8 <= len(password) <= 72:
        raise HTTPException(status_code=400, detail='La contraseña debe tener entre 8 y 72 caracteres.')

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT id_formulario FROM Formulario WHERE email = %s LIMIT 1', (email,))
                if cursor.fetchone():
                    raise HTTPException(status_code=409, detail='Ya existe una cuenta con ese correo.')

                cursor.execute(
                    'INSERT INTO Formulario (name_user, email, password) VALUES (%s, %s, %s)',
                    (name, email, hash_password(password)),
                )
                formulario_id = cursor.lastrowid
                cursor.execute(
                    'INSERT INTO Usuarios (formulario_id, name, email_user) VALUES (%s, %s, %s)',
                    (formulario_id, name, email),
                )
                user_id = cursor.lastrowid
            connection.commit()
        except HTTPException:
            connection.rollback()
            raise
        except Exception as exc:
            connection.rollback()
            print(f'[DB ERROR] register: {exc}')
            raise HTTPException(status_code=500, detail='No se pudo crear la cuenta.')

    user = {'id_usuario': user_id, 'name': name, 'email_user': email, 'portafolios': 0}
    request.session.clear()
    request.session['user'] = user
    return {'user': user}


@router.post('/login')
def login(data: LoginData, request: Request):
    email = normalize_email(data.email)
    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    '''SELECT f.password, u.id_usuario, u.name, u.email_user, u.portafolios
                       FROM Formulario f
                       INNER JOIN Usuarios u ON u.formulario_id = f.id_formulario
                       WHERE f.email = %s LIMIT 1''',
                    (email,),
                )
                row = cursor.fetchone()
        except Exception as exc:
            print(f'[DB ERROR] login: {exc}')
            raise HTTPException(status_code=500, detail='No se pudo iniciar sesión.')

    if not row or not verify_password(data.password, row['password']):
        raise HTTPException(status_code=401, detail='Correo o contraseña incorrectos.')

    user = _public_user(row)
    request.session.clear()
    request.session['user'] = user
    return {'user': user}


@router.post('/logout', status_code=204)
def logout(request: Request):
    request.session.clear()
    return None


@router.get('/me')
def me(request: Request):
    user = request.session.get('user')
    if not user:
        return {'user': None}

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    'SELECT id_usuario, name, email_user, portafolios FROM Usuarios WHERE id_usuario = %s LIMIT 1',
                    (user['id_usuario'],),
                )
                row = cursor.fetchone()
        except Exception as exc:
            print(f'[DB ERROR] me: {exc}')
            raise HTTPException(status_code=500, detail='No se pudo cargar el usuario.')

    if not row:
        request.session.clear()
        return {'user': None}

    fresh_user = _public_user(row)
    request.session['user'] = fresh_user
    return {'user': fresh_user}
