import React, { useState, useEffect } from 'react'
import '../../styles/hb.css'

export default function Dashboard() {
  const [stack,   setStack]   = useState([])
  const [tareas,  setTareas]  = useState({})
  const [gateway, setGateway] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, t, g] = await Promise.allSettled([
        fetch('/stack').then(r => r.json()),
        fetch('/api/tareas').then(r => r.json()),
        fetch('/api/mcp/status').then(r => r.json()),
      ])
      if (s.status === 'fulfilled') setStack(s.value.containers || [])
      if (t.status === 'fulfilled') setTareas(t.value.tareas || {})
      if (g.status === 'fulfilled') setGateway(g.value)
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  const estadoColor = s => ({
    completada: '#4ade80',
    pendiente:  '#fbbf24',
    en_cola:    '#60a5fa',
    ejecutando: '#fb923c',
  }[s] || '#a09d99')

  if (loading) return (
    <div style={{ padding: '2rem', color: '#d4af6a', fontFamily: 'monospace', fontSize: '14px' }}>
      ⬡ Cargando LAMAUTONOMIA...
    </div>
  )

  return (
    <div className='hb-page'>

      {/* Título central */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#d4af6a', fontSize: '1.4rem', marginBottom: '4px' }}>⬡ LAMAUTONOMIA</h1>
        <p style={{ color: '#6b6866', fontSize: '0.8rem' }}>auto-refresh 10s</p>
      </div>

      {/* 3 paneles principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '24px' }}>

        {/* CONTENEDORES */}
        <div className='hb-card'>
          <div style={{ color: '#d4af6a', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '12px', fontWeight: '600' }}>
            CONTENEDORES
          </div>
          {stack.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
              <span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c.status === 'running' ? '#4ade80' : '#fb7185', marginRight: '6px' }}/>
                {c.name}
              </span>
              <span style={{ color: c.status === 'running' ? '#4ade80' : '#fb7185' }}>{c.status}</span>
            </div>
          ))}
          {stack.length === 0 && <p className='hb-empty'>Sin datos de contenedores</p>}
        </div>

        {/* HB JEWELRY — GATEWAY */}
        <div className='hb-card'>
          <div style={{ color: '#d4af6a', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '12px', fontWeight: '600' }}>
            HB JEWELRY — GATEWAY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
            <span>estado</span>
            <span style={{ color: gateway.status === 'ok' ? '#4ade80' : '#fb7185' }}>{gateway.status || 'sin respuesta'}</span>
          </div>
          {(gateway.agents || []).map(a => (
            <div key={a} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
              <span style={{ color: '#d4af6a' }}>⬡ {a}</span>
              <span style={{ color: '#4ade80' }}>activo</span>
            </div>
          ))}
        </div>

        {/* DAG — TAREAS */}
        <div className='hb-card'>
          <div style={{ color: '#d4af6a', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '12px', fontWeight: '600' }}>
            DAG — TAREAS
          </div>
          {Object.entries(tareas).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
              <span>{k.replace(/_/g, ' ')}</span>
              <span style={{
                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                color: estadoColor(v.estado),
                border: '1px solid ' + estadoColor(v.estado) + '40',
                background: estadoColor(v.estado) + '20'
              }}>{v.estado}</span>
            </div>
          ))}
          {Object.keys(tareas).length === 0 && <p className='hb-empty'>Sin tareas</p>}
        </div>

      </div>

      {/* Actividad reciente */}
      <div className='hb-card' style={{ marginBottom: '16px' }}>
        <div style={{ color: '#d4af6a', fontWeight: '600', marginBottom: '12px' }}>Actividad reciente</div>
        <p className='hb-empty'>No hay actividad reciente</p>
      </div>

      {/* Acciones rápidas */}
      <div className='hb-card'>
        <div style={{ color: '#d4af6a', fontWeight: '600', marginBottom: '12px' }}>Acciones rápidas</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className='hb-btn'>Agregar producto</button>
          <button className='hb-btn'>Ver pedidos</button>
          <button className='hb-btn'>Reportes</button>
        </div>
      </div>

    </div>
  )
}
