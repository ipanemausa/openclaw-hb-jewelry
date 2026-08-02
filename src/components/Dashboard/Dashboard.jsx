import React, { useState } from 'react';
import IntentBar from '../IntentBar/IntentBar';
import RealVoicePlayer from '../RealVoicePlayer/RealVoicePlayer';

// ─── CLOUD-FIRST & DYNAMIC CACHE BUSTING ──────────────────────────────────────
const GITHUB_PAGES_BASE = 'https://ipanemausa.github.io/openclaw-operativo-2026';
const FIREBASE_BASE = 'https://hb-jewelry-app.web.app';
const CLOUD_BASE = window.location.hostname.includes('github.io') ? GITHUB_PAGES_BASE : FIREBASE_BASE;
const IS_PROD = window.location.hostname !== 'localhost';
const asset = (f) => (IS_PROD ? `${CLOUD_BASE}/${f}?v=20260801_v100Width` : `/${f}?v=20260801_v100Width`);

// ─── REGISTROS DE ACTIVIDAD RECIENTE (PALETA DORADO HB #d4af6a) ──────────────
const RECENT_ACTIVITIES = [
  { timestamp: '2026-08-01 09:45:30', evento: 'Nube GitHub Pages CDN: https://ipanemausa.github.io/openclaw-operativo-2026/', division: 'Infraestructura Nube', estado: 'completado' },
  { timestamp: '2026-08-01 09:40:00', evento: 'Firebase Hosting CDN: https://hb-jewelry-app.web.app/', division: 'Infraestructura Nube', estado: 'completado' },
  { timestamp: '2026-08-01 09:35:00', evento: 'Localhost Server: http://localhost:5173/', division: 'Desarrollo Local', estado: 'completado' },
  { timestamp: '2026-08-01 09:15:44', evento: 'Pipeline DAG: Respaldo Rclone a Google Drive 5TB', division: 'Sistema & IT', estado: 'completado' },
  { timestamp: '2026-08-01 09:14:55', evento: 'Compresión Vectorial RAG 768D: 11.5 KB (97.66% ahorro)', division: 'Agentes IA', estado: 'completado' },
  { timestamp: '2026-08-01 08:34:55', evento: 'Motor Video RAG: 4 Capas (Blur + Avatar + Teleprompter + Audio 48kHz)', division: 'Marketing AI', estado: 'completado' }
];

