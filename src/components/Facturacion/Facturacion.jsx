import React, { useState, useMemo } from 'react'

const FACTURAS = [
  { id:'FAC-0201', cliente:'Maria González',   fecha:'2026-08-02', vence:'2026-08-16', items:[{desc:'Anillo Solitario 18K',qty:1,precio:850},{desc:'Aretes Perla',qty:1,precio:450}], estado:'pendiente', pagado:0 },
  { id:'FAC-0200', cliente:'Carlos Mendez',    fecha:'2026-08-01', vence:'2026-08-15', items:[{desc:'Collar Diamante 0.5ct',qty:1,precio:1200}], estado:'pagada', pagado:1200 },
  { id:'FAC-0199', cliente:'Ana Rodríguez',    fecha:'2026-07-30', vence:'2026-08-13', items:[{desc:'Pulsera Charm Plata',qty:2,precio:240},{desc:'Aretes Perla',qty:1,precio:450}], estado:'pendiente', pagado:0 },
  { id:'FAC-0198', cliente:'Roberto Silva',    fecha:'2026-07-28', vence:'2026-08-11', items:[{desc:'Anillo Compromiso 1ct',qty:1,precio:2400}], estado:'vencida', pagado:0 },
  { id:'FAC-0197', cliente:'Lucía Herrera',    fecha:'2026-07-25', vence:'2026-08-08', items:[{desc:'Broche Esmeralda 18K',qty:1,precio:1900}], estado:'pagada', pagado:1900 },
  { id:'FAC-0196', cliente:'Diego Montoya',    fecha:'2026-07-22', vence:'2026-08-05', items:[{desc:'Collar Corazon Oro',qty:1,precio:380},{desc:'Pulsera Plata 925',qty:1,precio:320}], estado:'pagada', pagado:700 },
]

const total  = f => f.items.reduce((s,i) => s + i.qty * i.precio, 0)
const colEst = { pagada:'#4ade80', pendiente:'#fbbf24', vencida:'#fb7185' }
const bgEst  = { pagada:'rgba(74,222,128,0.1)', pendiente:'rgba(251,191,36,0.1)', vencida:'rgba(251,113,133,0.1)' }

