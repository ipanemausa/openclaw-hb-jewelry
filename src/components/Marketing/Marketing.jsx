import React, { useState, useRef, useEffect, useCallback } from 'react';

const IS_PROD = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const STABLE_CACHE_KEY = 'v20260806_stable';
const asset = (f) => (IS_PROD ? `${window.location.origin}/${f}?v=${STABLE_CACHE_KEY}` : `/${f}?v=${STABLE_CACHE_KEY}`);

// ─── CATÁLOGO DE VIDEOS REALES (POSTERS DIVERSIFICADOS DE LA COLECCIÓN DE AVATARES) ───
const VIDEO_CATALOG = [
  {
    id: 'jack-ma-style-b2b-master',
    src: asset('videos/jack_ma_style/jack_ma_b2b_full_master.mp4'),
    poster: asset('avatars/negro.png'),
    title: '🌌 Jack Ma Style (4 Capas Quemadas en MP4): IA B2B Cinemática',
    tag: 'JACK MA FULL (15s)',
    dur: '0:15',
    description: 'Video 1080p con TODAS LAS CAPAS QUEMADAS EN EL ARCHIVO MP4: Fondo + Avatar a la izquierda + Subtítulos Karaoke dorados activados por palabra.'
  },
  {
    id: 'agencia-b2b-intro',
    src: asset('videos/guillermo_940f_master.mp4'),
    poster: asset('avatars/dorado.png'),
    title: '🚀 Agencia IA: Asesoría & Automatización Empresarial',
    tag: 'AGENCIA B2B (15s)',
    dur: '0:15',
    description: 'Presentación ejecutiva de automatización de procesos, WhatsApp $0 y agentes autónomos para empresas.'
  },
  {
    id: 'real-estate-ai',
    src: asset('videos/adaptive_targets/video_broll_catalog_18k.mp4'),
    poster: asset('avatars/blanco.png'),
    title: '🏢 Real Estate IA: Citas 24/7 & Calificación de Leads',
    tag: 'REAL ESTATE IA',
    dur: '0:20',
    description: 'Demostración de agentes de Inteligencia Artificial para agencias inmobiliarias y venta de propiedades.'
  },
  {
    id: 'servicios-profesionales-ai',
    src: asset('videos/guillermo_940f_fast_master.mp4'),
    poster: asset('avatars/azul.png'),
    title: '💼 Servicios Profesionales & Salud: Agendas Autónomas',
    tag: 'SERVICIOS & SALUD',
    dur: '0:18',
    description: 'Automatización de agendamiento de citas, filtro de clientes y atención médica/legal 24/7.'
  },
  {
    id: 'guillermo-940f-master',
    src: asset('videos/guillermo_940f_master.mp4'),
    poster: asset('avatars/dorado.png'),
    title: '🏆 Video Maestro 940 Frames: Guillermo AI Studio',
    tag: 'MASTER 940F (31s)',
    dur: '0:31',
    description: 'Video maestro de 940 frames procesado en micro-lotes de 15 frames con audio EBU R128 y subtítulos Word-Karaoke.'
  },
  {
    id: 'talk-grow-educational',
    src: asset('videos/talk_grow_format/real_talk_grow_educational.mp4'),
    poster: asset('avatars/negro.png'),
    title: 'Educativo 3D: 7 Hacks de Claude AI 4.6',
    tag: 'TALK-GROW 3D',
    dur: '0:15',
    description: 'Demostración de 7 hacks con teleprompter paso a paso y voz FM 48kHz.'
  },
  {
    id: 'yt-special-claude-master',
    src: asset('videos/talk_grow_format/youtube_master_10min_educational.mp4'),
    poster: asset('avatars/blanco.png'),
    title: 'YouTube Master: Agentes AI & 7 Hacks (10 Min)',
    tag: 'MASTER 1080p',
    dur: '1:00',
    description: 'Curso intensivo de agentes autónomos y vectorización RAG en Firestore.'
  },
  {
    id: 'podcast',
    src: asset('hb_tutorial_avatar_v1.mp4'),
    poster: asset('avatars/azul.png'),
    title: 'Podcast: Ecosistema Ilimitado AI',
    tag: 'PODCAST',
    dur: '1:35',
    description: 'Guillermo AI en estudio explicando la automatización comercial.'
  },
  {
    id: 'tutorial',
    src: asset('hb_tutorial_narrado_v1.mp4'),
    poster: asset('avatars/dorado.png'),
    title: 'Tutorial: Manejo Completo de App HB 18k',
    tag: 'TUTORIAL APP',
    dur: '1:16',
    description: 'Guía paso a paso: módulo de ventas, WhatsApp $0 e inventario.'
  },
  {
    id: 'qa-english',
    src: asset('output_avatar_english_7qa.mp4'),
    poster: asset('avatars/rojo.png'),
    title: 'Técnico: Demo Arquitectura 7 Q&A RAG (English)',
    tag: 'TECHNICAL DEMO',
    dur: '0:15',
    description: 'Demostración técnica en inglés con arquitectura RAG 768-dim.'
  },
  {
    id: 'showcase-18k',
    src: asset('final_showcase.mp4'),
    poster: asset('avatars/verde.png'),
    title: 'Showcase: Colección Joyería 18k & WhatsApp $0',
    tag: 'SHOWCASE 18K',
    dur: '0:45',
    description: 'Presentación comercial de joyería fina con cierre automático.'
  },
  {
    id: 'tiktok-viral',
    src: asset('tiktok_showcase.mp4'),
    poster: asset('avatars/studio_mic.png'),
    title: 'TikTok Viral: Promocional Vertical 1080p',
    tag: 'TIKTOK 9:16',
    dur: '0:30',
    description: 'Video vertical promocional optimizado para redes sociales.'
  },
  {
    id: 'showcase-human-loop',
    src: asset('showcase_human_loop.mp4'),
    poster: asset('avatars/desk_mic.png'),
    title: 'Avatar Base: Guillermo AI Studio Loop',
    tag: 'AVATAR LOOP',
    dur: '0:20',
    description: 'Video base en estudio con loop continuo para gesticulación vocal.'
  }
];

