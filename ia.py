import json
import os
import re

from openai import OpenAI

SYSTEM_PROMPT = """Eres un experto redactor de perfiles profesionales y reclutador IT.
Convierte el texto libre del usuario en un JSON válido para un portafolio web.
Devuelve únicamente JSON con estas claves:
- nombre: string
- subtitulo: string
- biografia: string
- habilidades: array de strings
- proyectos: array de objetos con titulo, descripcion y enlace
No agregues fotoUrl ni campos de fotografía. No inventes empresas ni enlaces."""


def _extract_json(text: str) -> dict:
    clean = text.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean, flags=re.IGNORECASE)
    clean = re.sub(r"\s*```$", "", clean)
    try:
        data = json.loads(clean)
    except json.JSONDecodeError:
        start = clean.find("{")
        end = clean.rfind("}")
        if start < 0 or end <= start:
            raise ValueError("La IA no devolvió un JSON válido.")
        data = json.loads(clean[start:end + 1])
    if not isinstance(data, dict):
        raise ValueError("La IA no devolvió un objeto JSON válido.")
    data.pop("fotoUrl", None)
    return data


def generar_portafolio(texto: str) -> dict:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise RuntimeError("Falta NVIDIA_API_KEY en .env")

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
    )

    respuesta = client.chat.completions.create(
        model=os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": texto},
        ],
        temperature=0.4,
        max_tokens=1800,
    )
    contenido = respuesta.choices[0].message.content or ""
    return _extract_json(contenido)
