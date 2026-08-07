import React, { useState, useEffect } from 'react';

// ─── CLOUD-FIRST & DYNAMIC CACHE BUSTING ──────────────────────────────────────
const IS_PROD = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const STABLE_CACHE_KEY = 'v20260806_stable';
const cloudAsset = (f) => (IS_PROD ? `${window.location.origin}/${f}?v=${STABLE_CACHE_KEY}` : `/${f}?v=${STABLE_CACHE_KEY}`);

// ─── CATÁLOGO DE 10 AVATARES EXCLUSIVOS 3D (100% ROSTRO REAL DE GUILLERMO AI) ───
const AVATAR_CATALOG = [
  {
    id: 'master',
    name: 'Guillermo — Master Principal 3D',
    style: 'Identidad Raíz · HB Official Master',
    img: cloudAsset('avatar_pro.png'),
    accent: '#d4af6a',
    badge: '👑 MASTER',
    badgeBg: '#b45309',
    mesh: 'Malla Facial FLAME 3D (52 Blendshapes)',
    pose: 'De Pie · Presencia Corporativa'
  },
  {
    id: 'polo_negro',
    name: 'Guillermo — Polo Negro (Brazos Cruzados)',
    style: 'Camisa de Cuello Negra · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/negro.png'),
    accent: '#d4af6a',
    badge: '👔 POLO NEGRO 3D',
    badgeBg: '#0f172a',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'polo_blanco',
    name: 'Guillermo — Polo Blanco (Brazos Cruzados)',
    style: 'Camisa de Cuello Blanca · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/blanco.png'),
    accent: '#d4af6a',
    badge: '👔 POLO BLANCO 3D',
    badgeBg: '#475569',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'polo_azul',
    name: 'Guillermo — Polo Azul (Brazos Cruzados)',
    style: 'Camisa de Cuello Azul · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/azul.png'),
    accent: '#d4af6a',
    badge: '👔 POLO AZUL 3D',
    badgeBg: '#1d4ed8',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'polo_rojo',
    name: 'Guillermo — Polo Rojo (Brazos Cruzados)',
    style: 'Camisa de Cuello Roja · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/rojo.png'),
    accent: '#d4af6a',
    badge: '👔 POLO ROJO 3D',
    badgeBg: '#b91c1c',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'polo_verde',
    name: 'Guillermo — Polo Verde (Brazos Cruzados)',
    style: 'Camisa de Cuello Verde · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/verde.png'),
    accent: '#d4af6a',
    badge: '👔 POLO VERDE 3D',
    badgeBg: '#059669',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'polo_dorado',
    name: 'Guillermo — Polo Dorado (Brazos Cruzados)',
    style: 'Camisa de Cuello Dorada · Logo HB · Mangas Arremangadas',
    img: cloudAsset('avatars/dorado.png'),
    accent: '#d4af6a',
    badge: '👔 POLO DORADO 3D',
    badgeBg: '#b45309',
    mesh: 'Malla Facial 3D + Brazos Cruzados Rig',
    pose: 'Brazos Cruzados · Mangas Arremangadas'
  },
  {
    id: 'studio',
    name: 'Guillermo — Studio 3D (De Pie)',
    style: 'Cuerpo Entero · Micrófono Boom · Jeans',
    img: cloudAsset('avatars/studio_mic.png'),
    accent: '#d4af6a',
    badge: '🎙️ STUDIO',
    badgeBg: '#7c3aed',
    mesh: 'Rigging Volumétrico 3D Body',
    pose: 'De Pie con Micrófono de Estudio'
  },
  {
    id: 'desk',
    name: 'Guillermo — Escritorio 3D (Sentado)',
    style: 'Silla Ejecutiva · Micrófono al Frente',
    img: cloudAsset('avatars/desk_mic.png'),
    accent: '#d4af6a',
    badge: '🎧 DESK',
    badgeBg: '#1d4ed8',
    mesh: 'Postura Sentado + Malla Craneal 3D',
    pose: 'Escritorio de Radio & Podcast'
  },
  {
    id: 'podcast',
    name: 'Guillermo — Podcast Set 3D',
    style: 'Set de Grabación · Micrófono Profesional',
    img: cloudAsset('posters/poster_podcast.png'),
    accent: '#d4af6a',
    badge: '📻 PODCAST SET',
    badgeBg: '#059669',
    mesh: 'Iluminación Volumétrica de Estudio',
    pose: 'Explicación Dinámica en Set'
  },
  {
    id: 'talkgrow',
    name: 'Guillermo — Talk-Grow Format 3D',
    style: 'Formato Educativo · Subtítulos Teleprompter',
    img: cloudAsset('posters/poster_talk_grow.png'),
    accent: '#d4af6a',
    badge: '⭐ TALK-GROW',
    badgeBg: '#475569',
    mesh: 'Renderizado Físico 1080p HD',
    pose: 'Presentador Educativo RAG'
  },
  {
    id: 'technical',
    name: 'Guillermo — Technical Demo 3D',
    style: 'Demostración Técnica · English Architecture',
    img: cloudAsset('posters/poster_tecnico.png'),
    accent: '#d4af6a',
    badge: '🛠️ TECH DEMO',
    badgeBg: '#b91c1c',
    mesh: 'Malla Craneal 768-dim Vectorial',
    pose: 'Demostración de Plataforma'
  },
  {
    id: 'tutorial',
    name: 'Guillermo — Tutorial Studio 3D',
    style: 'Guía Operativa · Manejo de App HB 18k',
    img: cloudAsset('posters/poster_tutorial.png'),
    accent: '#d4af6a',
    badge: '📹 TUTORIAL',
    badgeBg: '#1e293b',
    mesh: 'Gesticulación Vocal en Tiempo Real',
    pose: 'Instructor Comercial HB'
  },
  {
    id: 'ytmaster',
    name: 'Guillermo — YouTube Master 1080p',
    style: 'Edición Especial · Curso Completo 10 Min',
    img: cloudAsset('posters/poster_yt_special.png'),
    accent: '#d4af6a',
    badge: '🔴 YT MASTER',
    badgeBg: '#9f1239',
    mesh: 'Captura Volumétrica Multicanal',
    pose: 'Masterclass de Automatización'
  }
];

