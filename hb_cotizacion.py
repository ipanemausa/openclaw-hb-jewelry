import os
import json
import psycopg2
import psycopg2.extras
from datetime import datetime
from flask import Blueprint, request, jsonify

hb_bp = Blueprint('hb_jewelry', __name__)

def get_db():
    return psycopg2.connect(
        dbname=os.getenv('PG_DB', 'openclaw_prod'),
        user=os.getenv('PG_USER', 'openclaw_admin'),
        password=os.getenv('PG_PASS', ''),
        host='openclaw_db',
        port='5432'
    )

def crear_tabla_cotizaciones():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'CREATE TABLE IF NOT EXISTS cotizaciones ('
            'id SERIAL PRIMARY KEY,'
            'cliente_nombre VARCHAR(255),'
            'cliente_email VARCHAR(255),'
            'tipo_pieza VARCHAR(100),'
            'material VARCHAR(100),'
            'ocasion VARCHAR(100),'
            'presupuesto VARCHAR(50),'
            'descripcion TEXT,'
            'referencias TEXT,'
            'clasificacion JSONB,'
            'propuesta TEXT,'
            'estado VARCHAR(50) DEFAULT chr(39)||chr(114)||chr(101)||chr(99)||chr(105)||chr(98)||chr(105)||chr(100)||chr(97)||chr(39),'
            'created_at TIMESTAMP DEFAULT NOW(),'
            'updated_at TIMESTAMP DEFAULT NOW())'
        )
        conn.commit()
        cur.close()
        conn.close()
        print('[HB] tabla ok')
    except Exception as e:
        print('[HB] error: ' + str(e))

@hb_bp.route('/api/flows/cotizacion', methods=['POST'])
def hb_cotizacion():
    data = request.get_json(silent=True) or {}
    faltantes = [c for c in ['nombre','email','tipo_pieza','descripcion','presupuesto'] if not data.get(c)]
    if faltantes:
        return jsonify({'status': 'error', 'campos_faltantes': faltantes}), 400
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO cotizaciones(cliente_nombre,cliente_email,tipo_pieza,material,ocasion,presupuesto,descripcion,referencias,estado)'
            'VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id',
            (data['nombre'],data['email'],data['tipo_pieza'],data.get('material',''),data.get('ocasion',''),data['presupuesto'],data['descripcion'],data.get('referencias',''),'recibida')
        )
        cid = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'status': 'ok', 'cotizacion_id': cid}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500

@hb_bp.route('/api/flows/cotizacion/<int:cid>', methods=['GET'])
def hb_get_cotizacion(cid):
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT * FROM cotizaciones WHERE id = %s', (cid,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'status': 'error', 'mensaje': 'No encontrada'}), 404
        d = dict(row)
        if d.get('created_at'):
            d['created_at'] = d['created_at'].isoformat()
        if d.get('updated_at'):
            d['updated_at'] = d['updated_at'].isoformat()
        return jsonify({'status': 'ok', 'cotizacion': d}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500

@hb_bp.route('/hb/dashboard', methods=['GET'])
def hb_dashboard():
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT COUNT(*) AS total FROM cotizaciones')
        stats = dict(cur.fetchone())
        cur.execute('SELECT id,cliente_nombre,tipo_pieza,estado,created_at FROM cotizaciones ORDER BY created_at DESC LIMIT 20')
        rows = [dict(r) for r in cur.fetchall()]
        for r in rows:
            if r.get('created_at'):
                r['created_at'] = r['created_at'].isoformat()
        cur.close()
        conn.close()
        return jsonify({'status': 'ok', 'stats': stats, 'cotizaciones': rows}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500

@hb_bp.route('/api/flows/cotizacion/<int:cid>/estado', methods=['PATCH'])
def hb_update_estado(cid):
    data = request.get_json(silent=True) or {}
    estado = data.get('estado', '').strip()
    validos = ['recibida','propuesta_generada','aprobada','en_produccion','entregada','cancelada']
    if estado not in validos:
        return jsonify({'status': 'error', 'mensaje': 'Estado invalido', 'validos': validos}), 400
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('UPDATE cotizaciones SET estado=%s, updated_at=NOW() WHERE id=%s RETURNING id', (estado, cid))
        if cur.rowcount == 0:
            cur.close(); conn.close()
            return jsonify({'status': 'error', 'mensaje': 'No encontrada'}), 404
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'status': 'ok', 'id': cid, 'nuevo_estado': estado}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500