// ─── TRANSCRIPCIÓN BILINGÜE BASE DE DATOS (2 COLUMNAS) ─────────────────────
const SUBTITLE_DATABASE = [
  { time: '00:01', es: 'Hola, soy Guillermo de HB Jewelry. Bienvenidos a nuestra colección.', en: 'Hello, I am Guillermo from HB Jewelry. Welcome to our collection.' },
  { time: '00:05', es: 'Hoy les mostraré los 7 hacks avanzados para dominar Claude 4.6 en su empresa.', en: 'Today I will show you the 7 advanced hacks to master Claude 4.6 in your business.' },
  { time: '00:09', es: 'Hack 1: Prompting estructurado con artefactos y protocolos blindados.', en: 'Hack 1: Structured prompting with artifacts and hard-armored protocols.' },
  { time: '00:12', es: 'Hack 2: Integración de vectores RAG de 768 dimensiones en Firestore.', en: 'Hack 2: Integration of 768-dimensional RAG vectors in Firestore.' },
  { time: '00:15', es: 'Hack 3: Automatización de Pipeline DAG en segundo plano con Rclone.', en: 'Hack 3: Automation of background DAG Pipeline with Rclone.' },
  { time: '00:18', es: 'Cada pedido se procesa automáticamente a través de WhatsApp Business sin costo.', en: 'Every order is automatically processed through WhatsApp Business at zero cost.' },
  { time: '00:22', es: 'Toda nuestra información está respaldada en tiempo real en Google Drive 5TB.', en: 'All our information is backed up in real time on Google Drive 5TB.' }
];

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL DE VIDEO HD CON ARQUITECTURA DE 4 CAPAS (BLUR + AVATAR + TEXTO + AUDIO)
   ═══════════════════════════════════════════════════════════════════════════ */
