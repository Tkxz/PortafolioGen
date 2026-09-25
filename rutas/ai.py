from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal

from ia import generar_json_habilidades, generar_plantilla
from security import require_auth

router = APIRouter(prefix='/api/ai', tags=['IA'])


class AiRequest(BaseModel):
    text: str
    mode: Literal['json', 'template'] = 'json'
    profile_data: dict | None = None


@router.post('/generate')
def generate(payload: AiRequest, _auth=Depends(require_auth)):
    text = payload.text.strip()
    if not 20 <= len(text) <= 30000:
        raise HTTPException(status_code=400, detail='El texto debe tener entre 20 y 30.000 caracteres.')

    try:
        if payload.mode == 'template':
            if not payload.profile_data:
                raise HTTPException(status_code=400, detail='Primero debes tener un JSON de perfil válido.')
            return {'mode': 'template', 'data': generar_plantilla(text, payload.profile_data)}
        return {'mode': 'json', 'data': generar_json_habilidades(text)}
    except HTTPException:
        raise
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        print(f'[AI ERROR] {exc}')
        raise HTTPException(status_code=502, detail='No se pudo procesar la solicitud con la IA.')
