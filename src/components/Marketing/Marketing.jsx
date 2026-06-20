import React, { useState } from 'react'

const API = ''

const TIPOS = [
  { id: 'instagram_post', label: 'Post Instagram', icon: '📸', prompt: 'Crea un post completo para Instagram de HB Jewelry con caption, hashtags en ingles y espanol, y llamada a la accion. Producto: ' },
  { id: 'instagram_reel', label: 'Guion Reel', icon: '🎬', prompt: 'Crea un guion completo para un Reel de Instagram de 30 segundos para HB Jewelry. Incluye texto en pantalla, musica sugerida y transiciones. Producto: ' },
  { id: 'tiktok', label: 'Video TikTok', icon: '🎵', prompt: 'Crea un guion viral para TikTok de HB Jewelry de 15-30 segundos. Incluye hook, desarrollo y CTA. Producto: ' },
  { id: 'whatsapp', label: 'Mensaje WhatsApp', icon: '💬', prompt: 'Crea un mensaje de ventas profesional para WhatsApp Business de HB Jewelry. Debe ser amigable, breve y persuasivo. Producto: ' },
  { id: 'descripcion', label: 'Descripcion producto', icon: '✍️', prompt: 'Crea una descripcion de producto elegante y persuasiva para HB Jewelry. Incluye materiales, beneficios y ocasiones de uso. Producto: ' },
  { id: 'campana', label: 'Campana', icon: '🚀', prompt: 'Crea una campana completa de marketing para HB Jewelry con nombre de campana, concepto, contenido para Instagram, WhatsApp y TikTok. Tema: ' },
]

const STORAGE_KEY = 'hb_plantillas'

