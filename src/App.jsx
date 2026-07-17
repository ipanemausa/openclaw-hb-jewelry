import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import Chat from './components/Chat/Chat'
import Productos from './components/Productos/Productos'
import Ventas from './components/Ventas/Ventas'
import Dashboard from './components/Dashboard/Dashboard'
import Marketing from './components/Marketing/Marketing'
import Ordenes from './components/Ordenes/Ordenes'

// Placeholder para secciones en desarrollo
function Placeholder({ name }) {
  return (
    <div style={{ padding: '40px 24px', color: '#a09d99', fontFamily: 'monospace' }}>
      <div style={{ fontSize: '12px', color: '#6b6866', marginBottom: '8px' }}>SECCIÓN</div>
      <div style={{ fontSize: '20px', color: '#d4af6a', marginBottom: '16px' }}>{name}</div>
      <div style={{ fontSize: '13px', color: '#6b6866' }}>Módulo en construcción</div>
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':      return <Dashboard />
      case 'chat':           return <Chat />
      case 'productos':      return <Productos />
      case 'ventas':         return <Ventas />
      case 'marketing':      return <Marketing />
      case 'ordenes':        return <Ordenes />
      case 'inventario':     return <Placeholder name="Inventario" />
      case 'clientes':       return <Placeholder name="Clientes" />
      case 'analytics':      return <Placeholder name="Analytics" />
      case 'reportes':       return <Placeholder name="Reportes" />
      case 'pipeline':       return <Placeholder name="Pipeline" />
      case 'workspace':      return <Placeholder name="Workspace" />
      case 'monitor':        return <Placeholder name="Monitor" />
      case 'historial':      return <Placeholder name="Historial" />
      case 'chat-historial': return <Placeholder name="Chat Historial" />
      case 'auditoria':      return <Placeholder name="Auditoria" />
      default:               return <Dashboard />
    }
  }

  return (
    <Layout activeSection={activeSection} onSelect={setActiveSection}>
      {renderSection()}
    </Layout>
  )
}
