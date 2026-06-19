import React, { useState, useEffect } from 'react'

const API = ''

export default function Ventas() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ producto: '', cantidad: 1, precio_unitario: '', cliente: '', canal_venta: 'Instagram' })
  const [total, setTotal] = useState(0)

  useEffect(() => { loadSales() }, [])
  useEffect(() => {
    setTotal((parseFloat(form.precio_unitario) || 0) * (parseInt(form.cantidad) || 0))
  }, [form.precio_unitario, form.cantidad])

  async function loadSales() {
    try {
      const r = await fetch(API + '/api/hb/sales')
      const d = await r.json()
      setSales(d.sales || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function addSale() {
    if (!form.producto || !form.precio_unitario || !form.cliente) return
    setAdding(true)
    try {
      const r = await fetch(API + '/api/hb/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cantidad: parseInt(form.cantidad), precio_unitario: parseFloat(form.precio_unitario) })
      })
      const d = await r.json()
      if (d.status === 'ok') {
        setForm({ producto: '', cantidad: 1, precio_unitario: '', cliente: '', canal_venta: 'Instagram' })
        setShowForm(false)
        loadSales()
      }
    } catch(e) { console.error(e) }
    setAdding(false)
  }

  const totalVentas = sales.reduce((a, s) => a + s.total, 0)
  const canales = ['Instagram', 'WhatsApp', 'Shopify', 'TikTok', 'Tienda']
  const canalColors = { Instagram: '#a78bfa', WhatsApp: '#4ade80', Shopify: '#34d399', TikTok: '#fb7185', Tienda: '#60a5fa' }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <div>
          <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>Ventas</h2>
          <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>{sales.length} ventas · Total: <span style={{color:'#d4af6a',fontWeight:'600'}}>${totalVentas.toFixed(2)}</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>
          {showForm ? 'Cancelar' : '+ Registrar venta'}
        </button>
      </div>

      {showForm && (
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'10px',marginBottom:'12px'}}>
            <input placeholder="Producto *" value={form.producto} onChange={e => setForm({...form, producto: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Cliente *" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Precio unitario *" type="number" value={form.precio_unitario} onChange={e => setForm({...form, precio_unitario: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Cantidad" type="number" min="1" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <select value={form.canal_venta} onChange={e => setForm({...form, canal_venta: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              {canales.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {total > 0 && <div style={{fontSize:'13px',color:'#d4af6a',marginBottom:'12px',fontWeight:'600'}}>Total: ${total.toFixed(2)}</div>}
          <button onClick={addSale} disabled={adding} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',opacity:adding?0.5:1}}>
            {adding ? 'Guardando...' : 'Registrar venta'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>Cargando ventas...</p>
      ) : sales.length === 0 ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>No hay ventas registradas aun.</p>
      ) : (
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                <th style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866',textAlign:'left',fontWeight:'500',textTransform:'uppercase',letterSpacing:'.06em'}}>Producto</th>
                <th style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866',textAlign:'left',fontWeight:'500',textTransform:'uppercase',letterSpacing:'.06em'}}>Cliente</th>
                <th style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866',textAlign:'left',fontWeight:'500',textTransform:'uppercase',letterSpacing:'.06em'}}>Total</th>
                <th style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866',textAlign:'left',fontWeight:'500',textTransform:'uppercase',letterSpacing:'.06em'}}>Canal</th>
                <th style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866',textAlign:'left',fontWeight:'500',textTransform:'uppercase',letterSpacing:'.06em'}}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'10px 14px',fontSize:'13px',color:'#f0ede8'}}>{s.producto}</td>
                  <td style={{padding:'10px 14px',fontSize:'13px',color:'#a09d99'}}>{s.cliente}</td>
                  <td style={{padding:'10px 14px',fontSize:'13px',color:'#d4af6a',fontWeight:'600'}}>${s.total.toFixed(2)}</td>
                  <td style={{padding:'10px 14px'}}>
                    <span style={{fontSize:'11px',background:`${canalColors[s.canal_venta]}20`,color:canalColors[s.canal_venta]||'#a09d99',padding:'2px 8px',borderRadius:'10px'}}>{s.canal_venta}</span>
                  </td>
                  <td style={{padding:'10px 14px',fontSize:'11px',color:'#6b6866'}}>{s.fecha?.slice(0,10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
