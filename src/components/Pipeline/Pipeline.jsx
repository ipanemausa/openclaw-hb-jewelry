import React, { useState } from 'react'
import '../../styles/hb.css'

const tareas = [
  { id: 'T-001', nombre: 'Deploy frontend Cloud Run', agente: 'antigravity', estado: 'completada', prioridad: 'alta' },
  { id: 'T-002', nombre: 'Sync inventario Shopify', agente: 'shopify', estado: 'completada', prioridad: 'media' },
  { id: 'T-003', nombre: 'Generar reporte ventas julio', agente: 'main', estado: 'completada', prioridad: 'alta' },
  { id: 'T-004', nombre: 'Procesar video campaña verano', agente: 'video', estado: 'en_cola', prioridad: 'media' },
  { id: 'T-005', nombre: 'Analizar métricas Instagram', agente: 'marketing', estado: 'pendiente', prioridad: 'baja' },
  { id: 'T-006', nombre: 'Actualizar catálogo productos', agente: 'shopify', estado: 'pendiente', prioridad: 'alta' },
]

const colorEstado = { completada: '#4ade80', en_cola: '#60a5fa', ejecutando: '#fb923c', pendiente: '#fbbf24' }
const colorPrio = { alta: '#fb7185', media: '#fbbf24', baja: '#a09d99' }

export default function Pipeline() {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Pipeline</div>
          <div className="hb-page-subtitle">Cola de tareas — agentes activos</div>
        </div>
        <button className="hb-btn">+ Nueva tarea</button>
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tarea</th>
              <th>Agente</th>
              <th>Prioridad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map(t => (
              <tr key={t.id}>
                <td className="td-dim">{t.id}</td>
                <td className="td-main">{t.nombre}</td>
                <td style={{ color: '#d4af6a', fontSize: '12px' }}>{t.agente}</td>
                <td>
                  <span style={{ fontSize: '11px', color: colorPrio[t.prioridad] }}>● {t.prioridad}</span>
                </td>
                <td>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                    color: colorEstado[t.estado] || '#a09d99',
                    border: '1px solid ' + (colorEstado[t.estado] || '#a09d99') + '40',
                    background: (colorEstado[t.estado] || '#a09d99') + '15'
                  }}>
                    {t.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
