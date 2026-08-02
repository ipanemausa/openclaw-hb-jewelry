import React, { useState, useMemo } from 'react'

const PRODUCTOS = [
  { sku: 'ANI-001', nombre: 'Anillo Solitario Oro 18K',   cat: 'Anillos',   stock: 12, min: 5,  costo: 420, precio: 850,  proveedor: 'Oro Fino SA',    estado: 'activo' },
  { sku: 'COL-002', nombre: 'Collar Diamante 0.5ct',      cat: 'Collares',  stock: 5,  min: 3,  costo: 600, precio: 1200, proveedor: 'Gemas Import',   estado: 'activo' },
  { sku: 'PUL-003', nombre: 'Pulsera Plata 925',          cat: 'Pulseras',  stock: 0,  min: 8,  costo: 120, precio: 320,  proveedor: 'Silver World',   estado: 'sin_stock' },
  { sku: 'ARC-004', nombre: 'Aretes Perla Natural',       cat: 'Aretes',    stock: 8,  min: 4,  costo: 180, precio: 450,  proveedor: 'Pacific Perlas', estado: 'activo' },
  { sku: 'ANI-005', nombre: 'Anillo Compromiso 1ct',      cat: 'Anillos',   stock: 3,  min: 5,  costo: 1100, precio: 2400, proveedor: 'Gemas Import',  estado: 'bajo_stock' },
  { sku: 'COL-006', nombre: 'Collar Corazon Oro 14K',     cat: 'Collares',  stock: 15, min: 6,  costo: 160, precio: 380,  proveedor: 'Oro Fino SA',    estado: 'activo' },
  { sku: 'PUL-007', nombre: 'Pulsera Charm Plata',        cat: 'Pulseras',  stock: 7,  min: 10, costo: 95,  precio: 240,  proveedor: 'Silver World',   estado: 'bajo_stock' },
  { sku: 'BRO-008', nombre: 'Broche Esmeralda 18K',       cat: 'Broches',   stock: 2,  min: 3,  costo: 890, precio: 1900, proveedor: 'Gemas Import',   estado: 'bajo_stock' },
]

const MOVIMIENTOS = [
  { fecha: '2026-08-02', tipo: 'entrada',  sku: 'ANI-001', qty: 5,  ref: 'OC-0041', usuario: 'Guillermo' },
  { fecha: '2026-08-01', tipo: 'salida',   sku: 'COL-002', qty: 2,  ref: 'VTA-0189', usuario: 'Sistema' },
  { fecha: '2026-08-01', tipo: 'salida',   sku: 'ARC-004', qty: 1,  ref: 'VTA-0188', usuario: 'Sistema' },
  { fecha: '2026-07-31', tipo: 'entrada',  sku: 'COL-006', qty: 10, ref: 'OC-0040', usuario: 'Guillermo' },
  { fecha: '2026-07-30', tipo: 'ajuste',   sku: 'PUL-003', qty: -3, ref: 'AJU-012', usuario: 'Guillermo' },
]