function VidModal({ v, onClose }) {
  const ref = useRef(null);
  const [unmuted, setUnmuted] = useState(false);

  const enableAudio = useCallback(() => {
    if (ref.current) {
      ref.current.muted = false;
      ref.current.volume = 1.0;
      ref.current.play().catch(() => {});
      setUnmuted(true);
    }
  }, []);

  useEffect(() => {
    enableAudio();
  }, [enableAudio]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,5,5,0.96)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1040, background: '#161412', border: '1px solid rgba(212,175,106,0.25)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
        
        {/* CABECERA DEL MODAL */}
        <div style={{ padding: '12px 18px', background: '#0f0f0f', borderBottom: '1px solid rgba(212,175,106,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(212,175,106,0.12)', border: '1px solid rgba(212,175,106,0.25)', color: '#d4af6a', fontSize: 10, fontWeight: 700 }}>{v.tag}</span>
            <strong style={{ color: '#d4af6a', fontSize: 15 }}>{v.title}</strong>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a09d99', fontSize: 20, cursor: 'pointer', padding: '0 8px' }}>✕</button>
        </div>

        {/* INDICADOR DE ARQUITECTURA DE 4 CAPAS */}
        <div style={{ padding: '6px 18px', background: 'rgba(212,175,106,0.06)', borderBottom: '1px solid rgba(212,175,106,0.1)', display: 'flex', gap: 14, fontSize: 10, color: '#d4af6a' }}>
          <span>🖼️ Capa 1: Fondo Desenfoque</span>
          <span>👤 Capa 2: Avatar HD 3D</span>
          <span>✍️ Capa 3: Teleprompter Paso a Paso (Calmado)</span>
          <span>🎙️ Capa 4: Voz Real Guillermo 48kHz</span>
        </div>

        {/* OVERLAY BOTÓN DESBLOQUEO AUDIO SI NAVEGADOR BLOQUEA AUTO-PLAY */}
        {!unmuted && (
          <div onClick={enableAudio} style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,175,106,0.2)', border: '2px solid #d4af6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#d4af6a', marginBottom: 12 }}>🔊</div>
            <div style={{ color: '#f0ede8', fontWeight: 800, fontSize: 15 }}>CLIC PARA ACTIVAR AUDIO ESTÉREO 48kHz HD</div>
            <div style={{ color: '#d4af6a', fontSize: 12, marginTop: 4 }}>Voz Real Clonada de Guillermo AI · EBU R128 (-14 LUFS)</div>
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL DEL REPRODUCTOR CON RENDERIZADO 16:9 */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '62vh', background: '#000', overflow: 'hidden' }}>
          <video ref={ref} key={v.src} src={v.src} playsInline controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
        </div>

        {/* ACTION BAR CON BOTÓN DE COMPRA DIRECTA EN WHATSAPP $0 */}
        <div style={{ padding: '8px 18px', background: 'rgba(212,175,106,0.08)', borderTop: '1px solid rgba(212,175,106,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700 }}>
            📲 Canal Directo WhatsApp Business ($0 Costo por Transacción)
          </div>
          <a
            href="https://wa.me/?text=Hola%20HB%20Jewelry%2018k,%20vengo%20desde%20el%20video%20de%20demostración%20y%20quisiera%20más%20información."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: '#25D366',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>💬 PEDIR POR WHATSAPP ($0)</span>
            <span>➔</span>
          </a>
        </div>

        {/* SUBTÍTULOS BILINGÜES EN 2 COLUMNAS */}
        <div style={{ padding: '14px 18px', background: '#161412', borderTop: '1px solid rgba(212,175,106,0.15)', maxHeight: '22vh', overflowY: 'auto' }}>
          <div style={{ color: '#d4af6a', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span>📄 BASE DE DATOS BILINGÜE DE SUBTÍTULOS DE ESTE VIDEO</span>
            <span style={{ color: '#6b6866', fontSize: 10 }}>(2 Columnas en Tiempo Real)</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#6b6866', textAlign: 'left' }}>
                <th style={{ padding: '4px 8px', width: '50px' }}>Tiempo</th>
                <th style={{ padding: '4px 8px' }}>Subtítulo Español (Voz Real)</th>
                <th style={{ padding: '4px 8px' }}>Traducción Automática Inglés</th>
              </tr>
            </thead>
            <tbody>
              {SUBTITLE_DATABASE.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#c0bcb8' }}>
                  <td style={{ padding: '4px 8px', color: '#d4af6a', fontWeight: 700 }}>{row.time}</td>
                  <td style={{ padding: '4px 8px' }}>{row.es}</td>
                  <td style={{ padding: '4px 8px', color: '#a09d99' }}>{row.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN MARKETING / VIDEO STUDIO COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Marketing() {
  const [activeVid, setActiveVid] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  return (
    <div style={{ padding: '24px 36px', width: '100%', maxWidth: '100%', boxSizing: 'border-box', color: '#f0ede8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HEADER PESTAÑA VIDEOS UNIFICADO PALETA HB GOLD (#d4af6a) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(212,175,106,0.15)' }}>
        <div>
          <span style={{ padding: '3px 10px', borderRadius: 16, background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.2)', color: '#d4af6a', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
            🎬 PARRILLA OFICIAL DE VIDEOS 100% ÚNICOS & INDEPENDIENTES
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#d4af6a', margin: '6px 0 2px 0' }}>
            Estudio de Video HD & Cursos de Automatización
          </h2>
          <p style={{ fontSize: 12, color: '#a09d99', margin: 0 }}>
            Parrilla de 6 columnas con scroll vertical. Cada tarjeta reproduce su propio archivo MP4 único.
          </p>
        </div>

        <div style={{ background: '#161412', border: '1px solid rgba(212,175,106,0.15)', padding: '8px 14px', borderRadius: 8, textAlign: 'right' }}>
          <div style={{ color: '#d4af6a', fontSize: 12, fontWeight: 700 }}>{VIDEO_CATALOG.length} Videos Únicos</div>
          <div style={{ color: '#6b6866', fontSize: 10 }}>Estudio DaVinci AI 1080p</div>
        </div>
      </div>

      {/* ─── PARRILLA DE 6 COLUMNAS CON THUMBNAILS 100% LIMPIAS (NUNGÚN BOTÓN O TEXTO SOBRE LA IMAGEN) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 14,
          maxHeight: '75vh',
          overflowY: 'auto',
          paddingRight: 4,
          paddingBottom: 20
        }}
      >
        {VIDEO_CATALOG.map((v) => {
          const isHovered = hoverId === v.id;

          return (
            <div
              key={v.id}
              onClick={() => setActiveVid(v)}
              onMouseEnter={() => setHoverId(v.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                cursor: 'pointer',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                background: isHovered ? 'rgba(212,175,106,0.06)' : '#161412',
                border: isHovered ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.12)',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-3px)' : 'none',
                boxShadow: isHovered ? '0 8px 20px rgba(212,175,106,0.15)' : '0 4px 10px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                height: 270
              }}
            >
              {/* THUMBNAIL 100% LIMPIA E INTACTA DE GUILLERMO (SIN NINGÚN BOTÓN SOBRE EL ROSTRO/CUERPO) */}
              <div style={{ position: 'relative', width: '100%', height: 165, background: '#000', overflow: 'hidden' }}>
                <img src={v.poster} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
              </div>

              {/* PANEL METADATA ESTRUCTURADO ABAJO — INCLUYE EL BOTÓN PLAY Y DIVERSIFICACIÓN */}
              <div style={{ padding: '10px 12px', background: '#161412', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(212,175,106,0.12)', border: '1px solid rgba(212,175,106,0.2)', color: '#d4af6a', fontSize: 9, fontWeight: 700 }}>
                      {v.tag}
                    </span>

                    {/* BOTÓN PLAY UBICADO ABAJO EN EL PANEL DE INFORMACIÓN SIN TAPAR EL AVATAR */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: isHovered ? '#d4af6a' : 'rgba(212,175,106,0.15)', border: '1px solid #d4af6a', padding: '2px 8px', borderRadius: 12, transition: 'all 0.2s ease' }}>
                      <span style={{ color: isHovered ? '#000' : '#d4af6a', fontSize: 10, fontWeight: 800 }}>▶ VER</span>
                    </div>

                    <span style={{ color: '#6b6866', fontSize: 9, fontWeight: 700 }}>{v.dur}</span>
                  </div>

                  <div style={{ color: '#f0ede8', fontWeight: 700, fontSize: 11, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.title}
                  </div>
                  <div style={{ color: '#a09d99', fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeVid && <VidModal v={activeVid} onClose={() => setActiveVid(null)} />}
    </div>
  );
}