import React, { useState, useRef, useEffect } from 'react'

const WS_URL = 'ws://localhost:8091'

export default function FloatingVoiceWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | connecting | connected | error
  const [lastText, setLastText] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  const wsRef = useRef(null)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)

  const startVoice = async () => {
    setStatus('connecting')
    setLastText('Conectando con agente bilingüe...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new AudioContext({ sampleRate: 16000 })
      audioCtxRef.current = ctx

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws
      ws.binaryType = 'arraybuffer'

      ws.onopen = () => {
        setStatus('connected')
        setLastText('🟢 Escuchando... Habla en español o inglés.')
      }

      ws.onmessage = (evt) => {
        if (typeof evt.data === 'string') {
          try {
            const data = JSON.parse(evt.data)
            if (data.text) setLastText(data.text)
          } catch {}
        }
      }

      ws.onerror = () => {
        setStatus('error')
        setLastText('⚠️ Error de conexión con agente de voz.')
      }

      ws.onclose = () => {
        setStatus('idle')
        setLastText('')
      }
    } catch (err) {
      setStatus('error')
      setLastText(`Error: ${err.message}`)
    }
  }

  const stopVoice = () => {
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
    setStatus('idle')
    setLastText('')
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {isOpen && (
        <div style={{
          background: '#111', border: '1px solid rgba(212,175,106,0.4)',
          borderRadius: 16, padding: 16, width: 280, marginBottom: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#d4af6a' }}>🎙 Voz Bilingüe HB</div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#6b6866', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>

          <div style={{ fontSize: 12, color: '#f0ede8', marginBottom: 12, minHeight: 40, lineHeight: 1.4 }}>
            {lastText || 'Presiona el botón para iniciar llamada en tiempo real con Gemini.'}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {status !== 'connected' ? (
              <button onClick={startVoice} disabled={status === 'connecting'} style={{
                flex: 1, background: 'linear-gradient(135deg, #34d399, #059669)',
                color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>
                {status === 'connecting' ? 'Conectando...' : '🎙 Iniciar Voz'}
              </button>
            ) : (
              <button onClick={stopVoice} style={{
                flex: 1, background: '#ef4444', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>
                📵 Colgar
              </button>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} style={{
        background: status === 'connected' ? '#34d399' : 'linear-gradient(135deg, #d4af6a, #aa8237)',
        color: '#000', border: 'none', borderRadius: '50%', width: 52, height: 52,
        fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,106,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'
      }}>
        🎙
      </button>
    </div>
  )
}
