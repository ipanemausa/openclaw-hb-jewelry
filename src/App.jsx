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
import Historial from './components/Historial/Historial'
import Chathistorial from './components/Chathistorial/Chathistorial'
import Auditoria from './components/Auditoria/Auditoria'
import AvatarMeet from './components/AvatarMeet/AvatarMeet'
import VoiceCall from './components/VoiceCall/VoiceCall'
import Integraciones from './components/Integraciones/Integraciones'
import FloatingVoiceWidget from './components/FloatingVoiceWidget/FloatingVoiceWidget'
import Facturacion from './components/Facturacion/Facturacion'
import BIEjecutivo from './components/BIEjecutivo/BIEjecutivo'

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
      case 'historial':      return <Historial />
      case 'chat-historial': return <Chathistorial />
      case 'auditoria':      return <Auditoria />
      case 'avatar':         return <AvatarMeet />
      case 'voicecall':      return <VoiceCall />
      case 'integraciones':  return <Integraciones />
      case 'facturacion':    return <Facturacion />
      case 'bi-ejecutivo':   return <BIEjecutivo />
      default:               return <Dashboard onNavigate={setActiveSection} />
    }
  }

  return (
    <Layout activeSection={activeSection} onSelect={setActiveSection}>
      {renderSection()}
      <FloatingVoiceWidget />
    </Layout>
  )
}
