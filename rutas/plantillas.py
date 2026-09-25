import json

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field

from connect import db_connection
from security import require_auth

router = APIRouter(
    prefix="/api/templates",
    tags=["Plantillas"]
)


class TemplateCreate(BaseModel):
    name: str
    description: str = ""
    prompt: str = ""
    swatches: list[str] = Field(default_factory=list)
    template: str


def _row_to_template(row: dict) -> dict:
    colors = row.get("colors")

    if isinstance(colors, str):
        try:
            colors = json.loads(colors)
        except json.JSONDecodeError:
            colors = []

    return {
        "id": row["id_plantilla"],
        "name": row["Nombre"],
        "description": row.get("Descripcion") or "",
        "prompt": row.get("Prompt") or "",
        "swatches": colors or [],
        "template": row["HTML_Template"],
        "createdAt": (
            row["created_at"].isoformat()
            if row.get("created_at")
            else None
        ),
        "updatedAt": (
            row["updated_at"].isoformat()
            if row.get("updated_at")
            else None
        )
    }


@router.get("")
def list_templates(
    auth=Depends(require_auth)
):
    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        id_plantilla,
                        Nombre,
                        Descripcion,
                        Prompt,
                        Colores AS colors,
                        HTML_Template,
                        created_at,
                        updated_at

                    FROM Plantillas

                    WHERE usuario_id = %s

                    ORDER BY updated_at DESC
                    """,
                    (
                        auth["id_usuario"],
                    )
                )

                rows = cursor.fetchall()

        except Exception as exc:
            print(
                f"[DB ERROR] list_templates: {exc}"
            )

            raise HTTPException(
                status_code=500,
                detail="No se pudieron cargar las plantillas."
            )

    return {
        "templates": [
            _row_to_template(row)
            for row in rows
        ]
    }


@router.post("", status_code=201)
def create_template(
    payload: TemplateCreate,
    auth=Depends(require_auth)
):
    name = (
        payload.name.strip()[:120]
        or "Plantilla IA"
    )

    description = (
        payload.description
        .strip()[:500]
    )

    prompt = (
        payload.prompt
        .strip()[:10000]
    )

    swatches = [
        color.strip()
        for color in payload.swatches[:3]
        if (
            isinstance(color, str)
            and len(color.strip()) == 7
            and color.strip().startswith("#")
        )
    ]

    swatches = [
        color
        for color in swatches
        if all(
            char in "0123456789abcdefABCDEF"
            for char in color[1:]
        )
    ]

    defaults = [
        "#0f172a",
        "#06b6d4",
        "#f8fafc"
    ]

    while len(swatches) < 3:
        swatches.append(
            defaults[len(swatches)]
        )

    template = payload.template.strip()

    if len(template) > 750_000:
        raise HTTPException(
            status_code=413,
            detail="La plantilla es demasiado grande."
        )

    if (
        "<html" not in template.lower()
        or "</html>" not in template.lower()
    ):
        raise HTTPException(
            status_code=400,
            detail="La plantilla HTML no es válida."
        )

    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO Plantillas
                    (
                        usuario_id,
                        Nombre,
                        Descripcion,
                        Prompt,
                        Colores,
                        HTML_Template
                    )

                    VALUES
                    (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    )
                    """,
                    (
                        auth["id_usuario"],
                        name,
                        description,
                        prompt,
                        json.dumps(
                            swatches,
                            ensure_ascii=False
                        ),
                        template
                    )
                )

                template_id = (
                    cursor.lastrowid
                )

            connection.commit()

        except Exception as exc:
            connection.rollback()

            print(
                f"[DB ERROR] create_template: {exc}"
            )

            raise HTTPException(
                status_code=500,
                detail="No se pudo guardar la plantilla."
            )

    return {
        "id": template_id,
        "name": name,
        "description": description,
        "prompt": prompt,
        "swatches": swatches,
        "template": template
    }


@router.delete(
    "/{template_id}",
    status_code=204
)
def delete_template(
    template_id: int,
    auth=Depends(require_auth)
):
    with db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM Plantillas

                    WHERE id_plantilla = %s
                    AND usuario_id = %s
                    """,
                    (
                        template_id,
                        auth["id_usuario"]
                    )
                )

                affected = cursor.rowcount

            connection.commit()

        except Exception as exc:
            connection.rollback()

            print(
                f"[DB ERROR] delete_template: {exc}"
            )

            raise HTTPException(
                status_code=500,
                detail="No se pudo eliminar la plantilla."
            )

    if not affected:
        raise HTTPException(
            status_code=404,
            detail="Plantilla no encontrada."
        )

    return Response(
        status_code=204
    )