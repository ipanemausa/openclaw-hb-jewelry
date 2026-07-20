import React, { useState } from 'react'
import '../../styles/hb.css'

const stats = [
  { label: 'Visitas totales', value: '12,840', change: '+18%', up: true },
  { label: 'Conversion rate', value: '3.2%', change: '+0.4%', up: true },
  { label: 'Revenue mensual', value: '$48,200', change: '+12%', up: true },
  { label: 'Ticket promedio', value: '$380', change: '-5%', up: false },
]

const canales = [
  { nombre: 'Instagram', sesiones: 4820, ventas: 28, revenue: 12400 },
  { nombre: 'Facebook', sesiones: 2340, ventas: 14, revenue: 6800 },
  { nombre: 'Google Ads', sesiones: 3100, ventas: 22, revenue: 9200 },
  { nombre: 'Shopify Direct', sesiones: 1800, ventas: 18, revenue: 7600 },
  { nombre: 'WhatsApp', sesiones: 780, ventas: 8, revenue: 4200 },
]

export default function Analytics() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hola, soy tu Copiloto Financiero. Basado en el RAG de Muncher y Teso, ¿qué métricas deseas analizar hoy?' }]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    
    // Teoría de Colas: Bypass usando Edge Cache Localidad de Datos
    const cacheKey = `rag_cache_${userMsg.text.toLowerCase().trim()}`;
    const cachedResponse = localStorage.getItem(cacheKey);
    
    if (cachedResponse) {
      setMessages(prev => [...prev, { role: 'assistant', text: `(Desde Caché ⚡) ${cachedResponse}` }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8093/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text })
      });
      const data = await res.json();
      if (data.answer) {
        localStorage.setItem(cacheKey, data.answer);
        setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Error: ' + (data.error || 'Desconocido') }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error de conexión con el motor RAG.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="hb-page" style={{ display: 'flex', gap: '20px' }}>
      
      {/* Lado izquierdo: Dashboard normal */}
      <div style={{ flex: 2 }}>
      <div className="hb-page-header">
        <div>
          <div className="hb-page-title">Analytics</div>
          <div className="hb-page-subtitle">Métricas del mes actual</div>
        </div>
        <button className="hb-btn">Exportar</button>
      </div>

      <div className="hb-grid" style={{ marginBottom: '20px' }}>
        {stats.map(s => (
          <div key={s.label} className="hb-card">
            <div className="hb-card-meta">{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#f0ede8', margin: '8px 0 4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: s.up ? '#4ade80' : '#fb7185' }}>{s.change} vs mes anterior</div>
          </div>
        ))}
      </div>

      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Canal</th>
              <th>Sesiones</th>
              <th>Ventas</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {canales.map(c => (
              <tr key={c.nombre}>
                <td className="td-main">{c.nombre}</td>
                <td className="td-muted">{c.sesiones.toLocaleString()}</td>
                <td className="td-main">{c.ventas}</td>
                <td className="td-gold">${c.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      
      {/* Lado derecho: Copiloto Financiero RAG */}
      <div style={{ flex: 1, background: '#1c1c1c', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '16px' }}><i className="bi bi-robot"></i> Copilot Financiero</h3>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              background: m.role === 'user' ? '#333' : '#222',
              borderLeft: m.role === 'assistant' ? '3px solid #0f0' : 'none',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
              color: '#eee',
              fontSize: '14px'
            }}>
              {m.text}
            </div>
          ))}
          {loading && <div style={{ color: '#0f0', fontSize: '12px' }}>Procesando (RAG)...</div>}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Pregunta sobre las finanzas..." 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#000', color: '#fff' }}
          />
          <button className="hb-btn" onClick={handleAsk}>Enviar</button>
        </div>
      </div>

    </div>
  )
}
