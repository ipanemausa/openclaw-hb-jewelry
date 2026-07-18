import React from 'react'

function PlaceholderPage({ title, subtitle, icon }) {
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: '#6b6866', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>MÓDULO</div>
        <h1 style={{ fontSize: '22px', color: '#d4af6a', fontWeight: '600', marginBottom: '6px' }}>
          {icon} {title}
        </h1>
        {subtitle && <p style={{ fontSize: '13px', color: '#a09d99' }}>{subtitle}</p>}
      </div>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: '#6b6866',
        fontSize: '13px'
      }}>
        Módulo en construcción — próximamente disponible
      </div>
    </div>
  )
}

export { PlaceholderPage }
export default PlaceholderPage
