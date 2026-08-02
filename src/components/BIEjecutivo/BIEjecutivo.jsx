import React, { useState } from 'react'

// ─── Datos consolidados ERP ───────────────────────────────────────────────────
const KPI = {
  ingresos:    { mes: 47200, anterior: 38500, meta: 55000 },
  gastos:      { mes: 18900, anterior: 17200, meta: 20000 },
  utilidad:    { mes: 28300, anterior: 21300, meta: 35000 },
  clientes:    { nuevos: 14, activos: 87, total: 231 },
  facturas:    { pendiente: 3850, vencida: 2400, cobrado: 41150 },
  inventario:  { valor: 38640, alertas: 3, rotacion: 4.2 },
  ventas:      { cerradas: 28, pipeline: 42000, tasa: 34 },
}

const MENSUAL = [
  { mes:'Feb', ingresos:31200, gastos:14800, utilidad:16400 },
  { mes:'Mar', ingresos:35600, gastos:16100, utilidad:19500 },
  { mes:'Apr', ingresos:29800, gastos:15400, utilidad:14400 },
  { mes:'May', ingresos:42100, gastos:17800, utilidad:24300 },
  { mes:'Jun', ingresos:38500, gastos:17200, utilidad:21300 },
  { mes:'Jul', ingresos:47200, gastos:18900, utilidad:28300 },
]

const TOP_PRODUCTOS = [
  { nombre:'Anillo Compromiso 1ct', ventas:8, ingresos:19200, margen:54 },
  { nombre:'Collar Diamante 0.5ct', ventas:12, ingresos:14400, margen:50 },
  { nombre:'Broche Esmeralda 18K',  ventas:4,  ingresos:7600,  margen:53 },
  { nombre:'Aretes Perla Natural',  ventas:14, ingresos:6300,  margen:60 },
  { nombre:'Collar Corazon Oro 14K',ventas:18, ingresos:6840,  margen:58 },
]

const ACTIVIDAD = [
  { ts:'Hoy 14:22', evento:'Factura FAC-0201 emitida', tipo:'factura',    monto:1300 },
  { ts:'Hoy 11:08', evento:'Pago recibido FAC-0200',   tipo:'pago',       monto:1200 },
  { ts:'Hoy 09:31', evento:'Alerta stock PUL-003 → 0', tipo:'alerta',     monto:null },
  { ts:'Ayer 16:45',evento:'Nuevo cliente Ana Rodríguez registrada', tipo:'cliente', monto:null },
  { ts:'Ayer 14:12',evento:'Venta VTA-0189 cerrada',   tipo:'venta',      monto:2400 },
  { ts:'Ayer 10:00',evento:'Entrada OC-0041: 5 ANI-001', tipo:'inventario', monto:null },
]

const tipoColor = { factura:'#d4af6a', pago:'#4ade80', alerta:'#fb7185', cliente:'#60a5fa', venta:'#a78bfa', inventario:'#fb923c' }
const tipoIcon  = { factura:'🧾', pago:'✅', alerta:'⚠', cliente:'👤', venta:'💰', inventario:'📦' }

const st = {
  page:  { display:'flex', flexDirection:'column', height:'100%', minHeight:0, gap:'16px', overflowY:'auto' },
  hdr:   { display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  title: { fontSize:'18px', fontWeight:'600', color:'#f0ede8' },
  sub:   { fontSize:'12px', color:'#6b6866', marginTop:'2px' },
  grid4: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  card:  { background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'16px' },
  lbl:   { fontSize:'11px', color:'#6b6866', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' },
  val:   (c) => ({ fontSize:'26px', fontWeight:'700', color: c || '#d4af6a', lineHeight:1.2 }),
  sub2:  { fontSize:'11px', color:'#6b6866', marginTop:'4px' },
  delta: (v) => ({ fontSize:'11px', color: v >= 0 ? '#4ade80' : '#fb7185', marginTop:'4px' }),
  row:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
  sec:   { fontSize:'13px', fontWeight:'600', color:'#a09d99', marginBottom:'10px' },
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.ingresos))
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'100px' }}>
      {data.map(d => (
        <div key={d.mes} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'2px', justifyContent:'flex-end', height:'80px' }}>
            <div style={{ background:'rgba(212,175,106,0.2)', borderRadius:'3px 3px 0 0', height:`${(d.ingresos/max)*80}px`, position:'relative' }}>
              <div style={{ background:'rgba(74,222,128,0.6)', borderRadius:'3px 3px 0 0', height:`${(d.utilidad/d.ingresos)*100}%`, position:'absolute', bottom:0, left:0, right:0 }} />
            </div>
          </div>
          <div style={{ fontSize:'9px', color:'#6b6866' }}>{d.mes}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ valor, meta, color }) {
  const pct = Math.min((valor / meta) * 100, 100).toFixed(0)
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#6b6866', marginBottom:'4px' }}>
        <span>${valor.toLocaleString()} / ${meta.toLocaleString()}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'2px', transition:'width 0.5s' }} />
      </div>
    </div>
  )
}

