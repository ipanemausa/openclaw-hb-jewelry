import React, { useState, useEffect } from 'react'
import '../../styles/hb.css'

export default function Inventario() {
  const [items, setItems] = useState([
    { sku: 'ANI-001', nombre: 'Anillo Oro 18K', categoria: 'Anillos', stock: 12, precio: 850.00, estado: 'activo' },
    { sku: 'COL-002', nombre: 'Collar Diamante', categoria: 'Collares', stock: 5, precio: 1200.00, estado: 'activo' },
    { sku: 'PUL-003', nombre: 'Pulsera Plata', categoria: 'Pulseras', stock: 0, precio: 320.00, estado: 'sin_stock' },
    { sku: 'ARC-004', nombre: 'Aretes Perla', categoria: 'Aretes', stock: 8, precio: 450.00, estado: 'activo' },
    { sku: 'ANI-005', nombre: 'Anillo Compromiso', categoria: 'Anillos', stock: 3, precio: 2400.00, estado: 'activo' },
    { sku: 'COL-006', nombre: 'Collar Corazon', categoria: 'Collares', stock: 15, precio: 380.00, estado: 'activo' },
  ])

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Inventario</div>
          <div className="hb-page-subtitle">{items.length} productos registrados</div>
        </div>
        <button className="hb-btn">+ Nuevo producto</button>
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.sku}>
                <td className="td-dim">{item.sku}</td>
                <td className="td-main">{item.nombre}</td>
                <td className="td-muted">{item.categoria}</td>
                <td className={item.stock === 0 ? 'td-gold' : 'td-main'}>{item.stock}</td>
                <td className="td-gold">${item.precio.toFixed(2)}</td>
                <td>
                  <span className={`hb-badge ${item.estado === 'activo' ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {item.estado === 'activo' ? 'Activo' : 'Sin stock'}
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
