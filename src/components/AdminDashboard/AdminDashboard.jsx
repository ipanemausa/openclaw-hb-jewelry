import React from 'react'

export default function AdminDashboard() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#d4af6a', marginBottom: '4px' }}>
          ⬡ Panel de Control Backend
        </h1>
        <p style={{ fontSize: '12px', color: '#6b6866' }}>
          Administración y Cotizaciones de HB Jewelry
        </p>
      </div>
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        border: '1px solid rgba(212, 175, 106, 0.15)', 
        borderRadius: '10px', 
        overflow: 'hidden', 
        background: '#0a0a0a' 
      }}>
        <iframe 
          src="/dashboard" 
          title="Backend Admin" 
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  )
}
