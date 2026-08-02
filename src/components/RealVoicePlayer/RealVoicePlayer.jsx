import React, { useRef, useState, useEffect, useCallback } from 'react'
import BRollOverlay from '../BRollOverlay/BRollOverlay'

const VIDEO_SRC = '/videos/real_voice_master/guillermo_real_voice_master.mp4'

export default function RealVoicePlayer({ onClose }) {
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [schedule, setSchedule] = useState([])
  const [activeIdx, setActiveIdx] = useState(null)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef(null)

  // Cargar schedule
  useEffect(() => {
    fetch('/broll_schedule.json')
      .then(r => r.json())
      .then(d => setSchedule(d.events || []))
      .catch(() => {})
  }, [])

  // Ocultar controles tras 3s de inactividad
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => playing && setShowControls(false), 3000)
  }, [playing])

  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime || 0
    setCurrentTime(t)
    const idx = schedule.findIndex(ev => t >= ev.start_time && t <= ev.end_time)
    setActiveIdx(idx >= 0 ? idx : null)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
    resetHideTimer()
  }

  const seek = (e) => {
    if (!videoRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pct * duration
  }

  const progress = duration ? (currentTime / duration) * 100 : 0
  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  const activeEvent = activeIdx !== null ? schedule[activeIdx] : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }} onMouseMove={resetHideTimer}>

      {/* ─── HEADER ─── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#d4af6a', fontWeight: 700, fontSize: 13 }}>
            🎬 OpenClaw 2026.7.1 — Voz Real FM Broadcast
          </span>
          <span style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.4)',
            color: '#84cc16', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
            48kHz · EBU R128 · -14 LUFS
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: 20, cursor: 'pointer', padding: '4px 8px', lineHeight: 1
          }}>✕</button>
        )}
      </div>

      {/* ─── VIDEO CONTAINER ─── */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '960px', aspectRatio: '16/9' }}
           onClick={togglePlay}>
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* B-Roll Overlay */}
        {activeEvent && (
          <div style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(15,23,42,0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(132,204,22,0.45)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            borderRadius: '12px', padding: '12px 18px',
            display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'brollIn 0.35s cubic-bezier(0.22,0.61,0.36,1)'
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%',
              background: '#84cc16', boxShadow: '0 0 12px #84cc16',
              animation: 'pulse 1.5s infinite' }} />
            <div>
              <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase',
                letterSpacing: '.12em', marginBottom: 3 }}>B-Roll Infográfico</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                {activeEvent.label}
              </div>
            </div>
          </div>
        )}

        {/* Play/Pause center icon */}
        {!playing && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(212,175,106,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, paddingLeft: 5, boxShadow: '0 4px 30px rgba(212,175,106,0.4)'
            }}>▶</div>
          </div>
        )}
      </div>

      {/* ─── CONTROLES ─── */}
      <div style={{
        width: '100%', maxWidth: '960px', padding: '16px 0',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.3s ease'
      }}>
        {/* Progress bar */}
        <div onClick={seek} style={{
          height: 4, background: 'rgba(255,255,255,0.1)',
          borderRadius: 4, cursor: 'pointer', marginBottom: 14, position: 'relative'
        }}>
          {/* B-Roll markers */}
          {schedule.map((ev, i) => (
            <div key={i} style={{
              position: 'absolute', top: -2, height: 8, width: 3, borderRadius: 2,
              background: 'rgba(132,204,22,0.8)',
              left: `${(ev.start_time / duration) * 100}%`
            }} title={ev.label} />
          ))}
          <div style={{ height: '100%', width: `${progress}%`, background: '#d4af6a', borderRadius: 4, transition: 'width 0.1s linear' }} />
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={togglePlay} style={{
            background: 'none', border: 'none', color: '#f1f5f9', fontSize: 22,
            cursor: 'pointer', padding: 0, lineHeight: 1
          }}>
            {playing ? '⏸' : '▶'}
          </button>

          <span style={{ fontSize: 12, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>🔊</span>
            <input type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e => {
                const v = parseFloat(e.target.value)
                setVolume(v)
                if (videoRef.current) videoRef.current.volume = v
              }}
              style={{ width: 80, accentColor: '#d4af6a' }}
            />
          </div>

          {/* B-Roll legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#84cc16' }} />
            {schedule.length} eventos B-Roll
          </div>
        </div>
      </div>

      <style>{`
        @keyframes brollIn {
          from { opacity: 0; transform: translateX(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
