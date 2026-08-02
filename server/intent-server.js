/**
 * ================================================================
 *  OPENCLAW LOCAL INTENT SERVER â€” 2026.7.1
 * ================================================================
 *  Puerto: 3001
 *  POST /api/hb/intent      â†’ ejecuta scripts Python/PowerShell
 *  GET  /api/hb/logs/stream â†’ SSE stream de logs en tiempo real
 *  GET  /health             â†’ estado del servidor
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

// â”€â”€â”€ Log bus (en memoria, mÃ¡x 500 lÃ­neas) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ SSE endpoint (Terminal de la app se suscribe aquÃ­) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/hb/logs/stream', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection',    'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  // Enviar Ãºltimos 50 logs al conectar
  const recent = LOG_BUS.slice(-50)
  for (const entry of recent) {
    res.write(`data: ${JSON.stringify(entry)}\n\n`)
  }
  res.write(`data: ${JSON.stringify({ id: Date.now(), ts: new Date().toLocaleTimeString(), level: 'SYSTEM', source: 'intent-server', msg: 'ðŸ”— Terminal conectada â€” streaming activo' })}\n\n`)

  SSE_CLIENTS.add(res)
  req.on('close', () => SSE_CLIENTS.delete(res))
})

// â”€â”€â”€ Rutas absolutas a scripts Python / PowerShell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SCRIPTS = {
  audit:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\run_app_autonomic_audit.py',       type: 'python' },
  video:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\generate_real_voice_fm_master.py', type: 'python' },
  backup_close: { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\pipeline-cierre.ps1',              type: 'pwsh'   },
  cadence:      { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\cadence_seo_engine.py',            type: 'python' },
  broll:        { path: 'C:\\Users\\ipane\\openclaw-operativo-2026\\scripts\\broll_scheduler.py',               type: 'python' },
}

// â”€â”€â”€ Mapeo de frases â†’ acciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Ejecutor con streaming de stdout â†’ SSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function runScript(action, phrase) {
  return new Promise((resolve) => {
    if (action === 'status') {
      const msg = `Sistema OpenClaw 2026.7.1 | Firebase: https://hb-jewelry-cloud-2026-2dff9.web.app | Scripts: ${Object.keys(SCRIPTS).length} disponibles | Server: localhost:${PORT} activo`
      emit('SUCCESS', 'sistema', msg)
      resolve({ status: 'ok', action, stdout: msg, stderr: '' })
      return
    }

    if (action === 'unknown') {
      emit('WARN', 'intent', `IntenciÃ³n no reconocida: "${phrase}"`)
      resolve({ status: 'error', action, stdout: '', stderr: `IntenciÃ³n no reconocida: "${phrase}"` })
      return
    }

    const script = SCRIPTS[action]
    emit('INFO', 'intent', `â–¶ Ejecutando: ${action} â†’ ${path.basename(script.path)}`)

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
      emit('WARN', 'intent', `â± Timeout 15s â†’ ${action} continÃºa en background`)
      resolve({ status: 'ok', action, stdout: stdoutBuf.trim(), stderr: '' })
    }, 15000)

    proc.on('close', (code) => {
      clearTimeout(timeout)
      const level = code === 0 ? 'SUCCESS' : 'ERROR'
      emit(level, action, `${code === 0 ? 'âœ…' : 'âŒ'} ${path.basename(script.path)} â†’ exit ${code}`)
      resolve({ status: code === 0 ? 'ok' : 'error', action, stdout: stdoutBuf.trim(), stderr: stderrBuf.trim() })
    })
    proc.on('error', (err) => {
      clearTimeout(timeout)
      emit('ERROR', action, `spawn error: ${err.message}`)
      resolve({ status: 'error', action, stdout: '', stderr: err.message })
    })
  })
}

// â”€â”€â”€ Endpoint principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post('/api/hb/intent', async (req, res) => {
  const phrase = (req.body?.phrase || '').trim()
  if (!phrase) return res.status(400).json({ status: 'error', message: 'phrase requerida' })

  const action = detectAction(phrase)
  emit('SYSTEM', 'intent', `"${phrase}" â†’ ${action}`)
  const result = await runScript(action, phrase)
  res.json(result)
})

// â”€â”€â”€ Health â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'openclaw-intent-server', version: '2026.7.1', port: PORT, sseClients: SSE_CLIENTS.size })
})

// â”€â”€â”€ Logs recientes (REST fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get('/api/hb/logs', (_req, res) => {
  res.json({ logs: LOG_BUS.slice(-100) })
})

// â”€â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// E-COMMERCE WEBHOOKS - HBJewelry 2026
function broadcastEvent(type, data) {
  const payload = JSON.stringify({ type, data, ts: new Date().toISOString() })
  const msg = `data: ${payload}\n\n`
  SSE_CLIENTS.forEach(client => { try { client.write(msg) } catch (_) {} })
}

app.post('/webhooks/shopify/order_created', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const order = JSON.parse(req.body)
    const customer = `\ \`
    emit('ECOMMERCE', 'shopify', `Nueva orden #\ - \ - \$\`)
    broadcastEvent('order_new', { source: 'shopify', order_id: String(order.id), total: order.total_price, customer })
    res.status(200).json({ ok: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.post('/webhooks/shopify/order_paid', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const order = JSON.parse(req.body)
    emit('ECOMMERCE', 'shopify', `Pago Shopify #\ - \$\`)
    broadcastEvent('order_paid', { source: 'shopify', order_id: String(order.id), total: order.total_price })
    res.status(200).json({ ok: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.post('/webhooks/shopify/inventory_update', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const inv = JSON.parse(req.body)
    emit('ECOMMERCE', 'shopify', `Stock Shopify item \: \`)
    broadcastEvent('inventory_update', { source: 'shopify', item_id: inv.inventory_item_id, qty: inv.available })
    res.status(200).json({ ok: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.post('/webhooks/woocommerce/order', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const order = JSON.parse(req.body)
    const customer = `\ \`
    emit('ECOMMERCE', 'woocommerce', `WooCommerce orden #\ - \ - \$\`)
    broadcastEvent('order_new', { source: 'woocommerce', order_id: String(order.id), total: order.total, customer })
    res.status(200).json({ ok: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.post('/webhooks/stripe/payment', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const event = JSON.parse(req.body)
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object
      emit('ECOMMERCE', 'stripe', `Stripe OK \$\ \ \`)
      broadcastEvent('payment_confirmed', { amount_usd: pi.amount/100, currency: pi.currency, payment_id: pi.id })
    }
    res.status(200).json({ received: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.post('/api/ecommerce/sync', (req, res) => {
  const { platform, sku } = req.body
  emit('ECOMMERCE', 'sync', `Sync \ SKU:\`)
  res.json({ status: 'queued', platform, sku, ts: new Date().toISOString() })
})

app.get('/api/ecommerce/status', (_req, res) => {
  res.json({ shopify: !!(process.env.SHOPIFY_ACCESS_TOKEN), woocommerce: !!(process.env.WC_CONSUMER_KEY), stripe: !!(process.env.STRIPE_SECRET_KEY) })
})

app.listen(PORT, () => {
  emit('SYSTEM', 'intent-server', `âœ… OpenClaw Intent Server â†’ http://localhost:${PORT}`)
  emit('SYSTEM', 'intent-server', `   POST /api/hb/intent       â†’ ejecuta scripts`)
  emit('SYSTEM', 'intent-server', `   GET  /api/hb/logs/stream  â†’ SSE streaming activo`)
})
