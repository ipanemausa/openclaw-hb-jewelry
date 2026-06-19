import React, { useState, useEffect } from 'react'

const API = ''

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [pr, sr] = await Promise.all([
        fetch(API + '/api/hb/products').then(r => r.json()),
        fetch(API + '/api/hb/sales').then(r => r.json())
      ])
      setProducts(pr.products || [])
      setSales(sr.sales || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const totalVentas = sales.reduce((a, s) => a + s.total, 0)
  const lowStock = products.filter(p => p.inventario < 6)
  const porCanal = sales.reduce((acc, s) => { acc[s.canal_venta] = (acc[s.canal_venta] || 0) + s.total; return acc }, {})
  const canalColors = { Instagram: '#a78bfa', WhatsApp: '#4ade80', Shopify: '#34d399', TikTok: '#fb7185', Tienda: '#60a5fa' }

  if (loading) return <p style={{color:'#6b6866',fontSize:'13px'}}>Cargando dashboard...</p>

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>Dashboard</h2>
        <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>Resumen de HB Jewelry</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px',marginBottom:'24px'}}>
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'#6b6866',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'8px'}}>Total Ventas</div>
          <div style={{fontSize:'28px',fontWeight:'600',color:'#d4af6a'}}>${totalVentas.toFixed(2)}</div>
          <div style={{fontSize:'12px',color:'#a09d99',marginTop:'4px'}}>{sales.length} pedidos</div>
        </div>
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'#6b6866',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'8px'}}>Productos</div>
          <div style={{fontSize:'28px',fontWeight:'600',color:'#60a5fa'}}>{products.length}</div>
          <div style={{fontSize:'12px',color:'#a09d99',marginTop:'4px'}}>en catalogo</div>
        </div>
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'#6b6866',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'8px'}}>Stock Bajo</div>
          <div style={{fontSize:'28px',fontWeight:'600',color:lowStock.length > 0 ? '#fb7185':'#34d399'}}>{lowStock.length}</div>
          <div style={{fontSize:'12px',color:'#a09d99',marginTop:'4px'}}>productos</div>
        </div>
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'#6b6866',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'8px'}}>Ticket Promedio</div>
          <div style={{fontSize:'28px',fontWeight:'600',color:'#34d399'}}>${sales.length > 0 ? (totalVentas/sales.length).toFixed(2) : '0.00'}</div>
          <div style={{fontSize:'12px',color:'#a09d99',marginTop:'4px'}}>por venta</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px'}}>
        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'13px',fontWeight:'500',color:'#a09d99',marginBottom:'14px'}}>Ventas por canal</div>
          {Object.keys(porCanal).length === 0 ? (
            <p style={{fontSize:'13px',color:'#6b6866'}}>Sin datos aun</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {Object.entries(porCanal).map(([canal, monto]) => (
                <div key={canal}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                    <span style={{fontSize:'12px',color:canalColors[canal]||'#a09d99'}}>{canal}</span>
                    <span style={{fontSize:'12px',color:'#d4af6a',fontWeight:'600'}}>${monto.toFixed(2)}</span>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'4px',height:'4px'}}>
                    <div style={{background:canalColors[canal]||'#a09d99',borderRadius:'4px',height:'4px',width:`${(monto/totalVentas*100).toFixed(0)}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'13px',fontWeight:'500',color:'#a09d99',marginBottom:'14px'}}>Stock bajo</div>
          {lowStock.length === 0 ? (
            <p style={{fontSize:'13px',color:'#34d399'}}>Todo el inventario OK</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {lowStock.map(p => (
                <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'13px',color:'#f0ede8'}}>{p.nombre}</span>
                  <span style={{fontSize:'11px',background:'rgba(251,113,133,0.15)',color:'#fb7185',padding:'2px 8px',borderRadius:'10px'}}>Stock: {p.inventario}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'18px'}}>
        <div style={{fontSize:'13px',fontWeight:'500',color:'#a09d99',marginBottom:'14px'}}>Ultimas ventas</div>
        {sales.slice(0,5).map(s => (
          <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <div>
              <div style={{fontSize:'13px',color:'#f0ede8'}}>{s.producto}</div>
              <div style={{fontSize:'11px',color:'#6b6866'}}>{s.cliente} · {s.fecha?.slice(0,10)}</div>
            </div>
            <div style={{fontSize:'14px',fontWeight:'600',color:'#d4af6a'}}>${s.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
