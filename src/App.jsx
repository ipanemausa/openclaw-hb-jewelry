import React, { useState } from 'react'
import Layout from './components/Layout/Layout'
import Chat from './components/Chat/Chat'
import Productos from './components/Productos/Productos'
import Ventas from './components/Ventas/Ventas'
import Dashboard from './components/Dashboard/Dashboard'
import Marketing from './components/Marketing/Marketing'
import Ordenes from './components/Ordenes/Ordenes'

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <Layout activeSection={activeSection} onSelect={setActiveSection}>
      {activeSection === 'dashboard' && <Dashboard />}
      {activeSection === 'chat' && <Chat />}
      {activeSection === 'productos' && <Productos />}
      {activeSection === 'ventas' && <Ventas />}
      {activeSection === 'marketing' && <Marketing />}
      {activeSection === 'ordenes' && <Ordenes />}
    </Layout>
  )
}
