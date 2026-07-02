import React, { useState, useEffect } from 'react'
import '../../styles/hb.css'

const estadoColor = s => ({
  completada:  '#4ade80',
  pendiente:   '#fbbf24',
  en_cola:     '#60a5fa',
  ejecutando:  '#fb923c',
}[s] || '#a09d99')

const STAT_CARDS = [
  { label: 'Ventas hoy',   value: '$0', sub: '0 órdenes',   icon: '◆', color: '#d4af6a' },
  { label: 'Productos',    value: '0',  sub: 'en catálogo', icon: '◇', color: '#60a5fa' },
  { label: 'Clientes',     value: '0',  sub: 'registrados', icon: '👥', color: '#34d399' },
  { label: 'Contenedores', value: '0',  sub: 'activos',     icon: '🐳', color: '#a78bfa' },
]

export default function Dashboard() {
  const [stack,   setStack]   = useState([])
  const [tareas,  setTareas]  = useState({})
  const [gateway, setGateway] = useState({})
  const [stats,   setStats]   = useState(STAT_CARDS)
  const [loading, setLoading] = useState(true)
  const [ts, setTs] = useState('')

  useEffect(() => {
    setTs(new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }))

    async function load() {
      const [s, t, g, ventas, productos] = await Promise.allSettled([
        fetch('/api/stack').then(r => r.json()),
        fetch('/api/tareas').then(r => r.json()),
        fetch('/api/mcp/status').then(r => r.json()),
        fetch('/api/ventas').then(r => r.json()),
        fetch('/api/productos').then(r => r.json()),
      ])

      if (s.status === 'fulfilled') {
        const containers = s.value.containers || []
        setStack(containers)
        const running = containers.filter(c => c.status === 'running').length
        setStats(prev => prev.map(st => st.label === 'Contenedores'
          ? { ...st, value: running, sub: `${running} running` } : st))
      }
      if (t.status === 'fulfilled') setTareas(t.value.tareas || {})
      if (g.status === 'fulfilled') setGateway(g.value)
      if (ventas.status === 'fulfilled') {
        const vv = ventas.value.ventas || []
        const total = vv.reduce((a, v) => a + (v.total || 0), 0)
        setStats(prev => prev.map(st => st.label === 'Ventas hoy'
          ? { ...st, value: `$${total.toLocaleString()}`, sub: `${vv.length} órdenes` } : st))
      }
      if (productos.status === 'fulfilled') {
        const n = (productos.value.productos || []).length
        setStats(prev => prev.map(st => st.label === 'Productos'
          ? { ...st, value: n, sub: `${n} en catálogo` } : st))
      }
      setLoading(false)
    }

    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div style={{ padding:'2rem', color:'#d4af6a', fontFamily:'monospace', fontSize:'14px' }}>
      ⬡ Cargando LAMAUTONOMIA...
    </div>
  )

  return (
    <div className="hb-page">

      {/* Header */}
      <div className="hb-page-header">
        <div>
          <h1 style={{ color:'#d4af6a', fontSize:'18px', fontWeight:'700', marginBottom:'4px' }}>
            ⬡ LAMAUTONOMIA
          </h1>
          <p className="hb-page-subtitle">auto-refresh 10s · {ts}</p>
        </div>
        <button className="hb-btn hb-btn-sm" onClick={() => window.location.reload()}>↻ Refrescar</button>
      </div>

      {/* Stat cards row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'10px', marginBottom:'20px' }}>
        {stats.map((s, i) => (
          <div key={i} className="hb-card" style={{ borderTop:`2px solid ${s.color}`, padding:'12px 14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:'10px', color:'#a09d99', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'4px' }}>{s.label}</div>
                <div style={{ fontSize:'20px', fontWeight:'700', color:'#f0ede8' }}>{s.value}</div>
                <div style={{ fontSize:'11px', color:'#6b6866', marginTop:'2px' }}>{s.sub}</div>
              </div>
              <span style={{ fontSize:'18px', opacity:0.65 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* LAMAUTONOMIA 3-panel grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'12px' }}>

        {/* CONTENEDORES */}
        <div className="hb-table-wrap">
          <div style={{ padding:'10px 14px', fontSize:'11px', color:'#d4af6a', letterSpacing:'2px', fontWeight:'600', textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            🐳 Contenedores
          </div>
          {stack.length === 0
            ? <div style={{ padding:'16px 14px', color:'#6b6866', fontSize:'13px' }}>Sin datos del orquestador</div>
            : stack.map(c => (
                <div key={c.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'8px', color:'#f0ede8' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: c.status==='running' ? '#4ade80' : '#fb7185', display:'inline-block', flexShrink:0 }}/>
                    {c.name}
                  </span>
                  <span style={{ color: c.status==='running' ? '#4ade80' : '#fb7185', fontSize:'11px' }}>{c.status}</span>
                </div>
              ))
          }
        </div>

        {/* HB JEWELRY GATEWAY */}
        <div className="hb-table-wrap">
          <div style={{ padding:'10px 14px', fontSize:'11px', color:'#d4af6a', letterSpacing:'2px', fontWeight:'600', textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            ⬡ HB Jewelry — Gateway
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
            <span style={{ color:'#a09d99' }}>estado</span>
            <span style={{ color: gateway.status === 'ok' ? '#4ade80' : '#fb7185' }}>
              {gateway.status || 'sin respuesta'}
            </span>
          </div>
          {(gateway.agents || []).length === 0
            ? <div style={{ padding:'8px 14px', color:'#6b6866', fontSize:'12px' }}>Sin agentes reportados</div>
            : (gateway.agents || []).map(a => (
                <div key={a} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
                  <span style={{ color:'#d4af6a' }}>⬡ {a}</span>
                  <span style={{ color:'#4ade80', fontSize:'11px' }}>activo</span>
                </div>
              ))
          }
        </div>

        {/* DAG TAREAS */}
        <div className="hb-table-wrap">
          <div style={{ padding:'10px 14px', fontSize:'11px', color:'#d4af6a', letterSpacing:'2px', fontWeight:'600', textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            🔄 DAG — Tareas
          </div>
          {Object.keys(tareas).length === 0
            ? <div style={{ padding:'16px 14px', color:'#6b6866', fontSize:'13px' }}>Sin tareas en ejecución</div>
            : Object.entries(tareas).map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
                  <span style={{ color:'#f0ede8' }}>{k.replace(/_/g, ' ')}</span>
                  <span style={{
                    fontSize:'11px', padding:'2px 8px', borderRadius:'4px',
                    color: estadoColor(v.estado),
                    border: `1px solid ${estadoColor(v.estado)}40`,
                    background: `${estadoColor(v.estado)}15`,
                  }}>{v.estado}</span>
                </div>
              ))
          }
        </div>

      </div>
    </div>
  )
}


const STAT_CARDS = [
  { label: 'Ventas hoy',     value: '$0',   sub: '0 órdenes',    icon: '◆', color: '#d4af6a' },
  { label: 'Productos',      value: '0',    sub: 'en catálogo',  icon: '◇', color: '#60a5fa' },
  { label: 'Clientes',       value: '0',    sub: 'registrados',  icon: '👥', color: '#34d399' },
  { label: 'Contenedores',   value: '0',    sub: 'activos',      icon: '🐳', color: '#a78bfa' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(STAT_CARDS)
  const [tasks, setTasks]   = useState([])
  const [ts, setTs] = useState('')

  useEffect(() => {
    setTs(new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }))

    // Contenedores activos
    fetch('/api/status').then(r => r.json()).then(d => {
      const running = (d.containers || []).filter(c => c.status === 'running').length
      setStats(prev => prev.map(s => s.label === 'Contenedores' ? { ...s, value: running, sub: `${running} running` } : s))
    }).catch(() => {})

    // Tareas pendientes
    fetch('/api/tareas').then(r => r.json()).then(d => {
      setTasks((d.tareas || []).slice(0, 5))
    }).catch(() => {})

    // Ventas del día
    fetch('/api/ventas').then(r => r.json()).then(d => {
      const ventas = d.ventas || []
      const total = ventas.reduce((a, v) => a + (v.total || 0), 0)
      setStats(prev => prev.map(s => s.label === 'Ventas hoy' ? { ...s, value: `$${total.toLocaleString()}`, sub: `${ventas.length} órdenes` } : s))
    }).catch(() => {})

    // Productos
    fetch('/api/productos').then(r => r.json()).then(d => {
      const n = (d.productos || []).length
      setStats(prev => prev.map(s => s.label === 'Productos' ? { ...s, value: n, sub: `${n} en catálogo` } : s))
    }).catch(() => {})
  }, [])

  return (
    <div className="hb-page">

      {/* Header */}
      <div className="hb-page-header">
        <div>
          <h1 className="hb-page-title">Dashboard</h1>
          <p className="hb-page-subtitle">Actualizado: {ts}</p>
        </div>
        <button className="hb-btn hb-btn-sm" onClick={() => window.location.reload()}>↻ Refrescar</button>
      </div>

      {/* Stats cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'12px', marginBottom:'24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="hb-card" style={{ borderTop: `2px solid ${s.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:'11px', color:'#a09d99', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>{s.label}</div>
                <div style={{ fontSize:'22px', fontWeight:'700', color:'#f0ede8' }}>{s.value}</div>
                <div style={{ fontSize:'11px', color:'#6b6866', marginTop:'4px' }}>{s.sub}</div>
              </div>
              <span style={{ fontSize:'20px', opacity:0.7 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tareas + Acciones rápidas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

        {/* Tareas recientes */}
        <div className="hb-table-wrap">
          <div style={{ padding:'12px 14px', fontSize:'13px', fontWeight:'600', color:'#f0ede8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            🔄 Tareas activas
          </div>
          {tasks.length === 0 ? (
            <div style={{ padding:'20px', color:'#6b6866', fontSize:'13px', textAlign:'center' }}>
              Sin tareas pendientes
            </div>
          ) : (
            <table className="hb-table">
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={i}>
                    <td className="td-main">{t.nombre || t.id}</td>
                    <td>
                      <span className={t.estado === 'completado' ? 'hb-badge hb-badge-green' : 'hb-badge hb-badge-gray'}>
                        {t.estado || 'pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="hb-card">
          <div style={{ fontSize:'13px', fontWeight:'600', color:'#f0ede8', marginBottom:'14px' }}>⚡ Acciones rápidas</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[
              { label:'➕ Agregar producto',  id:'productos' },
              { label:'📦 Ver pedidos',       id:'ordenes'   },
              { label:'💬 Abrir chat',        id:'chat'      },
              { label:'📊 Ver reportes',      id:'reportes'  },
              { label:'🔍 Auditoría',         id:'auditoria' },
            ].map(a => (
              <button key={a.id} className="hb-btn hb-btn-sm" style={{ textAlign:'left' }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}




