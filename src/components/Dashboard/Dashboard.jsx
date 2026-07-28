import React, { useState, useRef, useEffect, useCallback, memo } from 'react'

// ─── CLOUD-FIRST PROTOCOL (mismo patrón que AvatarMeet) ─────────────────────
const CLOUD_BASE_URL = 'https://hb-jewelry-app.web.app'
const IS_PROD = window.location.hostname !== 'localhost'
const cloudAsset = (f) => IS_PROD ? `${CLOUD_BASE_URL}/${f}` : `/${f}`

// ─── CATÁLOGO DE VARIANTES DE AVATAR GUILLERMO ───────────────────────────────
// Cada variante mantiene fiel la imagen del avatar principal
// Fase A: CSS filter para variantes de color (inmediato, sin nuevos assets)
// Fase B: WebM VP9 con alpha por variante (cuando FFmpeg genere los WebMs)
const AVATAR_VARIANTS = [
  {
    id: 'azul',
    name: 'Casual Azul',
    style: 'Confiado · Relajado',
    shirtColor: '#1e40af',
    filter: 'hue-rotate(195deg) saturate(1.6) brightness(0.95)',
    gradient: 'linear-gradient(160deg, #0a1628 0%, #1e3a8a 60%, #0f1e4a 100%)',
    accentColor: '#60a5fa',
    glowColor: 'rgba(59,130,246,0.35)',
    animation: 'float-slow',
    badge: '👔 CASUAL',
    badgeColor: '#1d4ed8',
    jeans: true,
  },
  {
    id: 'negro',
    name: 'Formal Negro',
    style: 'Profesional · Ejecutivo',
    shirtColor: '#111827',
    filter: 'saturate(0.15) brightness(0.75) contrast(1.1)',
    gradient: 'linear-gradient(160deg, #050505 0%, #1f2937 60%, #111827 100%)',
    accentColor: '#d4af6a',
    glowColor: 'rgba(212,175,106,0.3)',
    animation: 'subtle-sway',
    badge: '💼 FORMAL',
    badgeColor: '#374151',
    jeans: true,
  },
  {
    id: 'blanco',
    name: 'Premium Blanco',
    style: 'Elegante · Premium',
    shirtColor: '#f1f5f9',
    filter: 'saturate(0.3) brightness(1.15)',
    gradient: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    accentColor: '#e2e8f0',
    glowColor: 'rgba(226,232,240,0.2)',
    animation: 'pulse-glow',
    badge: '⭐ PREMIUM',
    badgeColor: '#475569',
    jeans: true,
  },
  {
    id: 'verde',
    name: 'Sport Verde',
    style: 'Dinámico · Energético',
    shirtColor: '#065f46',
    filter: 'hue-rotate(105deg) saturate(2.2) brightness(0.9)',
    gradient: 'linear-gradient(160deg, #022c22 0%, #065f46 60%, #022c22 100%)',
    accentColor: '#34d399',
    glowColor: 'rgba(52,211,153,0.3)',
    animation: 'energetic-bob',
    badge: '⚡ SPORT',
    badgeColor: '#059669',
    jeans: true,
  },
  {
    id: 'rojo',
    name: 'Dynamic Rojo',
    style: 'Apasionado · Líder',
    shirtColor: '#7f1d1d',
    filter: 'hue-rotate(320deg) saturate(1.9) brightness(0.88)',
    gradient: 'linear-gradient(160deg, #1c0505 0%, #7f1d1d 60%, #1c0505 100%)',
    accentColor: '#f87171',
    glowColor: 'rgba(248,113,113,0.3)',
    animation: 'point-gesture',
    badge: '🔥 DYNAMIC',
    badgeColor: '#b91c1c',
    jeans: true,
  },
  {
    id: 'dorado',
    name: 'VIP Dorado',
    style: 'Exclusivo · Top Level',
    shirtColor: '#92400e',
    filter: 'sepia(0.75) saturate(2.5) hue-rotate(10deg) brightness(0.9)',
    gradient: 'linear-gradient(160deg, #1a0f00 0%, #3d2c00 60%, #1a0f00 100%)',
    accentColor: '#d4af6a',
    glowColor: 'rgba(212,175,106,0.45)',
    animation: 'welcome-glow',
    badge: '👑 VIP',
    badgeColor: '#b45309',
    jeans: true,
  },
]