const st = {
  page:    { display:'flex', flexDirection:'column', height:'100%', minHeight:0, gap:'16px' },
  hdr:     { display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  title:   { fontSize:'18px', fontWeight:'600', color:'#f0ede8' },
  sub:     { fontSize:'12px', color:'#6b6866', marginTop:'2px' },
  cards:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', flexShrink:0 },
  card:    { background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'14px 16px' },
  cval:    { fontSize:'24px', fontWeight:'700', color:'#d4af6a', lineHeight:1.2 },
  clbl:    { fontSize:'11px', color:'#6b6866', marginTop:'4px' },
  tabs:    { display:'flex', gap:'8px', flexShrink:0 },
  tab:     (a) => ({ padding:'6px 14px', borderRadius:'6px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', border:'none',
                     background: a ? 'rgba(212,175,106,0.15)' : 'transparent',
                     color:      a ? '#d4af6a' : '#6b6866' }),
  tbl:     { flex:1, minHeight:0, overflowY:'auto', background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px' },
  table:   { width:'100%', borderCollapse:'collapse', fontSize:'12px' },
  th:      { padding:'10px 14px', textAlign:'left', color:'#6b6866', fontWeight:'500', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'sticky', top:0, background:'#111' },
  td:      { padding:'10px 14px', color:'#c9c7c3', borderBottom:'1px solid rgba(255,255,255,0.04)' },
  badge:   (c) => ({ display:'inline-block', padding:'2px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'600',
                     background: c==='activo' ? 'rgba(74,222,128,0.12)' : c==='sin_stock' ? 'rgba(251,113,133,0.12)' : 'rgba(251,191,36,0.12)',
                     color:      c==='activo' ? '#4ade80'              : c==='sin_stock' ? '#fb7185'              : '#fbbf24' }),
  alerta:  { background:'rgba(251,113,133,0.08)', border:'1px solid rgba(251,113,133,0.2)', borderRadius:'8px', padding:'10px 14px', marginBottom:'8px', fontSize:'12px', color:'#fb7185' },
  btn:     { background:'rgba(212,175,106,0.12)', color:'#d4af6a', border:'1px solid rgba(212,175,106,0.3)', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit' },
  search:  { flex:1, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'6px', padding:'7px 12px', color:'#f0ede8', fontSize:'12px', fontFamily:'inherit' },
}

export default function Inventario() {
  const [tab, setTab]       = useState('stock')
  const [search, setSearch] = useState('')
  const [catFilter, setCat] = useState('all')

  const alertas    = PRODUCTOS.filter(p => p.stock === 0 || p.stock < p.min)
  const valorTotal = PRODUCTOS.reduce((acc, p) => acc + p.stock * p.costo, 0)
  const unidades   = PRODUCTOS.reduce((acc, p) => acc + p.stock, 0)
  const categorias = [...new Set(PRODUCTOS.map(p => p.cat))]

  const filtered = useMemo(() => PRODUCTOS.filter(p => {
    const ms = !search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const mc = catFilter === 'all' || p.cat === catFilter
    return ms && mc
  }), [search, catFilter])

  return (
    <div style={st.page}>

      {/* Header */}
      <div style={st.hdr}>
        <div>
          <div style={st.title}>📦 Inventario ERP</div>
          <div style={st.sub}>{PRODUCTOS.length} SKUs · {unidades} unidades · ${valorTotal.toLocaleString()} en stock</div>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button style={st.btn}>+ Entrada</button>
          <button style={st.btn}>↓ Exportar</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={st.cards}>
        <div style={st.card}>
          <div style={st.cval}>{PRODUCTOS.length}</div>
          <div style={st.clbl}>SKUs totales</div>
        </div>
        <div style={{ ...st.card, borderColor: alertas.length > 0 ? 'rgba(251,113,133,0.3)' : undefined }}>
          <div style={{ ...st.cval, color: alertas.length > 0 ? '#fb7185' : '#4ade80' }}>{alertas.length}</div>
          <div style={st.clbl}>Alertas de stock</div>
        </div>
        <div style={st.card}>
          <div style={st.cval}>${valorTotal.toLocaleString()}</div>
          <div style={st.clbl}>Valor en inventario</div>
        </div>
        <div style={st.card}>
          <div style={st.cval}>{unidades}</div>
          <div style={st.clbl}>Unidades disponibles</div>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && tab === 'stock' && (
        <div style={{ flexShrink:0 }}>
          {alertas.map(a => (
            <div key={a.sku} style={st.alerta}>
              ⚠ <strong>{a.sku}</strong> — {a.nombre} · Stock actual: <strong>{a.stock}</strong> · Mínimo: {a.min} · Proveedor: {a.proveedor}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
        <div style={st.tabs}>
          {['stock','movimientos'].map(t => (
            <button key={t} style={st.tab(tab===t)} onClick={() => setTab(t)}>
              {t === 'stock' ? '📦 Stock' : '🔄 Movimientos'}
            </button>
          ))}
        </div>
        {tab === 'stock' && <>
          <input style={st.search} placeholder="Buscar SKU o nombre..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ ...st.search, flex:'none', width:'130px', cursor:'pointer' }} value={catFilter} onChange={e => setCat(e.target.value)}>
            <option value="all">Todas las cats.</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </>}
      </div>

      {/* Tabla Stock */}
      {tab === 'stock' && (
        <div style={st.tbl}>
          <table style={st.table}>
            <thead>
              <tr>
                {['SKU','Nombre','Categoría','Stock','Mínimo','Costo','Precio','Margen','Proveedor','Estado'].map(h => (
                  <th key={h} style={st.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const margen = (((p.precio - p.costo) / p.precio) * 100).toFixed(0)
                return (
                  <tr key={p.sku}>
                    <td style={{ ...st.td, color:'#d4af6a', fontFamily:'monospace' }}>{p.sku}</td>
                    <td style={st.td}>{p.nombre}</td>
                    <td style={{ ...st.td, color:'#a09d99' }}>{p.cat}</td>
                    <td style={{ ...st.td, color: p.stock === 0 ? '#fb7185' : p.stock < p.min ? '#fbbf24' : '#4ade80', fontWeight:'600' }}>{p.stock}</td>
                    <td style={{ ...st.td, color:'#6b6866' }}>{p.min}</td>
                    <td style={st.td}>${p.costo.toLocaleString()}</td>
                    <td style={{ ...st.td, fontWeight:'600' }}>${p.precio.toLocaleString()}</td>
                    <td style={{ ...st.td, color:'#4ade80' }}>{margen}%</td>
                    <td style={{ ...st.td, color:'#a09d99' }}>{p.proveedor}</td>
                    <td style={st.td}><span style={st.badge(p.estado)}>{p.estado.replace('_',' ')}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Movimientos */}
      {tab === 'movimientos' && (
        <div style={st.tbl}>
          <table style={st.table}>
            <thead>
              <tr>
                {['Fecha','Tipo','SKU','Cantidad','Referencia','Usuario'].map(h => (
                  <th key={h} style={st.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOVIMIENTOS.map((m, i) => (
                <tr key={i}>
                  <td style={{ ...st.td, color:'#6b6866' }}>{m.fecha}</td>
                  <td style={st.td}>
                    <span style={st.badge(m.tipo === 'entrada' ? 'activo' : m.tipo === 'salida' ? 'sin_stock' : 'bajo_stock')}>
                      {m.tipo}
                    </span>
                  </td>
                  <td style={{ ...st.td, color:'#d4af6a', fontFamily:'monospace' }}>{m.sku}</td>
                  <td style={{ ...st.td, color: m.qty > 0 ? '#4ade80' : '#fb7185', fontWeight:'600' }}>
                    {m.qty > 0 ? '+' : ''}{m.qty}
                  </td>
                  <td style={{ ...st.td, color:'#a09d99' }}>{m.ref}</td>
                  <td style={st.td}>{m.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