export default function BIEjecutivo() {
  const [periodo, setPeriodo] = useState('mes')
  const deltaUtil = ((KPI.utilidad.mes - KPI.utilidad.anterior) / KPI.utilidad.anterior * 100).toFixed(1)
  const deltaIng  = ((KPI.ingresos.mes - KPI.ingresos.anterior) / KPI.ingresos.anterior * 100).toFixed(1)

  return (
    <div style={st.page}>

      {/* Header */}
      <div style={st.hdr}>
        <div>
          <div style={st.title}>📊 BI Ejecutivo — OpenClaw ERP</div>
          <div style={st.sub}>Panel consolidado · Agosto 2026 · Actualizado: hace 2 min</div>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {['mes','trimestre','año'].map(p => (
            <button key={p} onClick={() => setPeriodo(p)} style={{
              padding:'5px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer', fontFamily:'inherit', border:'none',
              background: periodo===p ? 'rgba(212,175,106,0.15)' : 'transparent',
              color:      periodo===p ? '#d4af6a' : '#6b6866'
            }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* KPI Row 1 — Financiero */}
      <div style={st.grid4}>
        <div style={st.card}>
          <div style={st.lbl}>Ingresos</div>
          <div style={st.val()}>${KPI.ingresos.mes.toLocaleString()}</div>
          <div style={st.delta(deltaIng)}>↑ {deltaIng}% vs mes anterior</div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Utilidad neta</div>
          <div style={st.val('#4ade80')}>${KPI.utilidad.mes.toLocaleString()}</div>
          <div style={st.delta(deltaUtil)}>↑ {deltaUtil}% vs mes anterior</div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Gastos operativos</div>
          <div style={st.val('#fb923c')}>${KPI.gastos.mes.toLocaleString()}</div>
          <div style={st.sub2}>{((KPI.gastos.mes/KPI.ingresos.mes)*100).toFixed(0)}% de ingresos</div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Margen bruto</div>
          <div style={st.val('#a78bfa')}>{((KPI.utilidad.mes/KPI.ingresos.mes)*100).toFixed(0)}%</div>
          <div style={st.sub2}>Meta: {((KPI.utilidad.meta/KPI.ingresos.meta)*100).toFixed(0)}%</div>
        </div>
      </div>

      {/* KPI Row 2 — Operativo */}
      <div style={st.grid4}>
        <div style={st.card}>
          <div style={st.lbl}>Cuentas por cobrar</div>
          <div style={st.val('#fbbf24')}>${KPI.facturas.pendiente.toLocaleString()}</div>
          <div style={{ fontSize:'11px', color:'#fb7185', marginTop:'4px' }}>Vencido: ${KPI.facturas.vencida.toLocaleString()}</div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Valor inventario</div>
          <div style={st.val()}>${KPI.inventario.valor.toLocaleString()}</div>
          <div style={{ fontSize:'11px', color: KPI.inventario.alertas > 0 ? '#fb7185' : '#4ade80', marginTop:'4px' }}>
            {KPI.inventario.alertas} alertas de stock
          </div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Pipeline ventas</div>
          <div style={st.val('#60a5fa')}>${KPI.ventas.pipeline.toLocaleString()}</div>
          <div style={st.sub2}>{KPI.ventas.cerradas} cerradas · {KPI.ventas.tasa}% conv.</div>
        </div>
        <div style={st.card}>
          <div style={st.lbl}>Clientes activos</div>
          <div style={st.val()}>{KPI.clientes.activos}</div>
          <div style={{ fontSize:'11px', color:'#4ade80', marginTop:'4px' }}>+{KPI.clientes.nuevos} nuevos este mes</div>
        </div>
      </div>

      {/* Gráfico + Metas */}
      <div style={st.grid2}>
        <div style={st.card}>
          <div style={st.sec}>Evolución mensual</div>
          <div style={{ fontSize:'10px', display:'flex', gap:'12px', marginBottom:'10px' }}>
            <span style={{ color:'rgba(212,175,106,0.7)' }}>■ Ingresos</span>
            <span style={{ color:'rgba(74,222,128,0.7)' }}>■ Utilidad</span>
          </div>
          <BarChart data={MENSUAL} />
        </div>
        <div style={st.card}>
          <div style={st.sec}>Metas del mes</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <div style={{ fontSize:'12px', color:'#a09d99', marginBottom:'6px' }}>Ingresos</div>
              <ProgressBar valor={KPI.ingresos.mes} meta={KPI.ingresos.meta} color='#d4af6a' />
            </div>
            <div>
              <div style={{ fontSize:'12px', color:'#a09d99', marginBottom:'6px' }}>Utilidad</div>
              <ProgressBar valor={KPI.utilidad.mes} meta={KPI.utilidad.meta} color='#4ade80' />
            </div>
            <div>
              <div style={{ fontSize:'12px', color:'#a09d99', marginBottom:'6px' }}>Gastos (límite)</div>
              <ProgressBar valor={KPI.gastos.mes} meta={KPI.gastos.meta} color='#fb923c' />
            </div>
          </div>
        </div>
      </div>

      {/* Top Productos + Actividad */}
      <div style={st.grid2}>
        <div style={st.card}>
          <div style={st.sec}>Top Productos por Ingreso</div>
          {TOP_PRODUCTOS.map((p, i) => (
            <div key={p.nombre} style={st.row}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'11px', color:'#6b6866', width:'16px' }}>{i+1}</span>
                <div>
                  <div style={{ fontSize:'12px', color:'#c9c7c3' }}>{p.nombre}</div>
                  <div style={{ fontSize:'10px', color:'#6b6866' }}>{p.ventas} ventas · {p.margen}% margen</div>
                </div>
              </div>
              <div style={{ fontSize:'12px', fontWeight:'600', color:'#d4af6a' }}>${p.ingresos.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={st.card}>
          <div style={st.sec}>Actividad Reciente</div>
          {ACTIVIDAD.map((a, i) => (
            <div key={i} style={st.row}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'16px' }}>{tipoIcon[a.tipo]}</span>
                <div>
                  <div style={{ fontSize:'12px', color:'#c9c7c3' }}>{a.evento}</div>
                  <div style={{ fontSize:'10px', color:'#6b6866' }}>{a.ts}</div>
                </div>
              </div>
              {a.monto && <div style={{ fontSize:'12px', fontWeight:'600', color: tipoColor[a.tipo] }}>${a.monto.toLocaleString()}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