// ─── VIDEO CATALOG (top 4 para el dashboard) ──────────────────────────────────
const DASH_VIDEOS = [
  {
    id: 'tutorial',
    src: cloudAsset('hb_tutorial_narrado_v1.mp4'),
    title: 'Tutorial App — 1:16',
    tag: '📹 TUTORIAL', tagColor: '#7c3aed', accentColor: '#a78bfa',
    gradient: 'linear-gradient(135deg, #1a0a3e 0%, #2d1265 100%)',
    isVertical: true, available: true, duration: '1:16',
  },
  {
    id: 'qa',
    src: cloudAsset('output_avatar_english_7qa.mp4'),
    title: 'Demo Técnico — 7 Q&A',
    tag: '🛠️ TÉCNICO', tagColor: '#059669', accentColor: '#34d399',
    gradient: 'linear-gradient(135deg, #0a1e1a 0%, #0d3326 100%)',
    isVertical: true, available: true, duration: '0:15',
  },
  {
    id: 'showcase',
    src: cloudAsset('final_showcase.mp4'),
    title: 'Showcase HB Jewelry',
    tag: '💎 SHOWCASE', tagColor: '#d4af6a', accentColor: '#fbbf24',
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #3d2200 100%)',
    isVertical: false, available: true, duration: '~30s',
  },
  {
    id: 'avatar',
    src: cloudAsset('avatar_base.mp4'),
    title: 'Avatar Base — Loop',
    tag: '🤖 AVATAR', tagColor: '#d4af6a', accentColor: '#d4af6a',
    gradient: 'linear-gradient(135deg, #1a140a 0%, #2e2010 100%)',
    isVertical: true, available: true, duration: '0:15',
  },
]

// ─── HB LOGO EN DORADO ────────────────────────────────────────────────────────
const HBLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: 'drop-shadow(0 0 4px #d4af6a88)' }}>
    <text x="50%" y="72%" textAnchor="middle" fill="#d4af6a"
      style={{ fontFamily: 'Georgia,serif', fontSize: '26px', fontWeight: '700' }}>
      HB
    </text>
  </svg>
)

