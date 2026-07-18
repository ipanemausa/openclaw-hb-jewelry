import React from 'react'
import '../../styles/hb.css'

export default function Workspace() {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Workspace</div>
          <div className="hb-page-subtitle">Entorno de trabajo — agentes y herramientas</div>
        </div>
      </div>

      <div className="hb-grid">
        {[
          { title: 'Gemini Agent', desc: 'Agente principal IA', status: 'activo', color: '#4ade80' },
          { title: 'Marketing Agent', desc: 'Campañas y contenido', status: 'activo', color: '#4ade80' },
          { title: 'Video Agent', desc: 'Generación de videos Veo', status: 'activo', color: '#4ade80' },
          { title: 'Shopify Agent', desc: 'Sync de tienda online', status: 'activo', color: '#4ade80' },
          { title: 'Orchestrator', desc: 'Control central de tareas', status: 'activo', color: '#4ade80' },
          { title: 'Chat Worker', desc: 'Procesamiento de chats', status: 'activo', color: '#4ade80' },
        ].map((a, i) => (
          <div key={i} className="hb-card">
            <div className="hb-card-header">
              <div className="hb-card-name">{a.title}</div>
              <span style={{ fontSize: '10px', color: a.color }}>● {a.status}</span>
            </div>
            <div className="hb-card-meta">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