export default function AvatarMeet() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverId, setHoverId] = useState(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const selectedAvatar = AVATAR_CATALOG[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? AVATAR_CATALOG.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === AVATAR_CATALOG.length - 1 ? 0 : prev + 1));
  };

  // NAVEGACIÓN POR TECLADO (FLECHAS IZQ / DER Y ESCAPE)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreenOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullScreenOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenOpen]);

  const openFullScreen = (idx) => {
    setSelectedIndex(idx);
    setIsFullScreenOpen(true);
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto', color: '#f0ede8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HEADER PESTAÑA AVATARES UNIFICADO PALETA HB GOLD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(212,175,106,0.15)' }}>
        <div>
          <span style={{ padding: '3px 10px', borderRadius: 16, background: 'rgba(212,175,106,0.08)', color: '#d4af6a', fontSize: 10, fontWeight: 700, letterSpacing: 1, border: '1px solid rgba(212,175,106,0.2)' }}>
            👑 PARRILLA OFICIAL DE AVATARES 3D (10 MOdelos GUILLERMO AI)
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d4af6a', margin: '6px 0 2px 0' }}>
            Catálogo Tridimensional de Avatares Digitales
          </h2>
          <p style={{ fontSize: 12, color: '#a09d99', margin: 0 }}>
            {AVATAR_CATALOG.length} modelos 3D de Guillermo AI. Incluye polos ejecutivos en negro y blanco con brazos cruzados. Haz clic para <strong>PANTALLA COMPLETA</strong>.
          </p>
        </div>

        <div style={{ background: '#161412', border: '1px solid rgba(212,175,106,0.15)', padding: '8px 14px', borderRadius: 8, textAlign: 'right' }}>
          <div style={{ color: '#d4af6a', fontSize: 12, fontWeight: 700 }}>Modelo Activo: {selectedAvatar.name}</div>
          <div style={{ color: '#6b6866', fontSize: 10 }}>{selectedAvatar.style}</div>
        </div>
      </div>

      {/* ─── PARRILLA HORIZONTAL DE 5 COLUMNAS CON IMÁGENES 3D DE GUILLERMO ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          maxHeight: '52vh',
          overflowY: 'auto',
          paddingRight: 4,
          paddingBottom: 14,
          marginBottom: 20
        }}
      >
        {AVATAR_CATALOG.map((av, idx) => {
          const isSelected = selectedIndex === idx;
          const isHovered = hoverId === av.id;

          return (
            <div
              key={av.id}
              onClick={() => openFullScreen(idx)}
              onMouseEnter={() => setHoverId(av.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                cursor: 'pointer',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                background: isSelected ? 'rgba(212,175,106,0.08)' : '#161412',
                border: isSelected ? '2px solid #d4af6a' : (isHovered ? '1px solid #d4af6a' : '1px solid rgba(212,175,106,0.12)'),
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-3px)' : 'none',
                boxShadow: isSelected ? '0 8px 20px rgba(212,175,106,0.2)' : '0 4px 10px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                height: 250
              }}
            >
              {/* Imagen Avatar 3D de Guillermo */}
              <div style={{ position: 'relative', width: '100%', height: 175, background: '#000', overflow: 'hidden' }}>
                <img
                  src={av.img}
                  alt={av.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    filter: isHovered || isSelected ? 'brightness(1.05)' : 'brightness(0.9)',
                    transition: 'all 0.3s ease'
                  }}
                />
                
                {/* Badge Superior */}
                <div style={{ position: 'absolute', top: 6, left: 6, zIndex: 3, padding: '2px 6px', borderRadius: 4, background: 'rgba(22,20,18,0.85)', border: '1px solid rgba(212,175,106,0.3)', color: '#d4af6a', fontSize: 9, fontWeight: 800 }}>
                  <span>{av.badge}</span>
                </div>

                <div style={{ position: 'absolute', bottom: 6, right: 6, zIndex: 3, padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.8)', border: '1px solid #d4af6a', color: '#d4af6a', fontSize: 9, fontWeight: 700 }}>
                  🔍 PANTALLA COMPLETA
                </div>
              </div>

              {/* Info Inferior */}
              <div style={{ padding: '8px 10px', background: '#161412', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: isSelected ? '#d4af6a' : '#f0ede8', fontWeight: 700, fontSize: 11, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {av.name}
                </div>
                <div style={{ color: '#6b6866', fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {av.style}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── INSPECTOR DEL MODELO SELECCIONADO ─── */}
      <div style={{ background: '#161412', border: '1px solid rgba(212,175,106,0.15)', borderRadius: 8, padding: '16px 20px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20, alignItems: 'center' }}>
        <div 
          onClick={() => openFullScreen(selectedIndex)}
          style={{ height: 150, borderRadius: 6, overflow: 'hidden', background: '#000', border: '1px solid #d4af6a', cursor: 'pointer', position: 'relative' }}
        >
          <img src={selectedAvatar.img} alt={selectedAvatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#d4af6a', fontSize: 11, background: 'rgba(0,0,0,0.85)', border: '1px solid #d4af6a', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>🔍 AMPLIAR VISTA</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(212,175,106,0.12)', border: '1px solid rgba(212,175,106,0.25)', color: '#d4af6a', fontSize: 10, fontWeight: 700 }}>{selectedAvatar.badge}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#d4af6a', margin: 0 }}>{selectedAvatar.name}</h3>
          </div>

          <p style={{ color: '#a09d99', fontSize: 12, margin: '0 0 10px 0' }}>{selectedAvatar.style}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, fontSize: 11 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#6b6866', display: 'block', marginBottom: 1 }}>Malla Facial</span>
              <strong style={{ color: '#d4af6a' }}>{selectedAvatar.mesh}</strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#6b6866', display: 'block', marginBottom: 1 }}>Postura Rigging</span>
              <strong style={{ color: '#d4af6a' }}>{selectedAvatar.pose}</strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#6b6866', display: 'block', marginBottom: 1 }}>Identidad Rostro</span>
              <strong style={{ color: '#d4af6a' }}>100% Guillermo AI</strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#6b6866', display: 'block', marginBottom: 1 }}>Audio Master</span>
              <strong style={{ color: '#d4af6a' }}>Voz Real FM 48kHz</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL IMMERSIVO DE PANTALLA COMPLETA (100VW x 100VH) CON FLECHAS IZQ/DER ─── */}
      {isFullScreenOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 5, 5, 0.96)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 32px',
            color: '#fff'
          }}
        >
          {/* BARRA SUPERIOR DEL MODAL PANTALLA COMPLETA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ padding: '3px 10px', borderRadius: 4, background: 'rgba(212,175,106,0.15)', border: '1px solid rgba(212,175,106,0.3)', color: '#d4af6a', fontSize: 11, fontWeight: 700 }}>
                  {selectedAvatar.badge}
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d4af6a', margin: 0 }}>
                  {selectedAvatar.name}
                </h2>
              </div>
              <p style={{ fontSize: 12, color: '#a09d99', margin: '4px 0 0 0' }}>
                Modelo {selectedIndex + 1} de {AVATAR_CATALOG.length} · Rostro Auténtico de Guillermo AI · {selectedAvatar.style}
              </p>
            </div>

            <button
              onClick={() => setIsFullScreenOpen(false)}
              style={{
                background: 'rgba(212,175,106,0.1)',
                border: '1px solid #d4af6a',
                color: '#d4af6a',
                fontSize: 18,
                fontWeight: 700,
                width: 44,
                height: 44,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>
          </div>

          {/* CUERPO CENTRAL CON AVATAR DE GUILLERMO EN PANTALLA COMPLETA Y FLECHAS IZQ/DER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, position: 'relative', margin: '20px 0' }}>
            
            {/* BOTÓN FLECHA IZQUIERDA (◀) */}
            <button
              onClick={handlePrev}
              style={{
                zIndex: 10,
                background: '#161412',
                border: '1px solid #d4af6a',
                color: '#d4af6a',
                width: 56,
                height: 56,
                borderRadius: '50%',
                fontSize: 22,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                transition: 'all 0.2s ease'
              }}
            >
              ◀
            </button>

            {/* CONTENEDOR DE LA IMAGEN AUTÉNTICA DE GUILLERMO EN ALTA RESOLUCIÓN */}
            <div style={{ position: 'relative', height: '72vh', maxWidth: '60vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={selectedAvatar.img}
                alt={selectedAvatar.name}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.9))'
                }}
              />
            </div>

            {/* BOTÓN FLECHA DERECHA (▶) */}
            <button
              onClick={handleNext}
              style={{
                zIndex: 10,
                background: '#161412',
                border: '1px solid #d4af6a',
                color: '#d4af6a',
                width: 56,
                height: 56,
                borderRadius: '50%',
                fontSize: 22,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                transition: 'all 0.2s ease'
              }}
            >
              ▶
            </button>

          </div>

          {/* BARRA INFERIOR DE CONTROLES DEL MODAL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161412', border: '1px solid rgba(212,175,106,0.2)', padding: '12px 24px', borderRadius: 8, zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              <span style={{ color: '#a09d99' }}>Rostro: <strong style={{ color: '#d4af6a' }}>100% Guillermo AI Auténtico</strong></span>
              <span style={{ color: '#a09d99' }}>Malla 3D: <strong style={{ color: '#d4af6a' }}>{selectedAvatar.mesh}</strong></span>
              <span style={{ color: '#a09d99' }}>Formato: <strong style={{ color: '#d4af6a' }}>PNG RGBA 1080p Transparent</strong></span>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#6b6866' }}>Navega con ◄ y ► en tu teclado</span>
              <button
                onClick={() => setIsFullScreenOpen(false)}
                style={{
                  background: 'rgba(212,175,106,0.15)',
                  border: '1px solid #d4af6a',
                  color: '#d4af6a',
                  padding: '8px 18px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                CERRAR VISTA COMPLETA ✕
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
