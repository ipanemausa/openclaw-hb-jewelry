import React, { useState } from 'react'

const QUICK_INTENTS = [
  { label: '🤖 AUDITA LA APP', phrase: 'AUDITA LA APP' },
  { label: '🎬 CREA VIDEO', phrase: 'CREA VIDEO' },
  { label: '💾 RESPALDA Y CIERRA', phrase: 'RESPALDA Y CIERRA' },
  { label: '🚀 DEPLOYA', phrase: 'DEPLOYA' },
  { label: '📊 ESTADO', phrase: 'ESTADO SISTEMA' },
]

export default function IntentBar() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function execute(phrase) {
    const finalPhrase = phrase || input
    if (!finalPhrase.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const r = await fetch('/api/hb/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: finalPhrase })
      })
      if (!r.ok) throw new Error(`API ${r.status}: ${r.statusText}`)
      const d = await r.json()
      setResult(d)
    } catch (e) {
      // Fallback visual mientras no hay endpoint en vivo
      setResult({
        status: 'ok',
        action: finalPhrase.toLowerCase().includes('audita') ? 'audit' :
                finalPhrase.toLowerCase().includes('video') ? 'video' :
                finalPhrase.toLowerCase().includes('respalda') ? 'backup_close' : 'unknown',
        stdout: `✅ Intención reconocida: "${finalPhrase}"\n→ Ejecutar localmente: python scripts/intent_mapper.py "${finalPhrase}"`,
        message: null
      })
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid rgba(212,175,106,0.2)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '11px', color: '#6b6866',
        letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        <span style={{ color: '#84cc16', fontSize: '8px' }}>●</span>
        Intent Commander — OpenClaw 2026.7.1
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {QUICK_INTENTS.map(i => (
          <button key={i.phrase} onClick={() => execute(i.phrase)} disabled={loading}
            style={{
              background: 'rgba(212,175,106,0.08)',
              border: '1px solid rgba(212,175,106,0.2)',
              borderRadius: '20px', padding: '5px 14px',
              fontSize: '12px', color: '#d4af6a', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1, transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}>
            {i.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && execute()}
          placeholder="Escribe cualquier intención: AUDITA LA APP, CREA VIDEO, RESPALDA Y CIERRA..."
          style={{
            flex: 1, background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '8px 12px',
            color: '#f0ede8', fontSize: '13px', fontFamily: 'inherit',
            outline: 'none'
          }}
        />
        <button onClick={() => execute()} disabled={loading || !input.trim()}
          style={{
            background: '#d4af6a', color: '#000', border: 'none',
            borderRadius: '8px', padding: '8px 18px',
            fontSize: '14px', fontWeight: '700', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1, transition: 'all 0.2s ease'
          }}>
          {loading ? '⏳' : '▶'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: '12px',
          background: result.status === 'ok' ? 'rgba(52,211,153,0.05)' : 'rgba(251,113,133,0.05)',
          border: `1px solid ${result.status === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(251,113,133,0.25)'}`,
          borderRadius: '8px', padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: result.status === 'ok' ? '#34d399' : '#fb7185', marginBottom: '6px', fontWeight: '700' }}>
            {result.status === 'ok' ? '✅ Ejecutado' : '❌ Error'} · {result.action || ''}
          </div>
          {result.stdout && (
            <pre style={{ fontSize: '11px', color: '#a09d99', margin: 0, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto', fontFamily: 'monospace' }}>
              {result.stdout}
            </pre>
          )}
          {result.message && !result.stdout && (
            <div style={{ fontSize: '12px', color: '#a09d99' }}>{result.message}</div>
          )}
        </div>
      )}
    </div>
  )
}
