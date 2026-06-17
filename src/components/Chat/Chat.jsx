import React, { useState, useRef, useEffect } from 'react'
import '../../styles/chat.css'

const AGENTS = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'video', label: 'Video' },
  { value: 'shopify', label: 'Ventas' },
  { value: 'main', label: 'General' },
]

const API = ''

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy tu agente de HB Jewelry. En que te ayudo hoy?' }
  ])
  const [input, setInput] = useState('')
  const [agent, setAgent] = useState('marketing')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      let sid = sessionId
      if (!sid) {
        const sr = await fetch(API + '/api/mcp/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent })
        })
        const sd = await sr.json()
        sid = sd.session_id
        setSessionId(sid)
      }
      const r = await fetch(API + '/api/mcp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, message: userMsg, session_id: sid })
      })
      const d = await r.json()
      setMessages(prev => [...prev, { role: 'assistant', content: d.response }])
    } catch(e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error conectando con el agente.' }])
    }
    setLoading(false)
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Agente activo:</span>
        <select value={agent} onChange={e => { setAgent(e.target.value); setSessionId(null) }}>
          {AGENTS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={"chat-msg " + m.role}>
            <div className="chat-bubble">{m.content}</div>
          </div>
        ))}
        {loading && <div className="chat-msg assistant"><div className="chat-bubble loading">Pensando...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>Enviar</button>
      </div>
    </div>
  )
}