import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AvatarMeet.css';

// ─── CLOUD-FIRST PROTOCOL ────────────────────────────────────────────────────
const CLOUD_BASE_URL = 'https://hb-jewelry-app.web.app';
const IS_PROD = window.location.hostname !== 'localhost';
const cloudAsset = (f) => IS_PROD ? `${CLOUD_BASE_URL}/${f}` : `/${f}`;

// ─── CATÁLOGO DE VIDEOS — cada video es una tarjeta ──────────────────────────
// Mínimo 6 tarjetas para llenar la sección (2 filas × 3 columnas)
// Agrega nuevos videos aquí y el shelf se expande automáticamente con scroll
const VIDEO_CATALOG = [
  {
    id: 'tutorial',
    src: cloudAsset('hb_tutorial_narrado_v1.mp4'),
    title: 'Tutorial: Manejo Completo de la App',
    subtitle: 'Narrado por Guillermo Avatar AI',
    duration: '1:16',
    tag: '📹 TUTORIAL',
    tagColor: '#7c3aed',
    description: 'Guía completa: Ventas, Analytics, Avatar AI y Nube 5TB. Narración AlonsoNeural con EQ profesional EBU R128.',
    gradient: 'linear-gradient(135deg, #1a0a3e 0%, #2d1265 50%, #0f0a1e 100%)',
    accentColor: '#a78bfa',
    isVertical: true,
    available: true,
  },
  {
    id: 'qa-avatar',
    src: cloudAsset('output_avatar_english_7qa.mp4'),
    title: 'Demo Arquitectura Técnica — 7 Q&A',
    subtitle: 'Guillermo Avatar · Inglés · 15 segundos',
    duration: '0:15',
    tag: '🛠️ TÉCNICO',
    tagColor: '#059669',
    description: 'Demostración técnica: RAG 768-dim, WhatsApp Baileys $0, WhisperFlow y Rclone 5TB.',
    gradient: 'linear-gradient(135deg, #0a1e1a 0%, #0d3326 50%, #051a10 100%)',
    accentColor: '#34d399',
    isVertical: true,
    available: true,
  },
  {
    id: 'avatar-base',
    src: cloudAsset('avatar_base.mp4'),
    title: 'Avatar Base — Guillermo AI Loop',
    subtitle: 'Video base del avatar · Loop',
    duration: '0:15',
    tag: '🤖 AVATAR',
    tagColor: '#d4af6a',
    description: 'Video base del avatar digital de Guillermo para composición y lip-sync.',
    gradient: 'linear-gradient(135deg, #1a140a 0%, #2e2010 50%, #0f0a05 100%)',
    accentColor: '#d4af6a',
    isVertical: true,
    available: true,
  },
  {
    id: 'showcase',
    src: cloudAsset('final_showcase.mp4'),
    title: 'HB Jewelry — Showcase Final',
    subtitle: 'Presentación de productos · 16:9',
    duration: '~30s',
    tag: '💎 SHOWCASE',
    tagColor: '#d4af6a',
    description: 'Video showcase de la colección HB Jewelry con fondo musical y efectos visuales.',
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #3d2200 50%, #1a0e00 100%)',
    accentColor: '#fbbf24',
    isVertical: false,
    available: true,
  },
  {
    id: 'coming-lipsync',
    src: null,
    title: 'Lip-Sync Real — SadTalker AI',
    subtitle: 'Próximamente · Fase 2',
    duration: '--',
    tag: '🚀 PRÓXIMO',
    tagColor: '#6366f1',
    description: 'Video con boca sincronizada al audio real usando SadTalker. Foto PNG → video animado con movimiento de labios.',
    gradient: 'linear-gradient(135deg, #0a0a1e 0%, #12123a 50%, #0a0a1e 100%)',
    accentColor: '#6366f1',
    isVertical: true,
    available: false,  // placeholder — no disponible aún
  },
  {
    id: 'coming-tiktok',
    src: null,
    title: 'TikTok Viral — Subtítulos Animados',
    subtitle: 'Próximamente · Plantilla TikTok',
    duration: '--',
    tag: '📱 PRÓXIMO',
    tagColor: '#ec4899',
    description: 'Plantilla TikTok viral con subtítulos animados, lower-third y transiciones. Pipeline automatizado: guión → video.',
    gradient: 'linear-gradient(135deg, #1a0a14 0%, #3a1428 50%, #1a0a14 100%)',
    accentColor: '#ec4899',
    isVertical: true,
    available: false,  // placeholder — próximamente
  },
];


