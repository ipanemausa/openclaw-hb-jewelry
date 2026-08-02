import React, { useState, useEffect } from 'react'

export default function BRollOverlay({ currentTime = 0, schedulePath = '/broll_schedule.json' }) {
  const [schedule, setSchedule] = useState([])
  const [activeEvent, setActiveEvent] = useState(null)

  useEffect(() => {
    fetch(schedulePath)
      .then(res => res.json())
      .then(data => {
        if (data && data.events) {
          setSchedule(data.events)
        }
      })
      .catch(() => {
        // Fallback dinámico si no existe el JSON
        setSchedule([
          { start_time: 2.0, end_time: 7.0, label: '💡 Pilares de Automatización con IA' },
          { start_time: 12.0, end_time: 18.0, label: '⚡ Agentes Autónomos 2026.7.1' },
          { start_time: 22.0, end_time: 28.0, label: '🚀 Crecimiento y Escalabilidad Empresarial' }
        ])
      })
  }, [schedulePath])

  useEffect(() => {
    const current = schedule.find(ev => currentTime >= ev.start_time && currentTime <= ev.end_time)
    setActiveEvent(current || null)
  }, [currentTime, schedule])

  if (!activeEvent) return null

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(132, 204, 22, 0.4)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      borderRadius: '12px',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#f8fafc',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#84cc16',
        boxShadow: '0 0 10px #84cc16'
      }} />
      <div>
        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          B-Roll Infográfico
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>
          {activeEvent.label}
        </div>
      </div>
    </div>
  )
}
