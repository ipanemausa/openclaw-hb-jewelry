import React from 'react'
import '../../styles/sidebar.css'

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'chat', label: 'Chat Agentes', icon: '◎' },
  { id: 'productos', label: 'Productos', icon: '◇' },
  { id: 'ventas', label: 'Ventas', icon: '◆' },
  { id: 'marketing', label: 'Marketing', icon: '◉' },
  { id: 'ordenes', label: 'Ordenes', icon: '▣' },
]

export default function Sidebar({ activeSection, onSelect }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={"sidebar-item" + (activeSection === s.id ? " active" : "")}
            onClick={() => onSelect(s.id)}
          >
            <span className="sidebar-icon">{s.icon}</span>
            <span className="sidebar-label">{s.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">OpenClaw 2026</div>
    </aside>
  )
}
