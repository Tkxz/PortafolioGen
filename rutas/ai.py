from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ia import generar_portafolio
from security import require_auth

router = APIRouter(
    prefix="/api/ai",
    tags=["IA"]
)


class AiRequest(BaseModel):
    text: str


@router.post("/generate")
def generate(
    payload: AiRequest,
    auth=Depends(require_auth)
):
    text = payload.text.strip()

    if len(text) < 20:
        raise HTTPException(
            status_code=400,
            detail="El texto debe tener al menos 20 caracteres."
        )

    if len(text) > 30000:
        raise HTTPException(
            status_code=400,
            detail="El texto no puede superar los 30.000 caracteres."
        )

    try:
        result = generar_portafolio(text)

        if isinstance(result, dict):
            result.pop("fotoUrl", None)

        return {
            "data": result
        }

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc)
        )

    except Exception as exc:
        print(f"[AI ERROR] {exc}")

        raise HTTPException(
            status_code=502,
            detail="No se pudo procesar la solicitud con la IA."
        )