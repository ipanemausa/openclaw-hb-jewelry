import React, { useState, useEffect } from 'react'

const API = ''

const INITIAL_PRODUCTS = [
  { id: 1, nombre: 'Cadena Cubana Oro 14k HB', categoria: 'Collares', material: 'Oro 14k Macizo', precio: 1250.00, inventario: 12, canal: 'Tienda' },
  { id: 2, nombre: 'Aretes Gota Diamante Natural', categoria: 'Aretes', material: 'Oro Blanco 18k', precio: 890.00, inventario: 5, canal: 'Instagram' },
  { id: 3, nombre: 'Pulsera Tennis Zirconia Premium', categoria: 'Pulseras', material: 'Plata Rhodium .925', precio: 340.00, inventario: 24, canal: 'TikTok' },
  { id: 4, nombre: 'Anillo Solitario Esmeralda Colombiana', categoria: 'Anillos', material: 'Oro Amarillo 18k', precio: 2100.00, inventario: 3, canal: 'WhatsApp' },
  { id: 5, nombre: 'Set Reloj & Dijes HB Executive Gold', categoria: 'Sets', material: 'Oro 14k & Cuero', precio: 3500.00, inventario: 7, canal: 'Shopify' }
]

export default function Productos() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: '', categoria: '', material: '', precio: '', inventario: '', canal: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    try {
      const r = await fetch(API + '/api/hb/products')
      const d = await r.json()
      if (d.products && d.products.length > 0) {
        setProducts(d.products)
      }
    } catch(e) {
      console.log("Cargando catálogo local HB Jewelry...")
    }
    setLoading(false)
  }

  async function addProduct() {
    if (!form.nombre || !form.precio) return
    setAdding(true)
    const newProd = {
      id: Date.now(),
      nombre: form.nombre,
      categoria: form.categoria || 'Collares',
      material: form.material || 'Oro 14k',
      precio: parseFloat(form.precio) || 0,
      inventario: parseInt(form.inventario) || 1,
      canal: form.canal || 'Tienda'
    }
    try {
      await fetch(API + '/api/hb/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      })
    } catch(e) {}
    
    setProducts(prev => [newProd, ...prev])
    setForm({ nombre: '', categoria: '', material: '', precio: '', inventario: '', canal: '' })
    setShowForm(false)
    setAdding(false)
  }

  const categorias = ['Collares', 'Aretes', 'Pulseras', 'Anillos', 'Sets']
  const canales = ['Instagram', 'WhatsApp', 'Shopify', 'TikTok', 'Tienda']

  return (
    <div style={{padding:'0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <div>
          <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>💎 Catálogo de Productos HB Jewelry</h2>
          <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>{products.length} productos activos en inventario nicial</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>
          {showForm ? 'Cancelar' : '+ Agregar Producto'}
        </button>
      </div>

      {showForm && (
        <div style={{background:'#1a1a1a',border:'1px solid rgba(212,175,106,0.3)',borderRadius:'12px',padding:'20px',marginBottom:'24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px',marginBottom:'12px'}}>
            <input placeholder="Nombre *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              <option value="">Categoría</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Material" value={form.material} onChange={e => setForm({...form, material: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Precio *" type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Inventario" type="number" value={form.inventario} onChange={e => setForm({...form, inventario: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <select value={form.canal} onChange={e => setForm({...form, canal: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              <option value="">Canal</option>
              {canales.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addProduct} disabled={adding} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',opacity:adding?0.5:1}}>
            {adding ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>Cargando catálogo...</p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}}>
          {products.map(p => (
            <div key={p.id} style={{background:'#111',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px',boxShadow:'0 4px 12px rgba(0,0,0,0.4)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <div style={{fontSize:'14px',fontWeight:'600',color:'#f0ede8'}}>{p.nombre}</div>
                <div style={{fontSize:'16px',fontWeight:'700',color:'#d4af6a'}}>${p.precio.toFixed(2)}</div>
              </div>
              <div style={{fontSize:'12px',color:'#a09d99',marginBottom:'10px'}}>{p.categoria} · {p.material}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px',borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'10px'}}>
                <span style={{fontSize:'11px',background:p.inventario < 6 ? 'rgba(251,113,133,0.15)':'rgba(52,211,153,0.1)',color:p.inventario < 6 ? '#fb7185':'#34d399',padding:'3px 10px',borderRadius:'12px',fontWeight:'600'}}>
                  Stock: {p.inventario} uds
                </span>
                <span style={{fontSize:'11px',color:'#6b6866',fontWeight:'500'}}>Vía {p.canal}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
