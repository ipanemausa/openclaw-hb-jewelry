"""
HB Jewelry — Endpoint de cotización
Agregar a tu gateway Flask en openclaw-cloud-2026
"""

import json
import redis
import psycopg2
from datetime import datetime
from flask import Blueprint, request, jsonify
import anthropic

hb_bp = Blueprint('hb_jewelry', __name__)

# Cliente Anthropic (usa tu instancia OpenClaw)
client = anthropic.Anthropic()

# Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_db():
    return psycopg2.connect(
        dbname="openclaw_prod",
        user="openclaw_admin",
        password="",  # tu password
        host="localhost"
    )

def crear_tabla_cotizaciones():
    """Ejecutar una vez para crear la tabla."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cotizaciones (
            id SERIAL PRIMARY KEY,
            cliente_nombre VARCHAR(255),
            cliente_email VARCHAR(255),
            tipo_pieza VARCHAR(100),
            material VARCHAR(100),
            ocasion VARCHAR(100),
            presupuesto VARCHAR(50),
            descripcion TEXT,
            referencias TEXT,
            clasificacion JSONB,
            propuesta TEXT,
            estado VARCHAR(50) DEFAULT 'recibida',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()


@hb_bp.route('/api/flows/cotizacion', methods=['POST'])
def cotizacion_flow():
    """
    Flujo completo de cotización HB Jewelry.
    Estados: recepcion → clasificacion → propuesta → notificacion → fin
    """
    data = request.get_json()

    # --- ESTADO 1: RECEPCIÓN ---
    campos_req = ['nombre', 'email', 'tipo_pieza', 'descripcion', 'presupuesto']
    faltantes = [c for c in campos_req if not data.get(c)]
    if faltantes:
        return jsonify({'error': 'Campos requeridos faltantes', 'campos': faltantes}), 400

    nombre      = data['nombre']
    email       = data['email']
    tipo_pieza  = data['tipo_pieza']
    material    = data.get('material', 'Por definir')
    ocasion     = data.get('ocasion', '')
    presupuesto = data['presupuesto']
    descripcion = data['descripcion']
    referencias = data.get('referencias', '')

    # Guardar solicitud inicial en messages
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO messages (content, role, agent, created_at) VALUES (%s, %s, %s, %s) RETURNING id",
            (json.dumps(data), 'user', 'marketing', datetime.now())
        )
        msg_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
    except Exception as e:
        msg_id = None
        print(f"[HB] DB warning (messages): {e}")

    # --- ESTADO 2: CLASIFICACIÓN ---
    clasificacion = {}
    try:
        clasif_resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system="Eres el agente de clasificación de HB Jewelry. Responde SOLO con JSON válido, sin texto adicional.",
            messages=[{
                "role": "user",
                "content": f"""Clasifica esta solicitud de cotización:

Cliente: {nombre}
Pieza: {tipo_pieza}
Material: {material}
Presupuesto: {presupuesto}
Descripción: {descripcion}

Responde SOLO con este JSON (sin markdown, sin explicaciones):
{{
  "prioridad": "alta|media|baja",
  "categoria": "personalizado|restauracion|rediseno",
  "complejidad": "simple|intermedia|elaborada",
  "tiempo_estimado_dias": 14,
  "notas_internas": "breve nota"
}}"""
            }]
        )
        raw = clasif_resp.content[0].text.strip()
        raw = raw.replace('```json', '').replace('```', '').strip()
        clasificacion = json.loads(raw)
    except Exception as e:
        clasificacion = {
            "prioridad": "media",
            "categoria": "personalizado",
            "complejidad": "intermedia",
            "tiempo_estimado_dias": 14,
            "notas_internas": f"Clasificación automática fallida: {e}"
        }

    # --- ESTADO 3: PROPUESTA ---
    propuesta_texto = ""
    try:
        prop_resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=600,
            system="Eres el equipo de ventas de HB Jewelry. Redacta propuestas cálidas, profesionales y personalizadas.",
            messages=[{
                "role": "user",
                "content": f"""Redacta una propuesta de cotización inicial para:

Cliente: {nombre}
Pieza: {tipo_pieza} en {material}
Ocasión: {ocasion if ocasion else 'No especificada'}
Presupuesto indicado: {presupuesto}
Descripción: {descripcion}
Complejidad estimada: {clasificacion.get('complejidad', 'intermedia')}
Tiempo estimado: {clasificacion.get('tiempo_estimado_dias', 14)} días

La propuesta debe ser:
- Cálida y profesional, en español
- Incluir rango de precio estimado según el presupuesto indicado
- Mencionar tiempo de fabricación aproximado
- Solicitar una llamada o videollamada para profundizar en los detalles
- Máximo 180 palabras
- Texto plano listo para enviar por email
- Empezar con "Hola {nombre},"
- Firmar como "El equipo de HB Jewelry" """
            }]
        )
        propuesta_texto = prop_resp.content[0].text.strip()
    except Exception as e:
        propuesta_texto = f"Hola {nombre},\n\nGracias por tu solicitud. Nuestro equipo la revisará y te contactará en 24-48 horas.\n\nEl equipo de HB Jewelry"
        print(f"[HB] Propuesta fallida: {e}")

    # --- ESTADO 4: NOTIFICACIÓN Y REGISTRO ---

    # Guardar cotización en BD
    cotizacion_id = None
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO cotizaciones
            (cliente_nombre, cliente_email, tipo_pieza, material, ocasion,
             presupuesto, descripcion, referencias, clasificacion, propuesta, estado)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id
        """, (
            nombre, email, tipo_pieza, material, ocasion,
            presupuesto, descripcion, referencias,
            json.dumps(clasificacion), propuesta_texto, 'propuesta_generada'
        ))
        cotizacion_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
    except Exception as e:
        print(f"[HB] DB error (cotizaciones): {e}")

    # Publicar en Redis
    try:
        r.publish('hb:cotizaciones:nuevas', json.dumps({
            'cotizacion_id': cotizacion_id,
            'cliente_email': email,
            'tipo_pieza': tipo_pieza,
            'prioridad': clasificacion.get('prioridad', 'media'),
            'timestamp': datetime.now().isoformat()
        }))
    except Exception as e:
        print(f"[HB] Redis warning: {e}")

    # --- ESTADO 5: FIN ---
    return jsonify({
        'status': 'ok',
        'flow_id': 'hb_cotizacion_v1',
        'cotizacion_id': cotizacion_id,
        'clasificacion': clasificacion,
        'propuesta_preview': propuesta_texto[:120] + '...' if len(propuesta_texto) > 120 else propuesta_texto,
        'mensaje': 'Cotización procesada y propuesta generada correctamente',
        'siguiente_paso': 'followup en 3 dias'
    }), 200
