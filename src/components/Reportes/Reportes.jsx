import React from 'react'
import '../../styles/hb.css'

const reportes = [
  { nombre: 'Ventas del Mes', fecha: '2026-07-01', tipo: 'Ventas', estado: 'listo', size: '124 KB' },
  { nombre: 'Inventario Actual', fecha: '2026-07-18', tipo: 'Inventario', estado: 'listo', size: '86 KB' },
  { nombre: 'Top Clientes Q2', fecha: '2026-06-30', tipo: 'Clientes', estado: 'listo', size: '54 KB' },
  { nombre: 'Performance Agentes', fecha: '2026-07-15', tipo: 'Sistema', estado: 'listo', size: '32 KB' },
  { nombre: 'ROI Campañas', fecha: '2026-07-10', tipo: 'Marketing', estado: 'procesando', size: '—' },
]

export default function Reportes() {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Reportes</div>
          <div className="hb-page-subtitle">Documentos generados y programados</div>
        </div>
        <button className="hb-btn">+ Generar reporte</button>
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Tamaño</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r, i) => (
              <tr key={i}>
                <td className="td-main">{r.nombre}</td>
                <td className="td-muted">{r.tipo}</td>
                <td className="td-dim">{r.fecha}</td>
                <td className="td-muted">{r.size}</td>
                <td>
                  <span className={`hb-badge ${r.estado === 'listo' ? 'hb-badge-green' : 'hb-badge-gray'}`}>
                    {r.estado}
                  </span>
                </td>
                <td>
                  {r.estado === 'listo' && (
                    <button className="hb-btn hb-btn-sm">Descargar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