export default function Marketing() {
  const [tipo, setTipo] = useState(TIPOS[0])
  const [producto, setProducto] = useState('')
  const [resultado, setResultado] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [historial, setHistorial] = useState([])
  const [plantillas, setPlantillas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [vista, setVista] = useState('generar')
  const [nombrePlantilla, setNombrePlantilla] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function generar() {
    if (!producto.trim() || loading) return
    setLoading(true)
    setResultado('')
    setNombrePlantilla('')

    try {
      let sid = sessionId
      if (!sid) {
        const sr = await fetch(API + '/api/mcp/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent: 'marketing' })
        })
        const sd = await sr.json()
        sid = sd.session_id
        setSessionId(sid)
      }

      const r = await fetch(API + '/api/mcp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'marketing', message: tipo.prompt + producto, session_id: sid })
      })
      const d = await r.json()
      setResultado(d.response)
      setHistorial(prev => [{ tipo: tipo.label, producto, resultado: d.response, fecha: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)])
    } catch(e) {
      setResultado('Error conectando con el agente.')
    }
    setLoading(false)
  }

  function copiar() {
    navigator.clipboard.writeText(resultado)
  }

  function guardarPlantilla() {
    if (!resultado || !nombrePlantilla.trim()) return
    setGuardando(true)
    const nueva = {
      id: Date.now(),
      nombre: nombrePlantilla,
      tipo: tipo.label,
      producto,
      contenido: resultado,
      fecha: new Date().toLocaleDateString()
    }
    const nuevas = [nueva, ...plantillas]
    setPlantillas(nuevas)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas))
    setNombrePlantilla('')
    setGuardando(false)
    alert('Plantilla guardada!')
  }

  function eliminarPlantilla(id) {
    const nuevas = plantillas.filter(p => p.id !== id)
    setPlantillas(nuevas)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas))
  }

  function usarPlantilla(p) {
    setResultado(p.contenido)
    setVista('generar')
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <div>
          <h2 style={{fontSize:'18px',fontWeight:'600',color:'#f0ede8'}}>Marketing</h2>
          <p style={{fontSize:'13px',color:'#a09d99',marginTop:'4px'}}>Genera contenido con IA para HB Jewelry</p>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => setVista('generar')} style={{background: vista==='generar' ? 'rgba(212,175,106,0.15)':'#1a1a1a', border:`1px solid ${vista==='generar'?'#d4af6a':'rgba(255,255,255,0.07)'}`, borderRadius:'8px', padding:'7px 14px', fontSize:'12px', color: vista==='generar'?'#d4af6a':'#a09d99', cursor:'pointer'}}>
            Generar
          </button>
          <button onClick={() => setVista('plantillas')} style={{background: vista==='plantillas' ? 'rgba(212,175,106,0.15)':'#1a1a1a', border:`1px solid ${vista==='plantillas'?'#d4af6a':'rgba(255,255,255,0.07)'}`, borderRadius:'8px', padding:'7px 14px', fontSize:'12px', color: vista==='plantillas'?'#d4af6a':'#a09d99', cursor:'pointer'}}>
            Plantillas ({plantillas.length})
          </button>
        </div>
      </div>

      {vista === 'generar' && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'8px',marginBottom:'20px'}}>
            {TIPOS.map(t => (
              <button key={t.id} onClick={() => { setTipo(t); setResultado('') }}
                style={{background: tipo.id===t.id ? 'rgba(212,175,106,0.15)':'#1a1a1a', border:`1px solid ${tipo.id===t.id?'#d4af6a':'rgba(255,255,255,0.07)'}`, borderRadius:'10px', padding:'12px', cursor:'pointer', textAlign:'left'}}>
                <div style={{fontSize:'20px',marginBottom:'6px'}}>{t.icon}</div>
                <div style={{fontSize:'12px',fontWeight:'500',color: tipo.id===t.id?'#d4af6a':'#f0ede8'}}>{t.label}</div>
              </button>
            ))}
          </div>

          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
            <div style={{fontSize:'13px',color:'#a09d99',marginBottom:'10px'}}>{tipo.icon} {tipo.label}</div>
            <div style={{display:'flex',gap:'10px'}}>
              <input value={producto} onChange={e => setProducto(e.target.value)} onKeyDown={e => e.key==='Enter' && generar()}
                placeholder={tipo.id==='campana' ? 'Ej: Dia de la madre, verano...' : 'Ej: Collar plata rhodium, Aretes gota...'}
                style={{flex:1,background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 14px',color:'#f0ede8',fontSize:'13px',fontFamily:'inherit'}} />
              <button onClick={generar} disabled={loading||!producto.trim()}
                style={{background:'#d4af6a',color:'#000',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',opacity:loading||!producto.trim()?0.5:1}}>
                {loading ? 'Generando...' : 'Generar'}
              </button>
            </div>
          </div>

          {resultado && (
            <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                <div style={{fontSize:'13px',fontWeight:'500',color:'#a09d99'}}>{tipo.icon} Resultado</div>
                <button onClick={copiar} style={{background:'rgba(212,175,106,0.1)',border:'1px solid rgba(212,175,106,0.2)',borderRadius:'6px',padding:'4px 12px',fontSize:'12px',color:'#d4af6a',cursor:'pointer'}}>
                  Copiar
                </button>
              </div>
              <div style={{fontSize:'13px',color:'#f0ede8',lineHeight:'1.7',whiteSpace:'pre-wrap',marginBottom:'16px'}}>{resultado}</div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'14px'}}>
                <div style={{fontSize:'12px',color:'#a09d99',marginBottom:'8px'}}>Guardar como plantilla:</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <input value={nombrePlantilla} onChange={e => setNombrePlantilla(e.target.value)}
                    placeholder="Nombre de la plantilla..."
                    style={{flex:1,background:'#111',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'7px',padding:'7px 12px',color:'#f0ede8',fontSize:'12px',fontFamily:'inherit'}} />
                  <button onClick={guardarPlantilla} disabled={!nombrePlantilla.trim()}
                    style={{background:'rgba(52,211,153,0.15)',border:'1px solid rgba(52,211,153,0.3)',borderRadius:'7px',padding:'7px 14px',fontSize:'12px',color:'#34d399',cursor:'pointer',opacity:!nombrePlantilla.trim()?0.5:1}}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {historial.length > 0 && (
            <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'20px'}}>
              <div style={{fontSize:'13px',fontWeight:'500',color:'#a09d99',marginBottom:'14px'}}>Historial de sesion</div>
              {historial.map((h, i) => (
                <div key={i} onClick={() => setResultado(h.resultado)}
                  style={{padding:'10px',borderRadius:'8px',cursor:'pointer',marginBottom:'6px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:'12px',color:'#d4af6a'}}>{h.tipo}</span>
                    <span style={{fontSize:'11px',color:'#6b6866'}}>{h.fecha}</span>
                  </div>
                  <div style={{fontSize:'12px',color:'#a09d99',marginTop:'2px'}}>{h.producto}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {vista === 'plantillas' && (
        <div>
          {plantillas.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'#6b6866'}}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>📋</div>
              <div style={{fontSize:'14px'}}>No hay plantillas guardadas aun</div>
              <div style={{fontSize:'12px',marginTop:'6px'}}>Genera contenido y guardalo como plantilla</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {plantillas.map(p => (
                <div key={p.id} style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:'500',color:'#f0ede8'}}>{p.nombre}</div>
                      <div style={{fontSize:'11px',color:'#6b6866',marginTop:'2px'}}>{p.tipo} · {p.producto} · {p.fecha}</div>
                    </div>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button onClick={() => usarPlantilla(p)} style={{background:'rgba(212,175,106,0.1)',border:'1px solid rgba(212,175,106,0.2)',borderRadius:'6px',padding:'4px 10px',fontSize:'11px',color:'#d4af6a',cursor:'pointer'}}>
                        Usar
                      </button>
                      <button onClick={() => navigator.clipboard.writeText(p.contenido)} style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)',borderRadius:'6px',padding:'4px 10px',fontSize:'11px',color:'#60a5fa',cursor:'pointer'}}>
                        Copiar
                      </button>
                      <button onClick={() => eliminarPlantilla(p.id)} style={{background:'rgba(251,113,133,0.1)',border:'1px solid rgba(251,113,133,0.2)',borderRadius:'6px',padding:'4px 10px',fontSize:'11px',color:'#fb7185',cursor:'pointer'}}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:'12px',color:'#a09d99',lineHeight:'1.5',maxHeight:'80px',overflow:'hidden',position:'relative'}}>
                    {p.contenido.slice(0,200)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}