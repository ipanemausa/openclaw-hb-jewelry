import React, { useState } from 'react'

export default function AdminDashboard() {
  const [tab, setTab] = useState('resumen')

  const metrics = [
    { title: 'Valoración Inventario Oro', value: '$148,500.00', change: '+12.4%', icon: '💎', color: '#d4af6a' },
    { title: 'Ventas del Mes', value: '$42,890.00', change: '+18.2%', icon: '📈', color: '#34d399' },
    { title: 'Conversión IA WhatsApp', value: '34.2%', change: '+5.1%', icon: '💬', color: '#25d366' },
    { title: 'Llamadas Bilingües Gemini', value: '184 llamadas', change: '+24%', icon: '🎙', color: '#60a5fa' }
  ]

  const recentTransactions = [
    { id: 'ORD-9021', cliente: 'Carlos Mendoza', producto: 'Cadena Cubana Oro 14k', monto: '$1,250.00', canal: 'WhatsApp Business', fecha: 'Hoy 10:14 AM' },
    { id: 'ORD-9022', cliente: 'Elena Rostova', producto: 'Aretes Gota Diamante 18k', monto: '$890.00', canal: 'TikTok Shop', fecha: 'Hoy 09:45 AM' },
    { id: 'ORD-9023', cliente: 'Sophia Alarcón', producto: 'Anillo Solitario Esmeralda', monto: '$2,100.00', canal: 'Instagram Reels', fecha: 'Hoy 08:30 AM' },
    { id: 'ORD-9024', cliente: 'Marcus Vance', producto: 'Set Executive Gold 14k', monto: '$3,500.00', canal: 'Tienda Física', fecha: 'Ayer 05:20 PM' }
  ]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#d4af6a', margin: 0 }}>
            ⬡ Panel Ejecutivo & Control de Inventario IA
          </h2>
          <p style={{ fontSize: 13, color: '#a09d99', margin: '4px 0 0' }}>
            HB Jewelry · Cotizaciones en vivo · Precio Oro 14k/18k: $2,420.50/oz
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setTab('resumen')}
            style={{
              background: tab === 'resumen' ? 'rgba(212,175,106,0.15)' : '#1a1a1a',
              border: `1px solid ${tab === 'resumen' ? '#d4af6a' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 8, padding: '8px 16px', color: tab === 'resumen' ? '#d4af6a' : '#a09d99',
              fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}
          >
            📊 Resumen Métricas
          </button>
          <button 
            onClick={() => setTab('iframe')}
            style={{
              background: tab === 'iframe' ? 'rgba(212,175,106,0.15)' : '#1a1a1a',
              border: `1px solid ${tab === 'iframe' ? '#d4af6a' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 8, padding: '8px 16px', color: tab === 'iframe' ? '#d4af6a' : '#a09d99',
              fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}
          >
            🖥 Vista Consola Backend
          </button>
        </div>
      </div>

      {tab === 'resumen' ? (
        <>
          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <span style={{ fontSize: 11, background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{m.change}</span>
                </div>
                <div style={{ fontSize: 12, color: '#a09d99', marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Transacciones Recientes */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ede8', marginBottom: 14 }}>
              🛍 Transacciones Recientes & Cierres Automatizados
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentTransactions.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#1a1a1a', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8' }}>{t.producto}</div>
                    <div style={{ fontSize: 11, color: '#a09d99', marginTop: 2 }}>{t.cliente} · <span style={{ color: '#d4af6a' }}>{t.canal}</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>{t.monto}</div>
                    <div style={{ fontSize: 10, color: '#6b6866', marginTop: 2 }}>{t.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, minHeight: 400, border: '1px solid rgba(212, 175, 106, 0.15)', borderRadius: 10, overflow: 'hidden', background: '#0a0a0a' }}>
          <iframe src="/dashboard" title="Backend Admin" style={{ width: '100%', height: '100%', border: 'none' }} />
        </div>
      )}
    </div>
  )
}