export default function Dashboard({ onNavigate }) {
  const [hoverAvatars, setHoverAvatars] = useState(false);
  const [hoverVideos, setHoverVideos] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <div style={{ padding: '24px 36px', width: '100%', maxWidth: '100%', boxSizing: 'border-box', color: '#f0ede8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* PLAYER MODAL */}
      {showPlayer && <RealVoicePlayer onClose={() => setShowPlayer(false)} />}
      
      {/* ─── CABECERA EJECUTIVA AMIGABLE Y ELEGANTE CON ANCHO COMPLETO ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(212,175,106,0.15)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.2)', color: '#d4af6a', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
            <span>✨ OPENCLAW ENTERPRISE v2026.7.1</span>
            <span style={{ color: '#4ade80', fontSize: 10 }}>● ONLINE</span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#d4af6a', margin: '8px 0 4px 0', letterSpacing: '-0.3px' }}>
            Plataforma Integral de Control Corporativo
          </h1>
          <p style={{ fontSize: 13, color: '#a09d99', margin: 0 }}>
            Ecosistema de gestión unificado para Directivas, CEO, Gerencia, Supervisores y Operaciones
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setShowPlayer(true)} style={{
            background: 'linear-gradient(135deg, rgba(132,204,22,0.15), rgba(132,204,22,0.05))',
            border: '1px solid rgba(132,204,22,0.4)',
            borderRadius: 10, padding: '8px 16px',
            color: '#84cc16', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span style={{ fontSize: 14 }}>▶</span>
            <div>
              <div>Mi Voz Real · B-Roll</div>
              <div style={{ color: 'rgba(132,204,22,0.6)', fontSize: 9 }}>78s · FM 48kHz · EBU R128</div>
            </div>
          </button>
          <div style={{ background: 'rgba(22,20,18,0.8)', border: '1px solid rgba(212,175,106,0.2)', padding: '8px 16px', borderRadius: 10, textAlign: 'right', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: '#d4af6a', fontSize: 12, fontWeight: 700 }}>HB Jewelry 18k</div>
            <div style={{ color: '#a09d99', fontSize: 10 }}>Firebase CDN</div>
          </div>
          <div style={{ background: 'rgba(22,20,18,0.8)', border: '1px solid rgba(212,175,106,0.2)', padding: '8px 16px', borderRadius: 10, textAlign: 'right', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: '#d4af6a', fontSize: 12, fontWeight: 700 }}>Drive 5TB</div>
            <div style={{ color: '#a09d99', fontSize: 10 }}>Rclone Sync</div>
          </div>
        </div>
      </div>

      {/* ─── INTENT COMMANDER — COMANDOS AUTÓNOMOS DE 1 LÍNEA ─── */}
      <IntentBar />

      {/* ─── SECCIÓN 1: 2 BOTONES MAESTROS (AMPLIADOS A PANTALLA COMPLETA) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        
        {/* BOTÓN 1: DESPLEGAR AVATARES 3D */}
        <div
          onClick={() => handleNav('avatar')}
          onMouseEnter={() => setHoverAvatars(true)}
          onMouseLeave={() => setHoverAvatars(false)}
          style={{
            cursor: 'pointer',
            padding: '22px 28px',
            borderRadius: 14,
            background: hoverAvatars ? 'rgba(212,175,106,0.12)' : 'rgba(22,20,18,0.7)',
            border: hoverAvatars ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.2)',
            transition: 'all 0.25s ease',
            transform: hoverAvatars ? 'translateY(-2px)' : 'none',
            boxShadow: hoverAvatars ? '0 12px 30px rgba(212,175,106,0.18)' : '0 4px 15px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(212,175,106,0.15)', border: '1px solid rgba(212,175,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
              👤
            </div>
            <div>
              <div style={{ color: '#6b6866', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
                Parrilla 6 Columnas
              </div>
              <div style={{ color: '#d4af6a', fontSize: 18, fontWeight: 800 }}>
                Avatares Digitales 3D (Guillermo AI)
              </div>
              <div style={{ color: '#a09d99', fontSize: 12, marginTop: 2 }}>
                8 modelos de Guillermo AI con imágenes PNG e Inspector 3D.
              </div>
            </div>
          </div>

          <div style={{
            padding: '8px 20px',
            borderRadius: 24,
            background: hoverAvatars ? '#d4af6a' : 'rgba(212,175,106,0.15)',
            border: '1px solid #d4af6a',
            color: hoverAvatars ? '#000' : '#d4af6a',
            fontWeight: 800,
            fontSize: 12,
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>DESPLEGAR</span>
            <span>➔</span>
          </div>
        </div>

        {/* BOTÓN 2: VER VIDEOS Y ESTUDIO */}
        <div
          onClick={() => handleNav('marketing')}
          onMouseEnter={() => setHoverVideos(true)}
          onMouseLeave={() => setHoverVideos(false)}
          style={{
            cursor: 'pointer',
            padding: '22px 28px',
            borderRadius: 14,
            background: hoverVideos ? 'rgba(212,175,106,0.12)' : 'rgba(22,20,18,0.7)',
            border: hoverVideos ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.2)',
            transition: 'all 0.25s ease',
            transform: hoverVideos ? 'translateY(-2px)' : 'none',
            boxShadow: hoverVideos ? '0 12px 30px rgba(212,175,106,0.18)' : '0 4px 15px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(212,175,106,0.15)', border: '1px solid rgba(212,175,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
              🎬
            </div>
            <div>
              <div style={{ color: '#6b6866', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
                8 Videos MP4 Únicos
              </div>
              <div style={{ color: '#d4af6a', fontSize: 18, fontWeight: 800 }}>
                Estudio de Video & Cursos de Automatización
              </div>
              <div style={{ color: '#a09d99', fontSize: 12, marginTop: 2 }}>
                Videos con voz FM 48kHz y subtítulos bilingües en 2 columnas.
              </div>
            </div>
          </div>

          <div style={{
            padding: '8px 20px',
            borderRadius: 24,
            background: hoverVideos ? '#d4af6a' : 'rgba(212,175,106,0.15)',
            border: '1px solid #d4af6a',
            color: hoverVideos ? '#000' : '#d4af6a',
            fontWeight: 800,
            fontSize: 12,
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>DESPLEGAR</span>
            <span>➔</span>
          </div>
        </div>

      </div>

      {/* ─── SECCIÓN 2: CONTROL OPERATIVO POR DIVISIONES (GRID DE 3 COLUMNAS A PANTALLA COMPLETA) ─── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚡ LA AUTONOMÍA — CONTROL OPERATIVO POR DIVISIONES</span>
          <div style={{ flexGrow: 1, height: 1, background: 'rgba(212,175,106,0.15)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          
          {/* TARJETA 1: AGENTES AUTÓNOMOS */}
          <div
            onClick={() => handleNav('chat')}
            onMouseEnter={() => setHoverCard('chat')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'chat' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'chat' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>Agentes Autónomos & RAG</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(212,175,106,0.15)', color: '#d4af6a', fontSize: 10, fontWeight: 700 }}>5 Activos</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Memoria vectorial RAG 768-dim en Firestore y 7 Hacks de Claude 4.6.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>GESTIONAR AGENTES</span>
              <span>➔</span>
            </div>
          </div>

          {/* TARJETA 2: AUDITORÍA Y TRAZABILIDAD */}
          <div
            onClick={() => handleNav('auditoria')}
            onMouseEnter={() => setHoverCard('audit')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'audit' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'audit' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🔒</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>Auditoría & Trazabilidad</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 700 }}>100% Ok</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Registro de logs en tiempo real y protocolo de blindaje AGENTS.md.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>VER AUDITORÍA</span>
              <span>➔</span>
            </div>
          </div>

          {/* TARJETA 3: TAREAS & PIPELINE DAG */}
          <div
            onClick={() => handleNav('pipeline')}
            onMouseEnter={() => setHoverCard('pipe')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'pipe' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'pipe' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>Tareas & Pipeline DAG</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(212,175,106,0.15)', color: '#d4af6a', fontSize: 10, fontWeight: 700 }}>Drive 5TB</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Estado de tareas en segundo plano, respaldos Rclone y despliegue continuo.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>MONITOR PIPELINE</span>
              <span>➔</span>
            </div>
          </div>

          {/* TARJETA 4: VENTAS & CATÁLOGO 18K */}
          <div
            onClick={() => handleNav('ventas')}
            onMouseEnter={() => setHoverCard('ventas')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'ventas' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'ventas' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🛍️</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>Ventas & Catálogo 18k</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 700 }}>Activo</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Joyería Fina HB Jewelry con checkout automático y cierre a WhatsApp $0.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>IR A VENTAS</span>
              <span>➔</span>
            </div>
          </div>

          {/* TARJETA 5: WHATSAPP BUSINESS ($0) */}
          <div
            onClick={() => handleNav('whatsapp')}
            onMouseEnter={() => setHoverCard('wa')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'wa' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'wa' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>💬</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>WhatsApp Business ($0)</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(212,175,106,0.15)', color: '#d4af6a', fontSize: 10, fontWeight: 700 }}>Puerto 3001</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Canal de comunicación 24/7 sin costo por mensaje ni intermediarios.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>CANAL WHATSAPP</span>
              <span>➔</span>
            </div>
          </div>

          {/* TARJETA 6: CONTROL DE INVENTARIO */}
          <div
            onClick={() => handleNav('inventario')}
            onMouseEnter={() => setHoverCard('inv')}
            onMouseLeave={() => setHoverCard(null)}
            style={{
              cursor: 'pointer',
              padding: 20,
              borderRadius: 12,
              background: hoverCard === 'inv' ? 'rgba(212,175,106,0.08)' : 'rgba(22,20,18,0.6)',
              border: hoverCard === 'inv' ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.15)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📦</span>
                <strong style={{ color: '#f0ede8', fontSize: 14 }}>Control de Inventario</strong>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 700 }}>Stock Ok</span>
            </div>
            <p style={{ color: '#a09d99', fontSize: 11, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Gestión de stock de piezas finas en oro 18k e indicadores de inventario.
            </p>
            <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>VER INVENTARIO</span>
              <span>➔</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── SECCIÓN 3: REGISTROS DE ACTIVIDAD RECIENTE (TABLA A PANTALLA COMPLETA) ─── */}
      <div style={{ background: 'rgba(22,20,18,0.6)', border: '1px solid rgba(212,175,106,0.15)', borderRadius: 14, padding: 20, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📌 ACCIONES RECIENTES & DEPLOYS DIRECTOS</span>
          </div>
          
          {/* BOTONES PILL DORADOS LIVIANOS Y AMIGABLES */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleNav('productos')} style={{ cursor: 'pointer', background: 'rgba(212,175,106,0.1)', border: '1px solid #d4af6a', color: '#d4af6a', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease' }}>
              ➕ Agregar Producto
            </button>
            <button onClick={() => handleNav('ordenes')} style={{ cursor: 'pointer', background: 'rgba(212,175,106,0.1)', border: '1px solid #d4af6a', color: '#d4af6a', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease' }}>
              📦 Ver Pedidos
            </button>
            <button onClick={() => handleNav('reportes')} style={{ cursor: 'pointer', background: 'rgba(212,175,106,0.1)', border: '1px solid #d4af6a', color: '#d4af6a', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease' }}>
              📊 Reportes Financieros
            </button>
            <button onClick={() => handleNav('pipeline')} style={{ cursor: 'pointer', background: 'rgba(212,175,106,0.2)', border: '1px solid #d4af6a', color: '#d4af6a', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, transition: 'all 0.2s ease' }}>
              ⚡ Ejecutar Pipeline
            </button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212,175,106,0.15)', color: '#6b6866', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', width: '160px' }}>TIMESTAMP</th>
              <th style={{ padding: '8px 12px' }}>EVENTO CORPORATIVO</th>
              <th style={{ padding: '8px 12px', width: '180px' }}>DIVISIÓN</th>
              <th style={{ padding: '8px 12px', width: '110px' }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITIES.map((act, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#c0bcb8' }}>
                <td style={{ padding: '10px 12px', color: '#d4af6a', fontWeight: 600 }}>{act.timestamp}</td>
                <td style={{ padding: '10px 12px' }}>{act.evento}</td>
                <td style={{ padding: '10px 12px', color: '#a09d99' }}>{act.division}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontSize: 10, fontWeight: 700 }}>
                    {act.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
