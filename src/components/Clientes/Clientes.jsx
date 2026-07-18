import React, { useState } from 'react'
import '../../styles/hb.css'

const clientesData = [
  { id: 'CLI-001', nombre: 'María García', email: 'maria@gmail.com', telefono: '+1 305 555-0101', compras: 5, total: 3200.00, estado: 'activo' },
  { id: 'CLI-002', nombre: 'Carlos Pérez', email: 'carlos@hotmail.com', telefono: '+1 786 555-0202', compras: 2, total: 850.00, estado: 'activo' },
  { id: 'CLI-003', nombre: 'Ana Rodríguez', email: 'ana@yahoo.com', telefono: '+1 305 555-0303', compras: 8, total: 7600.00, estado: 'vip' },
  { id: 'CLI-004', nombre: 'Roberto López', email: 'roberto@gmail.com', telefono: '+1 954 555-0404', compras: 1, total: 450.00, estado: 'activo' },
  { id: 'CLI-005', nombre: 'Laura Martínez', email: 'laura@icloud.com', telefono: '+1 305 555-0505', compras: 12, total: 15400.00, estado: 'vip' },
]

export default function Clientes() {
  const [search, setSearch] = useState('')

  const filtered = clientesData.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Clientes</div>
          <div className="hb-page-subtitle">{clientesData.length} clientes registrados</div>
        </div>
        <button className="hb-btn">+ Nuevo cliente</button>
      </div>

      <div className="hb-form" style={{ marginBottom: '16px', padding: '12px 16px' }}>
        <input
          className="hb-input"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Compras</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="td-dim">{c.id}</td>
                <td className="td-main">{c.nombre}</td>
                <td className="td-muted">{c.email}</td>
                <td className="td-muted">{c.telefono}</td>
                <td className="td-main">{c.compras}</td>
                <td className="td-gold">${c.total.toLocaleString()}</td>
                <td>
                  <span className={`hb-badge ${c.estado === 'vip' ? 'hb-badge-green' : 'hb-badge-gray'}`}>
                    {c.estado.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
