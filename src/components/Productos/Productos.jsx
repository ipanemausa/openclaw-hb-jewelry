import React, { useState, useEffect } from 'react'

const API = 'https://openclaw-operativo-2026.onrender.com'

export default function Productos() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nombre: '', categoria: '', material: '', precio: '', inventario: '', canal: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    try {
      const r = await fetch(API + '/api/hb/products')
      const d = await r.json()
      setProducts(d.products || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function addProduct() {
    if (!form.nombre || !form.precio) return
    setAdding(true)
    try {
      const r = await fetch(API + '/api/hb/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio), inventario: parseInt(form.inventario) || 0 })
      })
      const d = await r.json()
      if (d.status === 'ok') {
        setForm({ nombre: '', categoria: '', material: '', precio: '', inventario: '', canal: '' })
        setShowForm(false)
        loadProducts()
      }
    } catch(e) { console.error(e) }
    setAdding(false)
  }

  const categorias = ['Collares', 'Aretes', 'Pulseras', 'Anillos', 'Sets']
  const canales = ['Instagram', 'WhatsApp', 'Shopify', 'TikTok', 'Tienda']

  return (
    <div style={{padding:'0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <div>
          <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>Catalogo de productos</h2>
          <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>{products.length} productos activos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>
          {showForm ? 'Cancelar' : '+ Agregar producto'}
        </button>
      </div>

      {showForm && (
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'20px',marginBottom:'24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px',marginBottom:'12px'}}>
            <input placeholder="Nombre *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              <option value="">Categoria</option>
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
            {adding ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>Cargando productos...</p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'12px'}}>
          {products.map(p => (
            <div key={p.id} style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <div style={{fontSize:'14px',fontWeight:'500',color:'#f0ede8'}}>{p.nombre}</div>
                <div style={{fontSize:'15px',fontWeight:'600',color:'#d4af6a'}}>${p.precio.toFixed(2)}</div>
              </div>
              <div style={{fontSize:'12px',color:'#a09d99',marginBottom:'4px'}}>{p.categoria} · {p.material}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontSize:'11px',background:p.inventario < 6 ? 'rgba(251,113,133,0.15)':'rgba(52,211,153,0.1)',color:p.inventario < 6 ? '#fb7185':'#34d399',padding:'2px 8px',borderRadius:'10px'}}>
                  Stock: {p.inventario}
                </span>
                <span style={{fontSize:'11px',color:'#6b6866'}}>{p.canal}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
