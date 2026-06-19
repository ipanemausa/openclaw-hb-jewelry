import React, { useState, useEffect } from 'react'

const API = 'https://openclaw-operativo-2026.onrender.com'

const ESTADOS = ['Pendiente', 'Confirmado', 'En proceso', 'Enviado', 'Entregado', 'Cancelado']
const ESTADO_COLORS = {
  'Pendiente': '#fbbf24',
  'Confirmado': '#60a5fa',
  'En proceso': '#a78bfa',
  'Enviado': '#34d399',
  'Entregado': '#4ade80',
  'Cancelado': '#fb7185'
}

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [filtro, setFiltro] = useState('Todos')
  const [form, setForm] = useState({
    cliente: '', producto: '', cantidad: 1, precio: '',
    canal: 'Instagram', estado: 'Pendiente', notas: ''
  })

  useEffect(() => { loadOrdenes() }, [])

  async function loadOrdenes() {
    try {
      const r = await fetch(API + '/api/hb/ordenes')
      const d = await r.json()
      setOrdenes(d.ordenes || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function addOrden() {
    if (!form.cliente || !form.producto || !form.precio) return
    setAdding(true)
    try {
      const r = await fetch(API + '/api/hb/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cantidad: parseInt(form.cantidad), precio: parseFloat(form.precio) })
      })
      const d = await r.json()
      if (d.status === 'ok') {
        setForm({ cliente: '', producto: '', cantidad: 1, precio: '', canal: 'Instagram', estado: 'Pendiente', notas: '' })
        setShowForm(false)
        loadOrdenes()
      }
    } catch(e) { console.error(e) }
    setAdding(false)
  }

  async function updateEstado(id, estado) {
    try {
      await fetch(API + '/api/hb/ordenes/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      })
      loadOrdenes()
    } catch(e) { console.error(e) }
  }

  const canales = ['Instagram', 'WhatsApp', 'Shopify', 'TikTok', 'Tienda']
  const ordenesFiltradas = filtro === 'Todos' ? ordenes : ordenes.filter(o => o.estado === filtro)

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <div>
          <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>Ordenes</h2>
          <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>{ordenes.length} ordenes totales</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'8px',padding:'9px 18px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>
          {showForm ? 'Cancelar' : '+ Nueva orden'}
        </button>
      </div>

      {showForm && (
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'10px',marginBottom:'12px'}}>
            <input placeholder="Cliente *" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Producto *" value={form.producto} onChange={e => setForm({...form, producto: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Precio *" type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <input placeholder="Cantidad" type="number" min="1" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
            <select value={form.canal} onChange={e => setForm({...form, canal: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              {canales.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}}>
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <input placeholder="Notas (opcional)" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} style={{background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'8px 12px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit',width:'100%',marginBottom:'12px'}} />
          <button onClick={addOrden} disabled={adding} style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',opacity:adding?0.5:1}}>
            {adding ? 'Guardando...' : 'Crear orden'}
          </button>
        </div>
      )}

      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
        {['Todos', ...ESTADOS].map(e => (
          <button key={e} onClick={() => setFiltro(e)}
            style={{background: filtro === e ? 'rgba(212,175,106,0.15)' : '#1a1a1a', border: `1px solid ${filtro === e ? '#d4af6a' : 'rgba(255,255,255,0.07)'}`, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', color: filtro === e ? '#d4af6a' : '#a09d99', cursor:'pointer'}}>
            {e}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>Cargando ordenes...</p>
      ) : ordenesFiltradas.length === 0 ? (
        <p style={{color:'#6b6866',fontSize:'13px'}}>No hay ordenes {filtro !== 'Todos' ? 'con estado ' + filtro : 'registradas'}.</p>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {ordenesFiltradas.map(o => (
            <div key={o.id} style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'500',color:'#f0ede8'}}>{o.cliente}</div>
                  <div style={{fontSize:'12px',color:'#a09d99',marginTop:'2px'}}>{o.producto} · x{o.cantidad}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'16px',fontWeight:'600',color:'#d4af6a'}}>${(o.precio * o.cantidad).toFixed(2)}</div>
                  <div style={{fontSize:'11px',color:'#6b6866',marginTop:'2px'}}>{o.fecha?.slice(0,10)}</div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'11px',color:'#6b6866'}}>{o.canal}</span>
                <select value={o.estado} onChange={e => updateEstado(o.id, e.target.value)}
                  style={{background:`${ESTADO_COLORS[o.estado]}15`,border:`1px solid ${ESTADO_COLORS[o.estado]}40`,borderRadius:'6px',padding:'3px 8px',fontSize:'12px',color:ESTADO_COLORS[o.estado],fontFamily:'inherit',cursor:'pointer'}}>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              {o.notas && <div style={{fontSize:'12px',color:'#6b6866',marginTop:'8px',paddingTop:'8px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>{o.notas}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
