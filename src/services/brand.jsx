import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   OPENCLAW BRAND DESIGN SYSTEM & PANTONE PALETTE ENGINE 2026
   Inspirado en Skilio / Adrián Sáenz — Estética Neutra, Cálida & Minimalista
   ═══════════════════════════════════════════════════════════════════════════ */

export const BRAND_TOKENS = {
  // Base Neutral Paper Colors
  cream: '#F5EFE6',
  creamDeep: '#EDE4D2',
  paper: '#FAF6EE',
  ink: '#2B2622',
  ink2: '#5A4F45',
  ink3: '#8C8275',
  ink4: '#B8AE9D',
  line: '#D8CFC0',
  lineSoft: '#E8DFD0',

  // 6 Soft Pantone Palettes (Mismo Chroma & Balance HSL)
  pantone: {
    greige:   { tint: '#EFE6D2', mid: '#C9BBA0', deep: '#8A7B62', ink: '#5C4F3B', name: 'Greige' },
    sage:     { tint: '#DCE4D2', mid: '#A8B895', deep: '#6E8059', ink: '#4D5C3D', name: 'Salvia' },
    lavender: { tint: '#E1DAE6', mid: '#B6A8C4', deep: '#8473A0', ink: '#5C4E73', name: 'Lavanda' },
    sky:      { tint: '#D8E1E7', mid: '#A7BACA', deep: '#6F8DA4', ink: '#4D6577', name: 'Cielo' },
    blush:    { tint: '#ECD9D2', mid: '#D2A99A', deep: '#A87567', ink: '#76493D', name: 'Rubor' },
    clay:     { tint: '#E5C9B3', mid: '#C99577', deep: '#9A6243', ink: '#6B4029', name: 'Arcilla' }
  },

  // Typography Tokens
  fonts: {
    title: 'Cormorant Garamond, Georgia, serif',
    body: 'Manrope, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  }
};

/* ─── PRIMITIVES & COMPONENTS ─────────────────────────────────────────────── */

export const Checkbox = ({ on = false, onChange }) => (
  <span
    className="lp-cb"
    onClick={onChange}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      borderRadius: 3,
      border: `1.2px solid ${on ? BRAND_TOKENS.pantone.greige.deep : BRAND_TOKENS.line}`,
      background: on ? BRAND_TOKENS.pantone.greige.tint : 'transparent',
      cursor: 'pointer',
      fontSize: 10,
      color: BRAND_TOKENS.pantone.greige.deep,
      userSelect: 'none'
    }}
  >
    {on ? '✓' : ''}
  </span>
);

export const Eyebrow = ({ text, color = BRAND_TOKENS.ink3, line = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
    <span style={{ fontFamily: BRAND_TOKENS.fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color, fontWeight: 600 }}>
      {text}
    </span>
    {line && <div style={{ flexGrow: 1, height: 1, background: BRAND_TOKENS.lineSoft }} />}
  </div>
);

export const LinkChip = ({ label, active = false, theme = 'greige' }) => {
  const pal = BRAND_TOKENS.pantone[theme] || BRAND_TOKENS.pantone.greige;
  return (
    <span
      className="lp-link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 12,
        border: `1px solid ${active ? pal.deep : BRAND_TOKENS.line}`,
        background: active ? pal.tint : 'transparent',
        color: active ? pal.ink : BRAND_TOKENS.ink2,
        fontSize: 11,
        fontFamily: BRAND_TOKENS.fonts.body,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </span>
  );
};

export const SideTabs = ({ theme = 'greige', activeTab = 'Productividad', onTabSelect }) => {
  const pal = BRAND_TOKENS.pantone[theme] || BRAND_TOKENS.pantone.greige;
  const tabs = ['Estilo', 'Bienestar', 'Autocuidado', 'Finanzas', 'Productividad'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 36, background: BRAND_TOKENS.creamDeep, borderLeft: `1px solid ${BRAND_TOKENS.line}` }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <div
            key={tab}
            className="lp-link"
            onClick={() => onTabSelect && onTabSelect(tab)}
            style={{
              flex: 1,
              minHeight: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              padding: '8px 2px',
              fontSize: 9,
              fontFamily: BRAND_TOKENS.fonts.body,
              fontWeight: isActive ? 800 : 500,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: isActive ? pal.ink : BRAND_TOKENS.ink3,
              background: isActive ? pal.tint : 'transparent',
              borderRight: isActive ? `3px solid ${pal.deep}` : 'none',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};

export const TopNav = ({ theme = 'greige', title = 'Planner Digital Todo en Uno' }) => {
  const pal = BRAND_TOKENS.pantone[theme] || BRAND_TOKENS.pantone.greige;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: BRAND_TOKENS.paper, borderBottom: `1px solid ${BRAND_TOKENS.line}` }}>
      <div style={{ fontFamily: BRAND_TOKENS.fonts.title, fontSize: 16, fontStyle: 'italic', color: BRAND_TOKENS.ink, fontWeight: 600 }}>
        Linen Paper Co. — {title}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Índice', 'Año', 'Mes', 'Semana', 'Día', 'Notas'].map((item) => (
          <LinkChip key={item} label={item} theme={theme} />
        ))}
      </div>
      <div style={{ fontFamily: BRAND_TOKENS.fonts.mono, fontSize: 10, color: pal.deep, background: pal.tint, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
        Sin fechar · {pal.name}
      </div>
    </div>
  );
};

export default {
  BRAND_TOKENS,
  Checkbox,
  Eyebrow,
  LinkChip,
  SideTabs,
  TopNav
};
