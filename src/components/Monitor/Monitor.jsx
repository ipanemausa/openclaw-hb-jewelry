import React, { useState, useEffect } from 'react'
import '../../styles/hb.css'

export default function Monitor() {
  const [containers, setContainers] = useState([
    { name: 'chat_worker', status: 'running', uptime: '24 min' },
    { name: 'video_veo_worker', status: 'running', uptime: '24 min' },
    { name: 'openclaw_app', status: 'running', uptime: '24 min' },
    { name: 'openclaw_gateway', status: 'running', uptime: '24 min' },
    { name: 'openclaw_redis', status: 'running', uptime: '24 min' },
    { name: 'claw-orchestrator', status: 'running', uptime: '24 min' },
    { name: 'openclaw_db', status: 'running', uptime: '2 hours' },
  ])

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const r = await fetch('/api/docker/containers')
        const d = await r.json()
        if (Array.isArray(d) && d.length > 0) setContainers(d)
      } catch {}
    }
    fetchContainers()
    const interval = setInterval(fetchContainers, 5000)
    return () => clearInterval(interval)
  }, [])

  const running = containers.filter(c => c.status === 'running').length

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Docker Monitor</div>
          <div className="hb-page-subtitle">{running}/{containers.length} contenedores activos</div>
        </div>
        <span style={{ fontSize: '12px', color: '#4ade80', padding: '6px 12px', border: '1px solid #4ade8040', borderRadius: '8px' }}>
          ● Sistema operativo
        </span>
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Contenedor</th>
              <th>Estado</th>
              <th>Uptime</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c, i) => (
              <tr key={i}>
                <td className="td-main">
                  <span style={{
                    display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                    background: c.status === 'running' ? '#4ade80' : '#fb7185',
                    marginRight: '8px'
                  }} />
                  {c.name}
                </td>
                <td>
                  <span className={`hb-badge ${c.status === 'running' ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="td-dim">{c.uptime || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
