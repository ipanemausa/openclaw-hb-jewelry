import React from 'react'
import '../../styles/hb.css'

const stats = [
  { label: 'Visitas totales', value: '12,840', change: '+18%', up: true },
  { label: 'Conversion rate', value: '3.2%', change: '+0.4%', up: true },
  { label: 'Revenue mensual', value: '$48,200', change: '+12%', up: true },
  { label: 'Ticket promedio', value: '$380', change: '-5%', up: false },
]

const canales = [
  { nombre: 'Instagram', sesiones: 4820, ventas: 28, revenue: 12400 },
  { nombre: 'Facebook', sesiones: 2340, ventas: 14, revenue: 6800 },
  { nombre: 'Google Ads', sesiones: 3100, ventas: 22, revenue: 9200 },
  { nombre: 'Shopify Direct', sesiones: 1800, ventas: 18, revenue: 7600 },
  { nombre: 'WhatsApp', sesiones: 780, ventas: 8, revenue: 4200 },
]

export default function Analytics() {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Analytics</div>
          <div className="hb-page-subtitle">Métricas del mes actual</div>
        </div>
        <button className="hb-btn">Exportar</button>
      </div>

      <div className="hb-grid" style={{ marginBottom: '20px' }}>
        {stats.map(s => (
          <div key={s.label} className="hb-card">
            <div className="hb-card-meta">{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#f0ede8', margin: '8px 0 4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: s.up ? '#4ade80' : '#fb7185' }}>{s.change} vs mes anterior</div>
          </div>
        ))}
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Canal</th>
              <th>Sesiones</th>
              <th>Ventas</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {canales.map(c => (
              <tr key={c.nombre}>
                <td className="td-main">{c.nombre}</td>
                <td className="td-muted">{c.sesiones.toLocaleString()}</td>
                <td className="td-main">{c.ventas}</td>
                <td className="td-gold">${c.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
