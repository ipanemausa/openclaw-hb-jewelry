import React from 'react'
import '../../styles/sidebar.css'

const GROUPS = [
  {
    label: 'PRINCIPAL',
    items: [
      { id: 'dashboard',     label: 'Dashboard',      icon: '◈' },
      { id: 'chat',          label: 'Chat Agentes',    icon: '◎' },
      { id: 'workspace',     label: 'Workspace',       icon: '○' },
      { id: 'monitor',       label: 'Monitor',         icon: '○' },
      { id: 'terminal',      label: 'Terminal Logs',   icon: '▶_' },
    ],
  },
  {
    label: 'OPERACIONES',
    items: [
      { id: 'ventas',        label: 'Ventas',          icon: '◆' },
      { id: 'productos',     label: 'Productos',       icon: '◇' },
      { id: 'inventario',    label: 'Inventario',      icon: '▣' },
      { id: 'clientes',      label: 'Clientes',        icon: '○' },
      { id: 'ordenes',       label: 'Ordenes',         icon: '▣' },
    ],
  },
  {
    label: 'MARKETING & ANALYTICS',
    items: [
      { id: 'marketing',     label: 'Marketing',       icon: '▣' },
      { id: 'analytics',     label: 'Analytics',       icon: '▣' },
      { id: 'reportes',      label: 'Reportes',        icon: '▣' },
      { id: 'pipeline',      label: 'Pipeline',        icon: '○' },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { id: 'historial',      label: 'Historial',       icon: '○' },
      { id: 'chat-historial', label: 'Chat Historial',  icon: '▣' },
      { id: 'auditoria',      label: 'Auditoria',       icon: '▣' },
      { id: 'avatar',         label: 'Avatar (Gemini)', icon: '🎙️' },
      { id: 'admin',          label: 'Backend Admin',   icon: '⚙️' },
    ],
  },
]

export default function Sidebar({ activeSection, onSelect }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {GROUPS.map(group => (
          <div key={group.label} className="sidebar-group">
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map(s => (
              <button
                key={s.id}
                className={'sidebar-item' + (activeSection === s.id ? ' active' : '')}
                onClick={() => onSelect && onSelect(s.id)}
              >
                <span className="sidebar-icon">{s.icon}</span>
                <span className="sidebar-label">{s.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">OpenClaw 2026</div>
    </aside>
  )
}