const st = {
  page: { display:'flex', flexDirection:'column', height:'100%', minHeight:0, gap:'16px' },
  hdr:  { display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  title:{ fontSize:'18px', fontWeight:'600', color:'#f0ede8' },
  sub:  { fontSize:'12px', color:'#6b6866', marginTop:'2px' },
  cards:{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', flexShrink:0 },
  card: (col) => ({ background:'#1a1a1a', border:`1px solid ${col || 'rgba(255,255,255,0.06)'}`, borderRadius:'10px', padding:'14px 16px' }),
  cval: (col) => ({ fontSize:'24px', fontWeight:'700', color: col || '#d4af6a', lineHeight:1.2 }),
  clbl: { fontSize:'11px', color:'#6b6866', marginTop:'4px' },
  tbl:  { flex:1, minHeight:0, overflowY:'auto', background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px' },
  table:{ width:'100%', borderCollapse:'collapse', fontSize:'12px' },
  th:   { padding:'10px 14px', textAlign:'left', color:'#6b6866', fontWeight:'500', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'sticky', top:0, background:'#111' },
  td:   { padding:'10px 14px', color:'#c9c7c3', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'top' },
  badge:(e) => ({ display:'inline-block', padding:'2px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'600', background: bgEst[e], color: colEst[e] }),
  btn:  { background:'rgba(212,175,106,0.12)', color:'#d4af6a', border:'1px solid rgba(212,175,106,0.3)', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit' },
  filter:{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'6px', padding:'7px 12px', color:'#f0ede8', fontSize:'12px', fontFamily:'inherit', cursor:'pointer' },
  modal:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  mbox: { background:'#1a1a1a', border:'1px solid rgba(212,175,106,0.2)', borderRadius:'12px', padding:'24px', width:'520px', maxHeight:'80vh', overflowY:'auto' },
}

function ModalFactura({ f, onClose }) {
  if (!f) return null
  const tot = total(f)
  const iva = tot * 0.16
  return (
    <div style={st.modal} onClick={onClose}>
      <div style={st.mbox} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
          <div style={{ fontSize:'16px', fontWeight:'600', color:'#f0ede8' }}>Factura {f.id}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#6b6866', cursor:'pointer', fontSize:'18px' }}>×</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px', fontSize:'12px' }}>
          <div><div style={{ color:'#6b6866' }}>Cliente</div><div style={{ color:'#f0ede8', marginTop:'4px', fontWeight:'600' }}>{f.cliente}</div></div>
          <div><div style={{ color:'#6b6866' }}>Fecha</div><div style={{ color:'#f0ede8', marginTop:'4px' }}>{f.fecha}</div></div>
          <div><div style={{ color:'#6b6866' }}>Vencimiento</div><div style={{ color:'#fbbf24', marginTop:'4px' }}>{f.vence}</div></div>
          <div><div style={{ color:'#6b6866' }}>Estado</div><div style={{ marginTop:'4px' }}><span style={st.badge(f.estado)}>{f.estado}</span></div></div>
        </div>
        <div style={{ background:'#111', borderRadius:'8px', overflow:'hidden', marginBottom:'16px' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr>{['Descripción','Cant','Precio','Total'].map(h => <th key={h} style={{ padding:'8px 12px', textAlign:'left', color:'#6b6866', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {f.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding:'8px 12px', color:'#c9c7c3' }}>{item.desc}</td>
                  <td style={{ padding:'8px 12px', color:'#a09d99' }}>{item.qty}</td>
                  <td style={{ padding:'8px 12px' }}>${item.precio.toLocaleString()}</td>
                  <td style={{ padding:'8px 12px', color:'#d4af6a', fontWeight:'600' }}>${(item.qty*item.precio).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:'12px', display:'flex', flexDirection:'column', gap:'6px', marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', color:'#a09d99' }}><span>Subtotal</span><span>${tot.toLocaleString()}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', color:'#a09d99' }}><span>IVA 16%</span><span>${iva.toFixed(0)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', color:'#d4af6a', fontWeight:'700', fontSize:'14px', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'8px' }}>
            <span>TOTAL</span><span>${(tot + iva).toLocaleString()}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
          <button style={st.btn}>🖨 Imprimir</button>
          <button style={st.btn}>📧 Enviar</button>
          {f.estado !== 'pagada' && <button style={{ ...st.btn, background:'rgba(74,222,128,0.12)', color:'#4ade80', borderColor:'rgba(74,222,128,0.3)' }}>✓ Marcar Pagada</button>}
        </div>
      </div>
    </div>
  )
}

export default function Facturacion() {
  const [filtro, setFiltro]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() =>
    filtro === 'all' ? FACTURAS : FACTURAS.filter(f => f.estado === filtro)
  , [filtro])

  const totalPendiente = FACTURAS.filter(f => f.estado === 'pendiente').reduce((s,f) => s + total(f), 0)
  const totalVencida   = FACTURAS.filter(f => f.estado === 'vencida').reduce((s,f) => s + total(f), 0)
  const totalCobrado   = FACTURAS.filter(f => f.estado === 'pagada').reduce((s,f) => s + f.pagado, 0)
  const totalGeneral   = FACTURAS.reduce((s,f) => s + total(f), 0)

  return (
    <div style={st.page}>
      <ModalFactura f={selected} onClose={() => setSelected(null)} />

      <div style={st.hdr}>
        <div>
          <div style={st.title}>🧾 Facturación</div>
          <div style={st.sub}>{FACTURAS.length} facturas · ${totalGeneral.toLocaleString()} total período</div>
        </div>
        <button style={st.btn}>+ Nueva Factura</button>
      </div>

      <div style={st.cards}>
        <div style={st.card()}>
          <div style={st.cval()}>${totalCobrado.toLocaleString()}</div>
          <div style={st.clbl}>Cobrado este mes</div>
        </div>
        <div style={st.card('rgba(251,191,36,0.2)')}>
          <div style={st.cval('#fbbf24')}>${totalPendiente.toLocaleString()}</div>
          <div style={st.clbl}>Por cobrar</div>
        </div>
        <div style={st.card('rgba(251,113,133,0.2)')}>
          <div style={st.cval('#fb7185')}>${totalVencida.toLocaleString()}</div>
          <div style={st.clbl}>Vencido</div>
        </div>
        <div style={st.card()}>
          <div style={st.cval()}>{FACTURAS.filter(f=>f.estado==='pagada').length}/{FACTURAS.length}</div>
          <div style={st.clbl}>Tasa de cobro</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
        {['all','pendiente','pagada','vencida'].map(e => (
          <button key={e} onClick={() => setFiltro(e)} style={{
            padding:'6px 14px', borderRadius:'6px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', border:'none',
            background: filtro===e ? 'rgba(212,175,106,0.15)' : 'transparent',
            color:      filtro===e ? '#d4af6a' : '#6b6866'
          }}>
            {e === 'all' ? 'Todas' : e.charAt(0).toUpperCase()+e.slice(1)}
          </button>
        ))}
      </div>

      <div style={st.tbl}>
        <table style={st.table}>
          <thead>
            <tr>{['#Factura','Cliente','Fecha','Vencimiento','Items','Subtotal','IVA','Total','Estado',''].map(h =>
              <th key={h} style={st.th}>{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {filtered.map(f => {
              const tot = total(f)
              return (
                <tr key={f.id} style={{ cursor:'pointer' }} onClick={() => setSelected(f)}>
                  <td style={{ ...st.td, color:'#d4af6a', fontFamily:'monospace' }}>{f.id}</td>
                  <td style={st.td}>{f.cliente}</td>
                  <td style={{ ...st.td, color:'#6b6866' }}>{f.fecha}</td>
                  <td style={{ ...st.td, color: f.estado==='vencida' ? '#fb7185' : '#a09d99' }}>{f.vence}</td>
                  <td style={{ ...st.td, color:'#6b6866' }}>{f.items.length} producto{f.items.length>1?'s':''}</td>
                  <td style={st.td}>${tot.toLocaleString()}</td>
                  <td style={{ ...st.td, color:'#6b6866' }}>${(tot*0.16).toFixed(0)}</td>
                  <td style={{ ...st.td, fontWeight:'600', color:'#d4af6a' }}>${(tot*1.16).toLocaleString()}</td>
                  <td style={st.td}><span style={st.badge(f.estado)}>{f.estado}</span></td>
                  <td style={st.td}><span style={{ color:'#d4af6a', fontSize:'10px' }}>Ver →</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
