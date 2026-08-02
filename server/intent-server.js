/**
 * ================================================================
 *  OPENCLAW LOCAL INTENT SERVER — 2026.7.1
 * ================================================================
 *  Puerto: 3001
 *  POST /api/hb/intent      → ejecuta scripts Python/PowerShell
 *  GET  /api/hb/logs/stream → SSE stream de logs en tiempo real
 *  GET  /health             → estado del servidor
 * ================================================================
 */
import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3001

// ─── Log bus (en memoria, máx 500 líneas) ────────────────────────────────────
const LOG_BUS    = []
const SSE_CLIENTS = new Set()

function emit(level, source, msg) {
  const entry = {
    id: Date.now() + Math.random(),
    ts: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    level,
    source,
    msg
  }
  LOG_BUS.push(entry)
  if (LOG_BUS.length > 500) LOG_BUS.shift()

  // Enviar a todos los clientes SSE conectados
  const data = `data: ${JSON.stringify(entry)}\n\n`
  for (const res of SSE_CLIENTS) {
    try { res.write(data) } catch (_) { SSE_CLIENTS.delete(res) }
  }
  console.log(`[${level}] [${source}] ${msg}`)
}

// ─── SSE endpoint (Terminal de la app se suscribe aquí) ──────────────────────
app.get('/api/hb/logs/stream', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection',    'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  // Enviar últimos 50 logs al conectar
  const recent = LOG_BUS.slice(-50)
  for (const entry of recent) {
    res.write(`data: ${JSON.stringify(entry)}\n\n`)
  }
  res.write(`data: ${JSON.stringify({ id: Date.now(), ts: new Date().toLocaleTimeString(), level: 'SYSTEM', source: 'intent-server', msg: '🔗 Terminal conectada — streaming activo' })}\n\n`)

  SSE_CLIENTS.add(res)
  req.on('close', () => SSE_CLIENTS.delete(res))
})

// ─── Rutas absolutas a scripts Python / PowerShell ───────────────────────────
const SCRIPTS = {
  audit:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\run_app_autonomic_audit.py',       type: 'python' },
  video:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\generate_real_voice_fm_master.py', type: 'python' },
  backup_close: { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\pipeline-cierre.ps1',              type: 'pwsh'   },
  cadence:      { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\cadence_seo_engine.py',            type: 'python' },
  broll:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\broll_scheduler.py',               type: 'python' },
}

// ─── Mapeo de frases → acciones ──────────────────────────────────────────────
function detectAction(phrase) {
  const p = phrase.toLowerCase()
  if (/audita|audit|revisa|chequea/.test(p))                  return 'audit'
  if (/video|graba|crea.*video|genera.*video/.test(p))         return 'video'
  if (/respalda|backup|cierre|commit|push|sync/.test(p))       return 'backup_close'
  if (/cadencia|cadence|seo|capitulos/.test(p))                return 'cadence'
  if (/broll|b-roll|b roll/.test(p))                           return 'broll'
  if (/estado|status|sistema/.test(p))                         return 'status'
  return 'unknown'
}

// ─── Ejecutor con streaming de stdout → SSE ──────────────────────────────────
function runScript(action, phrase) {
  return new Promise((resolve) => {
    if (action === 'status') {
      const msg = `Sistema OpenClaw 2026.7.1 | Firebase: https://hb-jewelry-cloud-2026-2dff9.web.app | Scripts: ${Object.keys(SCRIPTS).length} disponibles | Server: localhost:${PORT} activo`
      emit('SUCCESS', 'sistema', msg)
      resolve({ status: 'ok', action, stdout: msg, stderr: '' })
      return
    }

    if (action === 'unknown') {
      emit('WARN', 'intent', `Intención no reconocida: "${phrase}"`)
      resolve({ status: 'error', action, stdout: '', stderr: `Intención no reconocida: "${phrase}"` })
      return
    }

    const script = SCRIPTS[action]
    emit('INFO', 'intent', `▶ Ejecutando: ${action} → ${path.basename(script.path)}`)

    const cmd  = script.type === 'pwsh'   ? 'powershell' : 'python'
    const args = script.type === 'pwsh'
      ? ['-ExecutionPolicy', 'Bypass', '-File', script.path]
      : [script.path]

    const proc = spawn(cmd, args, {
      cwd: 'C:\\Users\\ipane\\openclaw-operativo-2026',
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    })

    let stdoutBuf = ''
    let stderrBuf = ''

    proc.stdout.on('data', (d) => {
      const lines = d.toString('utf8').split('\n').filter(l => l.trim())
      for (const line of lines) {
        emit('INFO', action, line.trim())
        stdoutBuf += line + '\n'
      }
    })
    proc.stderr.on('data', (d) => {
      const lines = d.toString('utf8').split('\n').filter(l => l.trim())
      for (const line of lines) {
        emit('WARN', action, line.trim())
        stderrBuf += line + '\n'
      }
    })

    const timeout = setTimeout(() => {
      emit('WARN', 'intent', `⏱ Timeout 15s → ${action} continúa en background`)
      resolve({ status: 'ok', action, stdout: stdoutBuf.trim(), stderr: '' })
    }, 15000)

    proc.on('close', (code) => {
      clearTimeout(timeout)
      const level = code === 0 ? 'SUCCESS' : 'ERROR'
      emit(level, action, `${code === 0 ? '✅' : '❌'} ${path.basename(script.path)} → exit ${code}`)
      resolve({ status: code === 0 ? 'ok' : 'error', action, stdout: stdoutBuf.trim(), stderr: stderrBuf.trim() })
    })
    proc.on('error', (err) => {
      clearTimeout(timeout)
      emit('ERROR', action, `spawn error: ${err.message}`)
      resolve({ status: 'error', action, stdout: '', stderr: err.message })
    })
  })
}

// ─── Endpoint principal ───────────────────────────────────────────────────────
app.post('/api/hb/intent', async (req, res) => {
  const phrase = (req.body?.phrase || '').trim()
  if (!phrase) return res.status(400).json({ status: 'error', message: 'phrase requerida' })

  const action = detectAction(phrase)
  emit('SYSTEM', 'intent', `"${phrase}" → ${action}`)
  const result = await runScript(action, phrase)
  res.json(result)
})

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'openclaw-intent-server', version: '2026.7.1', port: PORT, sseClients: SSE_CLIENTS.size })
})

// ─── Logs recientes (REST fallback) ──────────────────────────────────────────
app.get('/api/hb/logs', (_req, res) => {
  res.json({ logs: LOG_BUS.slice(-100) })
})

// ─── Init ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  emit('SYSTEM', 'intent-server', `✅ OpenClaw Intent Server → http://localhost:${PORT}`)
  emit('SYSTEM', 'intent-server', `   POST /api/hb/intent       → ejecuta scripts`)
  emit('SYSTEM', 'intent-server', `   GET  /api/hb/logs/stream  → SSE streaming activo`)
})
