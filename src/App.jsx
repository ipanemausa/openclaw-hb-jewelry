import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import Chat from './components/Chat/Chat'
import Productos from './components/Productos/Productos'
import Ventas from './components/Ventas/Ventas'
import Dashboard from './components/Dashboard/Dashboard'
import Marketing from './components/Marketing/Marketing'
import Ordenes from './components/Ordenes/Ordenes'
import Inventario from './components/Inventario/Inventario'
import Clientes from './components/Clientes/Clientes'
import Analytics from './components/Analytics/Analytics'
import Reportes from './components/Reportes/Reportes'
import Pipeline from './components/Pipeline/Pipeline'
import Workspace from './components/Workspace/Workspace'
import Monitor from './components/Monitor/Monitor'
import Terminal from './components/Terminal/Terminal'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'

// Placeholder simple para secciones en desarrollo
function Placeholder({ name }) {
  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ fontSize: '11px', color: '#6b6866', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>MÓDULO</div>
      <div style={{ fontSize: '22px', color: '#d4af6a', fontWeight: '600', marginBottom: '8px' }}>{name}</div>
      <div style={{
        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', padding: '40px', textAlign: 'center',
        color: '#6b6866', fontSize: '13px', marginTop: '16px'
      }}>
        Módulo en construcción — próximamente disponible
      </div>
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':      return <Dashboard onNavigate={setActiveSection} />
      case 'chat':           return <Chat />
      case 'productos':      return <Productos />
      case 'ventas':         return <Ventas />
      case 'marketing':      return <Marketing />
      case 'ordenes':        return <Ordenes />
      case 'inventario':     return <Inventario />
      case 'clientes':       return <Clientes />
      case 'analytics':      return <Analytics />
      case 'reportes':       return <Reportes />
      case 'pipeline':       return <Pipeline />
      case 'workspace':      return <Workspace />
      case 'monitor':        return <Monitor />
      case 'terminal':       return <Terminal />
      case 'admin':          return <AdminDashboard />
      case 'historial':      return <Placeholder name="Historial" />
      case 'chat-historial': return <Placeholder name="Chat Historial" />
      case 'auditoria':      return <Placeholder name="Auditoria" />
      default:               return <Dashboard onNavigate={setActiveSection} />
    }
  }

  return (
    <Layout activeSection={activeSection} onSelect={setActiveSection}>
      {renderSection()}
    </Layout>
  )
}
