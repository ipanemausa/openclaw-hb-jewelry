import React from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import '../../styles/layout.css'

export default function Layout({ children, activeSection, onSelect }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar activeSection={activeSection} onSelect={onSelect} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}
