import React, { useState, useRef, useEffect, useCallback } from 'react'

const WS_URL = 'ws://localhost:8091'

export default function VoiceCall() {
  const [status, setStatus] = useState('idle') // idle | connecting | connected | error
  const [transcript, setTranscript] = useState([])
  const [audioLevel, setAudioLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [detectedLang, setDetectedLang] = useState(null)

  const wsRef = useRef(null)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)
  const processorRef = useRef(null)
  const analyserRef = useRef(null)
  const animFrameRef = useRef(null)
  const audioQueueRef = useRef([])
  const playbackCtxRef = useRef(null)
  const transcriptEndRef = useRef(null)

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  const addMessage = useCallback((role, text) => {
    const lang = /[áéíóúñ¿¡]/i.test(text) ? 'ES' : 'EN'
    setDetectedLang(lang)
    setTranscript(prev => [...prev, { role, text, time: new Date().toLocaleTimeString(), lang }])
  }, [])

  const playAudioChunk = useCallback(async (audioData) => {
    try {
      if (!playbackCtxRef.current) {
        playbackCtxRef.current = new AudioContext({ sampleRate: 24000 })
      }
      const ctx = playbackCtxRef.current
      const buffer = ctx.createBuffer(1, audioData.byteLength / 2, 24000)
      const channelData = buffer.getChannelData(0)
      const int16 = new Int16Array(audioData)
      for (let i = 0; i < int16.length; i++) {
        channelData[i] = int16[i] / 32768
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
    } catch (e) {
      console.error('Audio playback error:', e)
    }
  }, [])

  const trackAudioLevel = useCallback(() => {
    if (!analyserRef.current) return
    const data = new Uint8Array(analyserRef.current.fftSize)
    analyserRef.current.getByteTimeDomainData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum += Math.abs(data[i] - 128)
    }
    setAudioLevel(Math.min(100, (sum / data.length) * 5))
    animFrameRef.current = requestAnimationFrame(trackAudioLevel)
  }, [])

  const startCall = useCallback(async () => {
    setStatus('connecting')
    setTranscript([])

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      const ctx = new AudioContext({ sampleRate: 16000 })
      audioCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      source.connect(analyser)

      const processor = ctx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor
      source.connect(processor)
      processor.connect(ctx.destination)

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws
      ws.binaryType = 'arraybuffer'

      ws.onopen = () => {
        setStatus('connected')
        addMessage('system', '🟢 Llamada conectada — HB Jewelry Voice Agent activo')
        trackAudioLevel()
      }

      ws.onmessage = async (evt) => {
        if (evt.data instanceof ArrayBuffer) {
          await playAudioChunk(evt.data)
        } else {
          try {
            const msg = JSON.parse(evt.data)
            if (msg.type === 'transcription' && msg.text) {
              addMessage('agent', msg.text)
            }
          } catch {}
        }
      }

      ws.onerror = () => {
        setStatus('error')
        addMessage('system', '⚠️ Error de conexión con el agente de voz')
      }

      ws.onclose = () => {
        if (status !== 'idle') {
          setStatus('idle')
          addMessage('system', '🔴 Llamada finalizada')
        }
        cancelAnimationFrame(animFrameRef.current)
        setAudioLevel(0)
      }

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN || isMuted) return
        const float32 = e.inputBuffer.getChannelData(0)
        const int16 = new Int16Array(float32.length)
        for (let i = 0; i < float32.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768))
        }
        ws.send(int16.buffer)
      }

    } catch (err) {
      setStatus('error')
      addMessage('system', `⚠️ Error: ${err.message}`)
    }
  }, [addMessage, playAudioChunk, trackAudioLevel, isMuted, status])

  const endCall = useCallback(() => {
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach(t => t.stop())
    processorRef.current?.disconnect()
    audioCtxRef.current?.close()
    playbackCtxRef.current?.close()
    playbackCtxRef.current = null
    cancelAnimationFrame(animFrameRef.current)
    setStatus('idle')
    setAudioLevel(0)
  }, [])

  useEffect(() => () => endCall(), [])

  const bars = Array.from({ length: 20 }, (_, i) => i)
  const isActive = status === 'connected'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 4px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f0ede8', margin: 0 }}>
            🎙 Agente de Voz Bilingüe
          </h2>
          <p style={{ fontSize: 13, color: '#a09d99', marginTop: 4, margin: '4px 0 0' }}>
            HB Jewelry · INFINITEX · Gemini Live API
          </p>
        </div>
        {detectedLang && (
          <div style={{
            background: detectedLang === 'ES' ? 'rgba(212,175,106,0.15)' : 'rgba(96,165,250,0.15)',
            border: `1px solid ${detectedLang === 'ES' ? '#d4af6a' : '#60a5fa'}`,
            borderRadius: 20, padding: '4px 12px', fontSize: 12,
            color: detectedLang === 'ES' ? '#d4af6a' : '#60a5fa', fontWeight: 600
          }}>
            {detectedLang === 'ES' ? '🇨🇴 Español' : '🇺🇸 English'}
          </div>
        )}
      </div>

      {/* Status Card */}
      <div style={{
        background: '#111', border: `1px solid ${isActive ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16, padding: 24, marginBottom: 20,
        transition: 'border-color 0.3s'
      }}>
        {/* Visualizador de onda */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 3, height: 60, marginBottom: 24
        }}>
          {bars.map(i => {
            const height = isActive
              ? Math.max(4, Math.random() * audioLevel * 0.6 + 4)
              : 4
            return (
              <div key={i} style={{
                width: 3, height, borderRadius: 2,
                background: isActive ? '#34d399' : 'rgba(255,255,255,0.1)',
                transition: 'height 0.1s ease, background 0.3s',
                animation: isActive ? `pulse-bar ${0.3 + (i % 5) * 0.1}s ease-in-out infinite alternate` : 'none'
              }} />
            )
          })}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          {status === 'idle' || status === 'error' ? (
            <button
              onClick={startCall}
              style={{
                background: 'linear-gradient(135deg, #34d399, #059669)',
                color: '#fff', border: 'none', borderRadius: 50,
                width: 72, height: 72, fontSize: 28, cursor: 'pointer',
                boxShadow: '0 0 24px rgba(52,211,153,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              title="Iniciar llamada"
            >
              🎙
            </button>
          ) : status === 'connecting' ? (
            <div style={{
              width: 72, height: 72, borderRadius: 50,
              border: '3px solid #d4af6a', borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
            }}>⏳</div>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(m => !m)}
                style={{
                  background: isMuted ? 'rgba(251,113,133,0.15)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${isMuted ? 'rgba(251,113,133,0.4)' : 'rgba(255,255,255,0.15)'}`,
                  color: isMuted ? '#fb7185' : '#a09d99',
                  borderRadius: 50, width: 48, height: 48, fontSize: 20,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title={isMuted ? 'Activar micrófono' : 'Silenciar'}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>

              <button
                onClick={endCall}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff', border: 'none', borderRadius: 50,
                  width: 72, height: 72, fontSize: 28, cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(239,68,68,0.4)',
                  transition: 'transform 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                title="Finalizar llamada"
              >
                📵
              </button>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#6b6866' }}>
          {status === 'idle' && 'Presiona para iniciar llamada bilingüe'}
          {status === 'connecting' && 'Conectando con Gemini Live API...'}
          {status === 'connected' && `🟢 En llamada ${isMuted ? '· 🔇 Silenciado' : ''}`}
          {status === 'error' && '⚠️ Error — Verifica que el voice_worker esté activo'}
        </div>
      </div>

      {/* Transcripción */}
      {transcript.length > 0 && (
        <div style={{
          background: '#111', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: 16, maxHeight: 280, overflowY: 'auto'
        }}>
          <div style={{ fontSize: 12, color: '#6b6866', marginBottom: 12, fontWeight: 500 }}>
            TRANSCRIPCIÓN EN TIEMPO REAL
          </div>
          {transcript.map((m, i) => (
            <div key={i} style={{
              marginBottom: 10,
              opacity: i === transcript.length - 1 ? 1 : 0.7
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: m.role === 'agent' ? '#34d399' : m.role === 'system' ? '#d4af6a' : '#60a5fa'
                }}>
                  {m.role === 'agent' ? '🤖 Agente' : m.role === 'system' ? '⚙ Sistema' : '👤 Tú'}
                </span>
                <span style={{ fontSize: 10, color: '#3a3836' }}>{m.time}</span>
              </div>
              <div style={{ fontSize: 13, color: '#f0ede8', lineHeight: 1.5, paddingLeft: 4 }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      )}

      {/* Info Panel */}
      <div style={{
        marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10
      }}>
        {[
          { icon: '📱', label: 'WhatsApp', value: '+1 (954) 684-4445' },
          { icon: '🤖', label: 'Motor IA', value: 'Gemini 2.0 Flash Live' },
          { icon: '🌐', label: 'Idiomas', value: 'ES / EN automático' },
          { icon: '💎', label: 'Marca', value: 'HB Jewelry · INFINITEX' },
        ].map((item, i) => (
          <div key={i} style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center'
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: '#6b6866', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#f0ede8', fontWeight: 500 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-bar {
          from { transform: scaleY(1); }
          to { transform: scaleY(1.4); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
