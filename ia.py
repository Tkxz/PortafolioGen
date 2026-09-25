import json
import os
import re

from openai import OpenAI

JSON_SYSTEM_PROMPT = '''Eres un experto redactor de perfiles profesionales y reclutador IT.
Convierte el texto libre del usuario en un JSON válido para un portafolio web.
Devuelve únicamente JSON con estas claves:
- nombre: string
- subtitulo: string
- biografia: string
- habilidades: array de strings
- proyectos: array de objetos con titulo, descripcion y enlace
No agregues fotoUrl ni campos de fotografía. No inventes empresas ni enlaces.'''

TEMPLATE_SYSTEM_PROMPT = '''Eres un diseñador web senior y desarrollador frontend.
Debes crear una plantilla COMPLETA de portafolio en un único HTML compatible con Handlebars.
El usuario te describirá colores, estilo, posiciones, animaciones y otros detalles visuales.
También recibirás un JSON de perfil que indica qué datos existen.

IMPORTANTE: NO devuelvas la plantilla dentro de JSON. El HTML contiene muchas comillas y puede romper el JSON.
Responde EXACTAMENTE con este formato:

NAME: Nombre corto de la plantilla
DESCRIPTION: Descripción visual breve
SWATCHES: #111111|#ff0000|#ffffff
---HTML---
<!DOCTYPE html>
<html>
...
</html>
---END---

REGLAS:
1. NAME debe ser corto, máximo 120 caracteres.
2. DESCRIPTION debe tener máximo 500 caracteres.
3. SWATCHES debe contener exactamente 3 colores HEX separados por |.
4. Después de ---HTML--- entrega HTML completo desde <!DOCTYPE html> hasta </html>.
5. Termina con ---END---.
6. Usa Handlebars para los datos disponibles: {{nombre}}, {{subtitulo}}, {{biografia}}, {{#each habilidades}}, {{#each proyectos}}, {{this.titulo}}, {{this.descripcion}}, {{this.enlace}}.
7. Debe ser responsive y funcionar como archivo HTML independiente.
8. Puedes usar CSS, JavaScript y CDN públicas para animaciones si aportan valor.
9. No agregues foto, fotoUrl ni avatar.
10. No inventes datos profesionales del usuario: el contenido debe salir de los placeholders.
11. Evita formularios que envíen datos a servicios externos.
12. No uses bloques Markdown como ```html.'''


def _client() -> OpenAI:
    api_key = os.getenv('NVIDIA_API_KEY')
    if not api_key:
        raise RuntimeError('Falta NVIDIA_API_KEY en .env')
    return OpenAI(
        base_url='https://integrate.api.nvidia.com/v1',
        api_key=api_key,
        timeout=60.0,
        max_retries=1,
    )


def _extract_json(text: str) -> dict:
    clean = (text or '').strip()
    clean = re.sub(r'^```(?:json)?\s*', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'\s*```$', '', clean)

    try:
        data = json.loads(clean)
    except json.JSONDecodeError:
        start = clean.find('{')
        end = clean.rfind('}')
        if start < 0 or end <= start:
            raise ValueError('La IA no devolvió un JSON válido.')
        data = json.loads(clean[start:end + 1])

    if not isinstance(data, dict):
        raise ValueError('La IA no devolvió un objeto JSON válido.')

    data.pop('fotoUrl', None)
    return data


def _extract_template(text: str) -> dict:
    clean = (text or '').strip()

    name_match = re.search(r'^NAME:\s*(.+)$', clean, flags=re.MULTILINE)
    description_match = re.search(r'^DESCRIPTION:\s*(.+)$', clean, flags=re.MULTILINE)
    swatches_match = re.search(r'^SWATCHES:\s*(.+)$', clean, flags=re.MULTILINE)
    html_match = re.search(r'---HTML---\s*(.*?)\s*---END---', clean, flags=re.DOTALL)

    if not html_match:
        # Respaldo por si la IA omite ---END--- pero sí entrega el HTML.
        html_start = clean.find('---HTML---')
        if html_start >= 0:
            html = clean[html_start + len('---HTML---'):].strip()
        else:
            doctype_start = clean.lower().find('<!doctype html')
            html_tag_start = clean.lower().find('<html')
            start = doctype_start if doctype_start >= 0 else html_tag_start
            if start < 0:
                raise ValueError('La IA no devolvió HTML válido para la plantilla.')
            html = clean[start:].strip()
    else:
        html = html_match.group(1).strip()

    # Elimina fences Markdown si el modelo los agregó a pesar de la instrucción.
    html = re.sub(r'^```(?:html)?\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\s*```$', '', html)

    if '<html' not in html.lower() or '</html>' not in html.lower():
        raise ValueError('La plantilla generada está incompleta: falta la estructura HTML.')

    name = name_match.group(1).strip() if name_match else 'Plantilla IA'
    description = (
        description_match.group(1).strip()
        if description_match
        else 'Plantilla personalizada generada con IA.'
    )

    swatches = []
    if swatches_match:
        for color in swatches_match.group(1).split('|'):
            color = color.strip()
            if re.fullmatch(r'#[0-9a-fA-F]{6}', color):
                swatches.append(color)

    defaults = ['#0f172a', '#06b6d4', '#f8fafc']
    for default in defaults:
        if len(swatches) >= 3:
            break
        swatches.append(default)

    return {
        'name': name[:120],
        'description': description[:500],
        'swatches': swatches[:3],
        'template': html
    }


def generar_json_habilidades(texto: str) -> dict:
    respuesta = _client().chat.completions.create(
        model=os.getenv('NVIDIA_MODEL', 'meta/llama-3.1-8b-instruct'),
        messages=[
            {'role': 'system', 'content': JSON_SYSTEM_PROMPT},
            {'role': 'user', 'content': texto},
        ],
        temperature=0.4,
        max_tokens=1800,
    )

    return _extract_json(
        respuesta.choices[0].message.content or ''
    )


def generar_plantilla(descripcion: str, perfil: dict) -> dict:
    perfil = dict(perfil or {})
    perfil.pop('fotoUrl', None)

    user_message = (
        'DISEÑO SOLICITADO:\n'
        f'{descripcion}\n\n'
        'JSON DEL PERFIL DISPONIBLE:\n'
        f'{json.dumps(perfil, ensure_ascii=False, indent=2)}'
    )

    respuesta = _client().chat.completions.create(
        model=os.getenv('NVIDIA_MODEL', 'meta/llama-3.1-8b-instruct'),
        messages=[
            {'role': 'system', 'content': TEMPLATE_SYSTEM_PROMPT},
            {'role': 'user', 'content': user_message},
        ],
        temperature=0.45,
        max_tokens=6500,
    )

    return _extract_template(
        respuesta.choices[0].message.content or ''
    )
