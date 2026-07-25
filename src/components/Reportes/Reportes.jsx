import React, { useState } from 'react'

const initialReportes = [
  { id: 1, nombre: 'Valuación de Inventario Oro 14k/18k', fecha: '2026-07-23', tipo: 'Inventario', estado: 'listo', size: '142 KB' },
  { id: 2, nombre: 'Reporte Conversión WhatsApp Business ($0)', fecha: '2026-07-23', tipo: 'Ventas', estado: 'listo', size: '98 KB' },
  { id: 3, nombre: 'Rendimiento Agente Bilingüe Gemini Live', fecha: '2026-07-22', tipo: 'Sistema', estado: 'listo', size: '64 KB' },
  { id: 4, nombre: 'Métricas Difusión TikTok & Instagram Reels', fecha: '2026-07-21', tipo: 'Marketing', estado: 'listo', size: '112 KB' },
  { id: 5, nombre: 'Auditoría RAG Embeddings 768-dim Firebase', fecha: '2026-07-20', tipo: 'RAG Nube', estado: 'listo', size: '85 KB' }
]

export default function Reportes() {
  const [list, setList] = useState(initialReportes)
  const [generating, setGenerating] = useState(false)

  const descargarReporte = (r) => {
    const csvContent = `data:text/csv;charset=utf-8,ID,Nombre,Tipo,Fecha,Estado\n1,${r.nombre},${r.tipo},${r.fecha},OK\n`
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${r.nombre.replace(/\s+/g, '_')}_2026.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generarNuevo = () => {
    setGenerating(true)
    setTimeout(() => {
      const nuevo = {
        id: Date.now(),
        nombre: `Reporte Consolidado HB Jewelry ${new Date().toLocaleTimeString()}`,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Ejecutivo',
        estado: 'listo',
        size: '156 KB'
      }
      setList(prev => [nuevo, ...prev])
      setGenerating(false)
    }, 1200)
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f0ede8', margin: 0 }}>
            📊 Centro de Reportes & Exportación Ejecutiva
          </h2>
          <p style={{ fontSize: 13, color: '#a09d99', margin: '4px 0 0' }}>
            Descarga de informes financieros, inventario de oro y telemetría IA de HB Jewelry
          </p>
        </div>
        <button 
          onClick={generarNuevo}
          disabled={generating}
          style={{
            background: 'linear-gradient(135deg, #d4af6a, #aa8237)',
            color: '#000', border: 'none', borderRadius: 8,
            padding: '9px 18px', fontSize: 13, fontWeight: 600,
            cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.6 : 1
          }}
        >
          {generating ? 'Generando...' : '+ Generar Reporte Nuevo'}
        </button>
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#a09d99' }}>
              <th style={{ padding: '12px 16px' }}>Nombre del Documento</th>
              <th style={{ padding: '12px 16px' }}>Tipo</th>
              <th style={{ padding: '12px 16px' }}>Fecha</th>
              <th style={{ padding: '12px 16px' }}>Tamaño</th>
              <th style={{ padding: '12px 16px' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f0ede8' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{r.nombre}</td>
                <td style={{ padding: '14px 16px', color: '#d4af6a' }}>{r.tipo}</td>
                <td style={{ padding: '14px 16px', color: '#6b6866' }}>{r.fecha}</td>
                <td style={{ padding: '14px 16px', color: '#a09d99' }}>{r.size}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button 
                    onClick={() => descargarReporte(r)}
                    style={{
                      background: 'rgba(212,175,106,0.12)', border: '1px solid rgba(212,175,106,0.3)',
                      color: '#d4af6a', borderRadius: 6, padding: '4px 12px', fontSize: 12,
                      fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    ⬇ Descargar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