// ─── COMPONENTE TARJETA DE VIDEO (estilo YouTube) ─────────────────────────────
const VideoCard = ({ video, onPlay }) => {
  const thumbRef = useRef(null);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Capturar primer frame como miniatura (solo si hay src disponible)
  useEffect(() => {
    const vid = thumbRef.current;
    if (!vid || !video.available) return;
    vid.currentTime = 0.1;
    vid.addEventListener('loadeddata', () => setThumbLoaded(true), { once: true });
  }, [video.available]);

  // ── TARJETA PRÓXIMAMENTE (sin video aún) ──
  if (!video.available) {
    return (
      <div
        id={`card-video-${video.id}`}
        style={{
          borderRadius: '14px', overflow: 'hidden',
          background: video.gradient,
          border: `1px solid ${video.accentColor}22`,
          opacity: 0.75,
          cursor: 'default',
        }}
      >
        {/* Miniatura placeholder */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px',
          }}>
            <div style={{ fontSize: '36px' }}>🔒</div>
            <div style={{ color: video.accentColor, fontWeight: '700', fontSize: '13px' }}>Próximamente</div>
          </div>
          {/* Tag */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: video.tagColor, color: '#fff',
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
          }}>{video.tag}</div>
          {/* Duration */}
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'rgba(0,0,0,0.85)', color: '#fff',
            padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700',
          }}>{video.duration}</div>
        </div>
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ color: '#ccc', fontWeight: '700', fontSize: '14px', lineHeight: '1.4', marginBottom: '6px' }}>{video.title}</div>
          <div style={{ color: video.accentColor, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{video.subtitle}</div>
          <div style={{ color: '#666', fontSize: '12px', lineHeight: '1.5' }}>{video.description}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`card-video-${video.id}`}
      onClick={() => onPlay(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: '14px',
        overflow: 'hidden',
        background: video.gradient,
        border: `1px solid ${video.accentColor}33`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: hovered ? `0 12px 40px ${video.accentColor}30` : '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Miniatura del video */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 aspect ratio para la tarjeta */ }}>
        <video
          ref={thumbRef}
          src={video.src}
          muted
          preload="metadata"
          playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: video.isVertical ? 'contain' : 'cover',
            background: '#000',
            opacity: thumbLoaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Placeholder mientras carga */}
        {!thumbLoaded && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)'
          }}>
            <div style={{ width: '40px', height: '40px', border: `3px solid ${video.accentColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Overlay al hover — botón de play */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '12px 0 12px 22px', borderColor: 'transparent transparent transparent #111', marginLeft: '4px' }} />
          </div>
        </div>

        {/* Badge de duración */}
        <div style={{
          position: 'absolute', bottom: '8px', right: '8px',
          background: 'rgba(0,0,0,0.85)', color: '#fff',
          padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700',
          letterSpacing: '0.5px',
        }}>
          {video.duration}
        </div>

        {/* Tag del tipo */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: video.tagColor, color: '#fff',
          padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
        }}>
          {video.tag}
        </div>
      </div>

      {/* Información debajo de la miniatura */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: '1.4', marginBottom: '6px' }}>
          {video.title}
        </div>
        <div style={{ color: video.accentColor, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
          {video.subtitle}
        </div>
        <div style={{ color: '#888', fontSize: '12px', lineHeight: '1.5' }}>
          {video.description}
        </div>
      </div>
    </div>
  );
};

// ─── MODAL DE VIDEO FULLSCREEN RESPONSIVE ─────────────────────────────────────
const VideoModal = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Auto-play al abrir
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {});
  }, []);

  const unlockSound = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    setSoundUnlocked(true);
    vid.play().catch(() => {});
  }, []);

  return (
    <div
      id="video-modal-overlay"
      onClick={(e) => e.target.id === 'video-modal-overlay' && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Contenedor del video — responsive */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: video.isVertical ? '420px' : '1100px',  // 9:16 → angosto, 16:9 → ancho
        maxHeight: '90vh',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
      }}>

        {/* Botón cerrar */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 10,
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          ✕
        </button>

        {/* Overlay de sonido — se muestra solo si no se ha desbloqueado */}
        {!soundUnlocked && (
          <div
            id="btn-unlock-sound-modal"
            onClick={unlockSound}
            style={{
              position: 'absolute', inset: 0, zIndex: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔊</div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px', textAlign: 'center' }}>
              Clic para activar el sonido
            </div>
            <div style={{ color: '#d4af6a', fontSize: '12px', marginTop: '6px' }}>
              Requerido por política del navegador
            </div>
          </div>
        )}

        {/* VIDEO — fills the container, responsive */}
        <video
          id="modal-video-player"
          ref={videoRef}
          src={video.src}
          muted
          playsInline
          controls
          autoPlay
          style={{
            width: '100%',
            maxHeight: '88vh',
            display: 'block',
            objectFit: 'contain',
            background: '#000',
          }}
        />

        {/* Título del video en el modal */}
        <div style={{
          padding: '12px 16px', background: 'rgba(0,0,0,0.9)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>{video.title}</div>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{video.subtitle} · {video.duration}</div>
        </div>
      </div>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const AvatarMeet = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [responseTitle, setResponseTitle] = useState('HB Jewelry — Biblioteca de Videos Guillermo AI');
  const [responseText, setResponseText] = useState('Selecciona cualquier tarjeta para reproducir el video en pantalla completa. El audio se activa con un clic. Todos los videos están alojados en Firebase Cloud.');

  const openVideo = useCallback((video) => {
    setActiveModal(video);
    setResponseTitle(`▶ Reproduciendo: ${video.title}`);
    setResponseText(video.description);
  }, []);

  const closeVideo = useCallback(() => setActiveModal(null), []);

  return (
    <div className="avatar-meet-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1a1200 100%)',
        border: '1px solid rgba(212,175,106,0.3)',
        borderRadius: '14px', padding: '16px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#d4af6a', fontSize: '22px', fontWeight: '800' }}>
            💎 HB Jewelry — Canal de Videos Guillermo AI
          </h2>
          <span style={{ color: '#888', fontSize: '13px' }}>
            {VIDEO_CATALOG.length} videos · Firebase Cloud · Haz clic en cualquier tarjeta para reproducir
          </span>
        </div>
        <div style={{
          display: 'flex', gap: '6px', alignItems: 'center',
          background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: '20px', padding: '6px 14px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#34d399', fontSize: '12px', fontWeight: '700' }}>
            {IS_PROD ? 'Firebase Live' : 'Dev Local'}
          </span>
        </div>
      </div>

      {/* Caja de info actual */}
      <div style={{
        background: '#141414', border: '1px solid rgba(212,175,106,0.25)',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
        borderLeft: '4px solid #d4af6a',
      }}>
        <div style={{ color: '#d4af6a', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>
          {responseTitle}
        </div>
        <div style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5' }}>
          {responseText}
        </div>
      </div>

      {/* ── SHELF DE VIDEOS — Sección scrolleable fija (2 filas × 3 cols) ── */}
      <div style={{ marginBottom: '20px' }}>

        {/* Encabezado del shelf con contador */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '12px', paddingBottom: '8px',
          borderBottom: '1px solid rgba(212,175,106,0.2)',
        }}>
          <span style={{ color: '#d4af6a', fontWeight: '700', fontSize: '14px' }}>🎬 Biblioteca de Videos</span>
          <span style={{ color: '#555', fontSize: '12px' }}>
            {VIDEO_CATALOG.filter(v => v.available).length} disponibles · {VIDEO_CATALOG.filter(v => !v.available).length} próximamente
          </span>
        </div>

        {/* Contenedor scrolleable — altura fija = exactamente 2 filas de tarjetas */}
        <div
          id="video-shelf-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',  /* 3 columnas fijas */
            gap: '16px',
            /* Altura fija = 2 filas: cada tarjeta ~290px (56.25% de (containerWidth/3)) + info ~110px */
            maxHeight: '620px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '4px',
            /* Scrollbar personalizado */
            scrollbarWidth: 'thin',
            scrollbarColor: '#d4af6a33 #111',
          }}
        >
          {/* Scrollbar webkit */}
          <style>{`
            #video-shelf-scroll::-webkit-scrollbar { width: 6px; }
            #video-shelf-scroll::-webkit-scrollbar-track { background: #111; border-radius: 3px; }
            #video-shelf-scroll::-webkit-scrollbar-thumb { background: #d4af6a55; border-radius: 3px; }
            #video-shelf-scroll::-webkit-scrollbar-thumb:hover { background: #d4af6a; }
          `}</style>

          {VIDEO_CATALOG.map(video => (
            <VideoCard key={video.id} video={video} onPlay={openVideo} />
          ))}
        </div>

        {/* Indicador de scroll si hay más de 6 */}
        {VIDEO_CATALOG.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '8px', color: '#555', fontSize: '11px' }}>
            ↕ Desplaza para ver {VIDEO_CATALOG.length - 6} videos más
          </div>
        )}
      </div>

      {/* Nota al pie */}
      <div style={{
        textAlign: 'center', color: '#555', fontSize: '12px', paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        ☁️ Cloud-First Protocol · Firebase → Rclone → Localhost · Todos los videos en resolución original
        <span style={{ marginLeft: '12px', color: '#d4af6a' }}>
          Presiona ESC para cerrar el reproductor
        </span>
      </div>

      {/* MODAL DE VIDEO — se abre al hacer clic en una tarjeta */}
      {activeModal && <VideoModal video={activeModal} onClose={closeVideo} />}

      {/* CSS de animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AvatarMeet;