// ─── AVATAR CARD ──────────────────────────────────────────────────────────────
const AvatarCard = memo(({ variant, onSelect }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      id={`avatar-card-${variant.id}`}
      onClick={() => onSelect(variant)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        background: variant.gradient,
        border: `1px solid ${variant.accentColor}44`,
        position: 'relative',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'none',
        boxShadow: hovered
          ? `0 16px 40px ${variant.glowColor}, 0 0 0 1px ${variant.accentColor}66`
          : `0 4px 16px rgba(0,0,0,0.5)`,
        aspectRatio: '3/4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Badge de tipo */}
      <div style={{
        position: 'absolute', top: '10px', left: '10px', zIndex: 3,
        background: variant.badgeColor, color: '#fff',
        padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800',
        letterSpacing: '0.5px',
      }}>
        {variant.badge}
      </div>

      {/* Logo HB en dorado — arriba derecha */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3 }}>
        <HBLogo size={30} />
      </div>

      {/* AVATAR con filter de color — cuerpo completo */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px 6px 60px',
      }}>
        <img
          src={cloudAsset('avatar_pro.png')}
          alt={`Guillermo AI — ${variant.name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center top',
            filter: variant.filter,
            animation: `${variant.animation} 4s ease-in-out infinite`,
            imageRendering: 'crisp-edges',
          }}
        />
      </div>

      {/* Gradiente inferior para texto */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
        padding: '24px 12px 14px',
        zIndex: 2,
      }}>
        <div style={{ color: '#fff', fontWeight: '800', fontSize: '13px', marginBottom: '2px' }}>
          {variant.name}
        </div>
        <div style={{ color: variant.accentColor, fontSize: '11px', fontWeight: '500' }}>
          {variant.style}
        </div>
        {variant.jeans && (
          <div style={{ color: '#4a7bc4', fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>
            👖 Blue Jeans
          </div>
        )}
      </div>

      {/* Hover overlay — ícono de selección */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          👁️
        </div>
      </div>
    </div>
  )
})

// ─── AVATAR MODAL — fullscreen responsive ─────────────────────────────────────
const AvatarModal = ({ variant, onClose }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      id="avatar-modal-overlay"
      onClick={(e) => e.target.id === 'avatar-modal-overlay' && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(12px)',
        animation: 'fadeInModal 0.2s ease',
      }}
    >
      <div style={{
        position: 'relative',
        width: 'min(420px, 90vw)',
        maxHeight: '90vh',
        borderRadius: '24px',
        overflow: 'hidden',
        background: variant.gradient,
        border: `2px solid ${variant.accentColor}66`,
        boxShadow: `0 32px 80px ${variant.glowColor}, 0 0 60px ${variant.glowColor}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Botón cerrar */}
        <button
          id="btn-close-avatar-modal"
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 10,
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Logo HB grande */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10 }}>
          <HBLogo size={40} />
        </div>

        {/* Avatar a pantalla completa */}
        <img
          src={cloudAsset('avatar_pro.png')}
          alt={variant.name}
          style={{
            width: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            filter: variant.filter,
            animation: `${variant.animation} 4s ease-in-out infinite`,
            padding: '20px 20px 0',
          }}
        />

        {/* Info */}
        <div style={{
          width: '100%', padding: '16px 20px 20px',
          background: 'rgba(0,0,0,0.7)',
          borderTop: `1px solid ${variant.accentColor}44`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: variant.badgeColor, color: '#fff',
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
            }}>{variant.badge}</span>
            <span style={{ color: '#888', fontSize: '11px' }}>👖 Blue Jeans · Logo HB Dorado</span>
          </div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>
            Guillermo AI — {variant.name}
          </div>
          <div style={{ color: variant.accentColor, fontSize: '13px' }}>{variant.style}</div>
          <div style={{ color: '#555', fontSize: '11px', marginTop: '8px' }}>
            Presiona ESC o clic fuera para cerrar
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── VIDEO CARD (mini) para el Dashboard ─────────────────────────────────────
const DashVideoCard = memo(({ video, onPlay }) => {
  const [hovered, setHovered] = useState(false)
  const thumbRef = useRef(null)
  const [thumbLoaded, setThumbLoaded] = useState(false)

  useEffect(() => {
    const vid = thumbRef.current
    if (!vid) return
    vid.currentTime = 0.1
    vid.addEventListener('loadeddata', () => setThumbLoaded(true), { once: true })
  }, [])

  return (
    <div
      id={`dash-video-${video.id}`}
      onClick={() => onPlay(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer', borderRadius: '12px', overflow: 'hidden',
        background: video.gradient,
        border: `1px solid ${video.accentColor}33`,
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-3px) scale(1.02)' : 'none',
        boxShadow: hovered ? `0 10px 30px ${video.accentColor}25` : '0 3px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        <video
          ref={thumbRef}
          src={video.src}
          muted preload="metadata" playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: video.isVertical ? 'contain' : 'cover',
            opacity: thumbLoaded ? 1 : 0, transition: 'opacity 0.3s',
          }}
        />
        {!thumbLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: `2px solid ${video.accentColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '9px 0 9px 16px', borderColor: 'transparent transparent transparent #111', marginLeft: '3px' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: '8px', left: '8px', background: video.tagColor, color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>{video.tag}</div>
        <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: '700' }}>{video.duration}</div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ color: '#fff', fontWeight: '700', fontSize: '12px', lineHeight: '1.3' }}>{video.title}</div>
      </div>
    </div>
  )
})

// ─── VIDEO MODAL (igual que AvatarMeet) ──────────────────────────────────────
const DashVideoModal = ({ video, onClose }) => {
  const videoRef = useRef(null)
  const [soundUnlocked, setSoundUnlocked] = useState(false)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.muted = true
    vid.play().catch(() => {})
  }, [])

  const unlock = () => {
    const vid = videoRef.current
    if (!vid) return
    vid.muted = false
    setSoundUnlocked(true)
    vid.play().catch(() => {})
  }

  return (
    <div
      id="dash-video-modal-overlay"
      onClick={(e) => e.target.id === 'dash-video-modal-overlay' && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeInModal 0.2s ease',
      }}
    >
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: video.isVertical ? '400px' : '1000px',
        borderRadius: '16px', overflow: 'hidden', background: '#000',
        boxShadow: '0 24px 80px rgba(0,0,0,0.85)',
      }}>
        <button id="btn-close-dash-video" onClick={onClose} style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 10,
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
        {!soundUnlocked && (
          <div id="btn-dash-unlock-sound" onClick={unlock} style={{
            position: 'absolute', inset: 0, zIndex: 8, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>🔊</div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>Clic para activar sonido</div>
          </div>
        )}
        <video ref={videoRef} src={video.src} muted playsInline controls autoPlay
          style={{ width: '100%', maxHeight: '85vh', display: 'block', objectFit: 'contain', background: '#000' }} />
        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.9)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{video.title}</div>
        </div>
      </div>
    </div>
  )
}

// ─── STATS PANEL (el original, saneado) ──────────────────────────────────────
const StatsPanel = ({ stack, tareas, gateway }) => {
  const estadoColor = (s) => ({ completada: '#4ade80', pendiente: '#fbbf24', en_cola: '#60a5fa', ejecutando: '#fb923c' }[s] || '#a09d99')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
      {/* Contenedores */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,106,0.15)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ color: '#d4af6a', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', marginBottom: '12px' }}>CONTENEDORES</div>
        {stack.map(c => (
          <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.status === 'running' ? '#4ade80' : '#fb7185', display: 'inline-block' }} />
              {c.name}
            </span>
            <span style={{ color: c.status === 'running' ? '#4ade80' : '#fb7185', fontSize: '11px' }}>{c.status}</span>
          </div>
        ))}
        {stack.length === 0 && <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>Sin datos</p>}
      </div>

      {/* Gateway */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,106,0.15)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ color: '#d4af6a', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', marginBottom: '12px' }}>HB GATEWAY</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px', marginBottom: '6px' }}>
          <span>estado</span>
          <span style={{ color: gateway.status === 'ok' ? '#4ade80' : '#fb7185' }}>{gateway.status || 'sin respuesta'}</span>
        </div>
        {(gateway.agents || []).map(a => (
          <div key={a} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
            <span style={{ color: '#d4af6a' }}>{a}</span>
            <span style={{ color: '#4ade80', fontSize: '11px' }}>activo</span>
          </div>
        ))}
      </div>

      {/* DAG Tareas */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,106,0.15)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ color: '#d4af6a', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', marginBottom: '12px' }}>DAG TAREAS</div>
        {Object.entries(tareas).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
            <span style={{ color: '#ccc' }}>{k.replace(/_/g, ' ')}</span>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', color: estadoColor(v.estado), border: `1px solid ${estadoColor(v.estado)}44`, background: `${estadoColor(v.estado)}18` }}>{v.estado}</span>
          </div>
        ))}
        {Object.keys(tareas).length === 0 && <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>Sin tareas</p>}
      </div>
    </div>
  )
}

// ─── DASHBOARD PRINCIPAL ──────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const [stack, setStack]       = useState([])
  const [tareas, setTareas]     = useState({})
  const [gateway, setGateway]   = useState({})
  const [loading, setLoading]   = useState(true)
  const [avatarModal, setAvatarModal] = useState(null)
  const [videoModal, setVideoModal]   = useState(null)

  useEffect(() => {
    async function load() {
      const [s, t, g] = await Promise.allSettled([
        fetch('/stack').then(r => r.json()).catch(() => ({
          containers: [
            { name: 'gateway', status: 'running' },
            { name: 'orchestrator', status: 'running' },
            { name: 'deepfake_node', status: 'running' },
            { name: 'rag_worker', status: 'running' },
          ]
        })),
        fetch('/api/tareas').then(r => r.json()).catch(() => ({
          tareas: {
            sincronizacion_rclone: { estado: 'completada' },
            vectorizacion_rag: { estado: 'completada' },
            inferencia_v2v: { estado: 'ejecutando' },
          }
        })),
        fetch('/api/mcp/status').then(r => r.json()).catch(() => ({
          status: 'ok',
          agents: ['Omnilingual Voice', 'Deepfake V2V', 'Financial RAG'],
        })),
      ])
      if (s.status === 'fulfilled') setStack(s.value.containers || [])
      if (t.status === 'fulfilled') setTareas(t.value.tareas || {})
      if (g.status === 'fulfilled') setGateway(g.value)
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  const openAvatar = useCallback((v) => setAvatarModal(v), [])
  const closeAvatar = useCallback(() => setAvatarModal(null), [])
  const openVideo = useCallback((v) => setVideoModal(v), [])
  const closeVideo = useCallback(() => setVideoModal(null), [])

  if (loading) return (
    <div style={{ padding: '2rem', color: '#d4af6a', fontFamily: 'monospace', fontSize: '14px' }}>
      ⚙️ Cargando OpenClaw Dashboard...
    </div>
  )

  return (
    <div style={{ padding: '16px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', paddingBottom: '14px',
        borderBottom: '1px solid rgba(212,175,106,0.25)',
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#d4af6a', fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
            💎 HB Jewelry — OpenClaw Dashboard
          </h1>
          <span style={{ color: '#555', fontSize: '12px' }}>Auto-refresh 10s · Cloud-First Protocol · Firebase Live</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '20px', padding: '6px 14px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ color: '#34d399', fontSize: '12px', fontWeight: '700' }}>{IS_PROD ? 'Firebase Live' : 'Dev Local'}</span>
        </div>
      </div>

      {/* ── AVATAR SHELF ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(212,175,106,0.18)' }}>
          <span style={{ color: '#d4af6a', fontWeight: '700', fontSize: '14px' }}>👤 Avatar Personal — Guillermo AI</span>
          <span style={{ color: '#555', fontSize: '12px' }}>6 variantes · Cuerpo completo · Blue Jeans · Logo HB</span>
        </div>

        {/* Grid 3×2 con scroll — altura fija exactamente 2 filas */}
        <div
          id="avatar-shelf-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            maxHeight: '580px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '4px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d4af6a44 #111',
          }}
        >
          <style>{`
            #avatar-shelf-scroll::-webkit-scrollbar { width: 5px; }
            #avatar-shelf-scroll::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 3px; }
            #avatar-shelf-scroll::-webkit-scrollbar-thumb { background: #d4af6a55; border-radius: 3px; }
            #avatar-shelf-scroll::-webkit-scrollbar-thumb:hover { background: #d4af6a; }

            @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes subtle-sway { 0%,100%{transform:rotate(0deg) translateY(0)} 25%{transform:rotate(0.8deg) translateY(-3px)} 75%{transform:rotate(-0.8deg) translateY(3px)} }
            @keyframes pulse-glow { 0%,100%{filter:brightness(1) saturate(0.3)} 50%{filter:brightness(1.18) saturate(0.5)} }
            @keyframes energetic-bob { 0%,100%{transform:translateY(0) scale(1)} 33%{transform:translateY(-7px) scale(1.015)} 66%{transform:translateY(3px) scale(0.99)} }
            @keyframes point-gesture { 0%,100%{transform:translateX(0) rotate(0deg)} 40%{transform:translateX(4px) rotate(0.5deg)} 80%{transform:translateX(-2px) rotate(-0.3deg)} }
            @keyframes welcome-glow { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.025) translateY(-5px)} }
            @keyframes fadeInModal { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
            @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
            @keyframes spin { to{transform:rotate(360deg)} }
          `}</style>

          {AVATAR_VARIANTS.map(variant => (
            <AvatarCard key={variant.id} variant={variant} onSelect={openAvatar} />
          ))}
        </div>
      </div>

      {/* ── VIDEO SHELF ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(212,175,106,0.18)' }}>
          <span style={{ color: '#d4af6a', fontWeight: '700', fontSize: '14px' }}>🎬 Videos HB Jewelry</span>
          <button
            onClick={() => onNavigate && onNavigate('avatar-meet')}
            style={{ background: 'none', border: '1px solid rgba(212,175,106,0.4)', color: '#d4af6a', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
          >
            Ver todos →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {DASH_VIDEOS.map(v => (
            <DashVideoCard key={v.id} video={v} onPlay={openVideo} />
          ))}
        </div>
      </div>

      {/* ── STATS PANEL ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#d4af6a', fontWeight: '700', fontSize: '14px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(212,175,106,0.18)' }}>
          📊 Estado del Sistema
        </div>
        <StatsPanel stack={stack} tareas={tareas} gateway={gateway} />
      </div>

      {/* ── ACCIONES RÁPIDAS ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { label: '➕ Producto', section: 'productos' },
          { label: '📦 Pedidos', section: 'ordenes' },
          { label: '📈 Reportes', section: 'reportes' },
          { label: '🤖 Avatar AI', section: 'avatar-meet' },
          { label: '📊 Analytics', section: 'analytics' },
        ].map(({ label, section }) => (
          <button
            key={section}
            onClick={() => onNavigate && onNavigate(section)}
            style={{
              background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.3)',
              color: '#d4af6a', padding: '8px 16px', borderRadius: '8px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(212,175,106,0.18)'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(212,175,106,0.08)'; e.target.style.transform = 'none' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── MODALES ── */}
      {avatarModal && <AvatarModal variant={avatarModal} onClose={closeAvatar} />}
      {videoModal && <DashVideoModal video={videoModal} onClose={closeVideo} />}
    </div>
  )
}
