import React, { useState, useEffect, useRef } from 'react'

const SOURCES = [
  { id: 'orchestrator', label: 'Orquestador', url: 'http://localhost:8090', color: '#d4af6a' },
  { id: 'gateway',      label: 'Gateway',      url: 'http://localhost:8080', color: '#60a5fa' },
  { id: 'tasks',        label: 'Tareas DAG',   url: 'http://localhost:8090', color: '#4ade80' },
]

const levelColor = {
  ERROR:   '#fb7185',
  WARN:    '#fbbf24',
  INFO:    '#4ade80',
  DEBUG:   '#a09d99',
  SUCCESS: '#4ade80',
  SYSTEM:  '#d4af6a',
}

function ts() {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function mkLog(level, source, msg) {
  return { id: Date.now() + Math.random(), ts: ts(), level, source, msg }
}

export default function Terminal() {
  const [logs, setLogs]       = useState([])
  const [source, setSource]   = useState('all')
  const [paused, setPaused]   = useState(false)
  const [search, setSearch]   = useState('')
  const [tasks, setTasks]     = useState({})
  const [health, setHealth]   = useState({ gateway: null, orchestrator: null })
  const bottomRef             = useRef(null)
  const pausedRef             = useRef(false)

  pausedRef.current = paused

  const addLog = (level, src, msg) => {
    if (pausedRef.current) return
    setLogs(prev => {
      const next = [...prev, mkLog(level, src, msg)]
      return next.slice(-300) // máximo 300 líneas
    })
  }

  // Health checks + tareas polling
  useEffect(() => {
    addLog('SYSTEM', 'terminal', '▶ Terminal iniciada — conectando con orquestador...')

    async function poll() {
      // Gateway health
      try {
        const g = await fetch('/health').then(r => r.json())
        setHealth(prev => ({ ...prev, gateway: g.status }))
        if (g.status === 'healthy') addLog('INFO', 'gateway', `health → ${g.status}`)
        else addLog('WARN', 'gateway', `health → ${g.status}`)
      } catch {
        addLog('ERROR', 'gateway', 'sin respuesta en /health')
        setHealth(prev => ({ ...prev, gateway: 'offline' }))
      }

      // Orchestrator health
      try {
        const o = await fetch('http://localhost:8090/health').then(r => r.json())
        setHealth(prev => ({ ...prev, orchestrator: o.status }))
        addLog('INFO', 'orchestrator', `health → ${o.status} | port ${o.port}`)
      } catch {
        addLog('ERROR', 'orchestrator', 'sin respuesta — puerto 8090')
        setHealth(prev => ({ ...prev, orchestrator: 'offline' }))
      }

      // Tareas DAG
      try {
        const t = await fetch('/api/tareas').then(r => r.json())
        const tareas = t.tareas || {}
        const prev_keys = Object.keys(tasks)
        const curr_keys = Object.keys(tareas)

        if (curr_keys.length !== prev_keys.length) {
          addLog('SUCCESS', 'dag', `tareas actualizadas: ${curr_keys.length} en total`)
        }

        Object.entries(tareas).forEach(([k, v]) => {
          const prev_estado = tasks[k]?.estado
          if (prev_estado && prev_estado !== v.estado) {
            addLog('SUCCESS', 'dag', `${k.replace(/_/g,' ')} → ${v.estado}`)
          }
        })

        setTasks(tareas)
      } catch {
        addLog('WARN', 'dag', 'no se pudo leer /api/tareas')
      }
    }

    poll()
    const interval = setInterval(poll, 8000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (!paused) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs, paused])

  const filtered = logs.filter(l => {
    const matchSource = source === 'all' || l.source === source
    const matchSearch = !search || l.msg.toLowerCase().includes(search.toLowerCase()) || l.source.includes(search.toLowerCase())
    return matchSource && matchSearch
  })

  const clear = () => setLogs([mkLog('SYSTEM', 'terminal', '🗑 Terminal limpiada')])

  const dot = status => {
    if (status === 'healthy' || status === 'ok') return '#4ade80'
    if (status === 'offline' || status === null) return '#fb7185'
    return '#fbbf24'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0ede8', marginBottom: '4px' }}>
            ⬡ Terminal de Logs
          </div>
          <div style={{ fontSize: '12px', color: '#6b6866' }}>Orquestador + Gateway — auto-refresh 8s</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Status dots */}
          <span style={{ fontSize: '12px', color: '#a09d99', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot(health.gateway), display: 'inline-block' }}/>
            Gateway
          </span>
          <span style={{ fontSize: '12px', color: '#a09d99', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot(health.orchestrator), display: 'inline-block' }}/>
            Orquestador
          </span>
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              background: paused ? 'rgba(251,185,36,0.15)' : 'transparent',
              color: paused ? '#fbbf24' : '#a09d99',
              border: `1px solid ${paused ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px', padding: '5px 12px', fontSize: '12px',
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            {paused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>
          <button
            onClick={clear}
            style={{
              background: 'transparent', color: '#6b6866',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px', padding: '5px 12px', fontSize: '12px',
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            🗑 Limpiar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexShrink: 0 }}>
        <select
          value={source}
          onChange={e => setSource(e.target.value)}
          style={{
            background: '#1a1a1a', border: '1px solid rgba(212,175,106,0.3)',
            borderRadius: '6px', padding: '6px 10px', color: '#d4af6a',
            fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer'
          }}
        >
          <option value="all">Todos los servicios</option>
          <option value="gateway">Gateway</option>
          <option value="orchestrator">Orquestador</option>
          <option value="dag">DAG Tareas</option>
          <option value="terminal">Sistema</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en logs..."
          style={{
            flex: 1, background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', padding: '6px 12px',
            color: '#f0ede8', fontSize: '12px', fontFamily: 'inherit'
          }}
        />
        <span style={{ fontSize: '11px', color: '#6b6866', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {filtered.length} líneas
        </span>
      </div>

      {/* Terminal window */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        background: '#0a0a0a', border: '1px solid rgba(212,175,106,0.15)',
        borderRadius: '10px', padding: '12px 16px',
        fontFamily: 'ui-monospace, Consolas, "Courier New", monospace',
        fontSize: '12px', lineHeight: '1.7',
      }}>
        {filtered.length === 0 && (
          <div style={{ color: '#3a3836', textAlign: 'center', paddingTop: '40px' }}>
            Esperando eventos del sistema...
          </div>
        )}
        {filtered.map(log => (
          <div key={log.id} style={{ display: 'flex', gap: '10px', marginBottom: '1px' }}>
            <span style={{ color: '#3a3836', flexShrink: 0 }}>{log.ts}</span>
            <span style={{
              color: levelColor[log.level] || '#a09d99',
              flexShrink: 0, minWidth: '54px',
              fontSize: '10px', paddingTop: '2px'
            }}>
              {log.level}
            </span>
            <span style={{ color: '#d4af6a', flexShrink: 0, minWidth: '80px' }}>
              [{log.source}]
            </span>
            <span style={{ color: '#c9c7c3' }}>{log.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer — resumen tareas */}
      {Object.keys(tasks).length > 0 && (
        <div style={{
          marginTop: '12px', padding: '10px 14px',
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '11px', color: '#6b6866' }}>DAG RESUMEN:</span>
          {Object.entries(tasks).map(([k, v]) => (
            <span key={k} style={{
              fontSize: '11px',
              color: v.estado === 'completada' ? '#4ade80' : v.estado === 'ejecutando' ? '#fb923c' : '#fbbf24'
            }}>
              {k.replace(/_/g, ' ')} ·{' '}
              <span style={{ opacity: 0.7 }}>{v.estado}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
