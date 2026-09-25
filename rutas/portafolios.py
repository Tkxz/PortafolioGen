import json

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel

from connect import db_connection
from security import require_auth

router = APIRouter(prefix="/api/portfolios", tags=["Portafolios"])


class PortfolioCreate(BaseModel):
    title: str | None = None
    theme: str = "nivel-ingeniero"
    data: dict


def _parse_json(value, fallback):
    if value is None:
        return fallback
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return fallback


@router.get("")
def list_portfolios(auth=Depends(require_auth)):
    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT id_portafolio AS id, Titulos AS title, Descripciones AS description,
                              Theme AS theme, Data_JSON AS data, Proyectos AS projects, updated_at AS updatedAt
                       FROM Portafolios WHERE usuario_id = %s ORDER BY updated_at DESC""",
                    (auth["id_usuario"],),
                )
                rows = cursor.fetchall()
        except Exception as exc:
            print(f"[DB ERROR] list_portfolios: {exc}")
            raise HTTPException(status_code=500, detail="No se pudieron cargar los portafolios.")

    for row in rows:
        row["data"] = _parse_json(row.get("data"), {})
        row["data"].pop("fotoUrl", None)
        row["projects"] = _parse_json(row.get("projects"), [])
        if row.get("updatedAt"):
            row["updatedAt"] = row["updatedAt"].isoformat()
    return {"portfolios": rows}


@router.post("", status_code=201)
def create_portfolio(payload: PortfolioCreate, auth=Depends(require_auth)):
    data = dict(payload.data)
    data.pop("fotoUrl", None)
    theme = str(payload.theme or "nivel-ingeniero")[:60]
    title = str(payload.title or data.get("nombre") or "Mi portafolio").strip()[:180]
    description = str(data.get("biografia") or "")[:10000]
    projects = data.get("proyectos") if isinstance(data.get("proyectos"), list) else []

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO Portafolios (usuario_id, Proyectos, Titulos, Descripciones, Theme, Data_JSON)
                       VALUES (%s, CAST(%s AS JSON), %s, %s, %s, CAST(%s AS JSON))""",
                    (auth["id_usuario"], json.dumps(projects, ensure_ascii=False), title, description, theme,
                     json.dumps(data, ensure_ascii=False)),
                )
                portfolio_id = cursor.lastrowid
            connection.commit()
        except Exception as exc:
            connection.rollback()
            print(f"[DB ERROR] create_portfolio: {exc}")
            raise HTTPException(status_code=500, detail="No se pudo guardar el portafolio.")

    return {"id": portfolio_id, "title": title, "description": description, "theme": theme, "data": data, "projects": projects}


@router.delete("/{portfolio_id}", status_code=204)
def delete_portfolio(portfolio_id: int, auth=Depends(require_auth)):
    if portfolio_id <= 0:
        raise HTTPException(status_code=400, detail="ID inválido.")
    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM Portafolios WHERE id_portafolio = %s AND usuario_id = %s",
                    (portfolio_id, auth["id_usuario"]),
                )
                affected = cursor.rowcount
            connection.commit()
        except Exception as exc:
            connection.rollback()
            print(f"[DB ERROR] delete_portfolio: {exc}")
            raise HTTPException(status_code=500, detail="No se pudo eliminar el portafolio.")
    if not affected:
        raise HTTPException(status_code=404, detail="Portafolio no encontrado.")
    return Response(status_code=204)
