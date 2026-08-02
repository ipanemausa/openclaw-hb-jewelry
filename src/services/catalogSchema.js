/**
 * ============================================================
 *  catalogSchema.js — HBJewelry Unified Product Schema
 *  OpenClaw 2026.7.1
 *
 *  Esquema maestro para productos de joyería con:
 *  - Metadatos específicos de joyería (quilates, gemas, metal)
 *  - Mapeo hacia Shopify, WooCommerce y Stripe
 *  - Validación integrada
 *  - Vectorización para RAG
 * ============================================================
 */

// ─── Constantes de dominio ────────────────────────────────────────────────────

export const METAL_TYPES = ['Oro', 'Plata', 'Platino', 'Titanio', 'Acero quirúrgico']
export const METAL_QUILATES = [9, 10, 14, 18, 22, 24, 925, 950]
export const GEM_TYPES = ['Diamante', 'Esmeralda', 'Rubí', 'Zafiro', 'Perla', 'Ópalo', 'Amatista', 'Topacio', 'Sin gema']
export const GEM_CLARITY = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']
export const GEM_COLOR_DIAMOND = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
export const CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Aretes', 'Broches', 'Relojes', 'Sets']
export const RING_SIZES_MM = [14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 21, 22]
export const RING_SIZES_US = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12]
export const FINISHES = ['Pulido', 'Mate', 'Satinado', 'Martillado', 'Grabado', 'Rhodiado']
export const CERTIFICATIONS = ['GIA', 'AGS', 'IGI', 'EGL', 'HRD', 'Sin certificado']

// ─── Schema de Producto Base ──────────────────────────────────────────────────

/**
 * Crea un producto de joyería con el esquema unificado HBJewelry.
 * Compatible con Shopify, WooCommerce y Stripe Price API.
 */
export function createProduct(data = {}) {
  return {
    // ── Identificación ──────────────────────────────────────
    sku:         data.sku         || '',
    nombre:      data.nombre      || '',
    descripcion: data.descripcion || '',
    categoria:   data.categoria   || '',
    subcategoria:data.subcategoria || '',
    coleccion:   data.coleccion   || '',
    marca:       data.marca       || 'HB Jewelry',

    // ── Metadatos específicos de joyería ────────────────────
    metal: {
      tipo:         data.metal?.tipo       || 'Oro',
      quilates:     data.metal?.quilates   || 18,
      descripcion:  data.metal?.descripcion || '',         // ej: "Oro amarillo 18K"
      peso_gramos:  data.metal?.peso_gramos || 0,
      certificado:  data.metal?.certificado || '',
    },

    gemas: (data.gemas || []).map(g => ({
      tipo:         g.tipo        || 'Sin gema',
      quilates_ct:  g.quilates_ct || 0,                   // peso en quilates (ct)
      claridad:     g.claridad    || '',                   // FL → I3
      color:        g.color       || '',                   // D → M (diamantes) / descripción (color)
      corte:        g.corte       || '',                   // Brillante, Esmeralda, Oval, etc.
      origen:       g.origen      || '',                   // Colombia, Sudáfrica, etc.
      certificado:  g.certificado || '',                   // GIA-XXXX
      cantidad:     g.cantidad    || 1,
    })),

    // ── Variantes (tallas, metales, acabados) ────────────────
    variantes: (data.variantes || []).map(v => ({
      id:           v.id           || '',
      talla_mm:     v.talla_mm     || null,               // para anillos
      talla_us:     v.talla_us     || null,               // para anillos
      talla_cm:     v.talla_cm     || null,               // para pulseras/collares
      metal_alt:    v.metal_alt    || null,               // variante de metal
      acabado:      v.acabado      || 'Pulido',
      stock:        v.stock        ?? 0,
      stock_min:    v.stock_min    ?? 3,
      precio_usd:   v.precio_usd   || 0,
      precio_cop:   v.precio_cop   || 0,
      costo_usd:    v.costo_usd    || 0,
      shopify_variant_id:     v.shopify_variant_id     || null,
      woocommerce_variation_id: v.woocommerce_variation_id || null,
      stripe_price_id:        v.stripe_price_id        || null,
      barcode:      v.barcode      || '',
      imagen_url:   v.imagen_url   || '',
    })),

    // ── Personalización ──────────────────────────────────────
    personalizable:     data.personalizable     ?? false,
    opciones_grabado:   data.opciones_grabado   || [],    // ['inicial','fecha','frase_corta']
    tiempo_produccion_dias: data.tiempo_produccion_dias || 0,

    // ── Imágenes ─────────────────────────────────────────────
    imagenes: (data.imagenes || []).map(img => ({
      url:       img.url       || '',
      alt:       img.alt       || '',
      tipo:      img.tipo      || 'principal',           // principal, detalle, 360, modelo
      orden:     img.orden     || 0,
    })),

    // ── Precios base (sin variantes) ─────────────────────────
    precio_base_usd:  data.precio_base_usd  || 0,
    precio_base_cop:  data.precio_base_cop  || 0,
    costo_base_usd:   data.costo_base_usd   || 0,
    iva_aplicable:    data.iva_aplicable    ?? true,
    tasa_iva:         data.tasa_iva         || 0.19,     // 19% Colombia

    // ── Inventario ───────────────────────────────────────────
    stock_total:    data.stock_total    ?? 0,
    stock_min:      data.stock_min      ?? 3,
    proveedor:      data.proveedor      || '',
    tiempo_reorden_dias: data.tiempo_reorden_dias || 15,

    // ── SEO ──────────────────────────────────────────────────
    seo: {
      titulo:      data.seo?.titulo      || data.nombre || '',
      descripcion: data.seo?.descripcion || '',
      slug:        data.seo?.slug        || slugify(data.nombre || ''),
      tags:        data.seo?.tags        || [],
    },

    // ── IDs de plataformas externas ──────────────────────────
    shopify_product_id:     data.shopify_product_id     || null,
    woocommerce_product_id: data.woocommerce_product_id || null,
    amazon_asin:            data.amazon_asin            || null,

    // ── Estado ───────────────────────────────────────────────
    estado:      data.estado    || 'activo',            // activo, inactivo, borrador, descontinuado
    publicado:   data.publicado ?? false,
    destacado:   data.destacado ?? false,

    // ── Metadata ─────────────────────────────────────────────
    created_at:  data.created_at  || new Date().toISOString(),
    updated_at:  new Date().toISOString(),
    created_by:  data.created_by  || 'system',
  }
}

// ─── Validación ───────────────────────────────────────────────────────────────

export function validateProduct(product) {
  const errors = []

  if (!product.sku)          errors.push('SKU es requerido')
  if (!product.nombre)       errors.push('Nombre es requerido')
  if (!product.categoria)    errors.push('Categoría es requerida')
  if (!CATEGORIES.includes(product.categoria))
    errors.push(`Categoría '${product.categoria}' inválida. Opciones: ${CATEGORIES.join(', ')}`)
  if (!METAL_TYPES.includes(product.metal?.tipo))
    errors.push(`Metal '${product.metal?.tipo}' inválido`)
  if (product.precio_base_usd <= 0)
    errors.push('Precio base USD debe ser mayor a 0')

  for (const gema of (product.gemas || [])) {
    if (!GEM_TYPES.includes(gema.tipo))
      errors.push(`Gema '${gema.tipo}' inválida`)
    if (gema.tipo === 'Diamante' && gema.claridad && !GEM_CLARITY.includes(gema.claridad))
      errors.push(`Claridad '${gema.claridad}' inválida para diamante`)
  }

  return { valid: errors.length === 0, errors }
}

// ─── Mapeo → Shopify ──────────────────────────────────────────────────────────

export function toShopifyProduct(product) {
  const metalDesc = `${product.metal.tipo} ${product.metal.quilates}K`
  const gemsDesc  = product.gemas.map(g => `${g.tipo} ${g.quilates_ct}ct`).join(', ')

  return {
    product: {
      title:        product.nombre,
      body_html:    buildHTMLDescription(product),
      vendor:       product.marca,
      product_type: product.categoria,
      tags:         [...(product.seo.tags || []), metalDesc, ...product.gemas.map(g => g.tipo)].join(','),
      status:       product.publicado ? 'active' : 'draft',
      variants: product.variantes.map(v => ({
        sku:              `${product.sku}-${v.id}`,
        price:            v.precio_usd.toFixed(2),
        compare_at_price: null,
        inventory_management: 'shopify',
        inventory_quantity:   v.stock,
        weight:               product.metal.peso_gramos,
        weight_unit:          'g',
        option1:  v.talla_mm ? `${v.talla_mm}mm` : v.acabado,
        option2:  v.metal_alt || null,
        barcode:  v.barcode || null,
      })),
      images: product.imagenes.map(img => ({
        src: img.url,
        alt: img.alt || product.nombre,
      })),
      options: buildShopifyOptions(product),
    }
  }
}

// ─── Mapeo → WooCommerce ──────────────────────────────────────────────────────

export function toWooCommerceProduct(product) {
  return {
    name:         product.nombre,
    type:         product.variantes.length > 1 ? 'variable' : 'simple',
    status:       product.publicado ? 'publish' : 'draft',
    description:  buildHTMLDescription(product),
    sku:          product.sku,
    regular_price: String(product.precio_base_usd),
    categories:   [{ name: product.categoria }],
    tags:         (product.seo.tags || []).map(t => ({ name: t })),
    images:       product.imagenes.map(img => ({ src: img.url, alt: img.alt })),
    manage_stock: true,
    stock_quantity: product.stock_total,
    attributes: [
      { name: 'Metal',   visible: true, options: [`${product.metal.tipo} ${product.metal.quilates}K`] },
      { name: 'Acabado', visible: true, options: [...new Set(product.variantes.map(v => v.acabado))] },
      ...(product.gemas.length > 0 ? [{
        name: 'Gemas', visible: true,
        options: product.gemas.map(g => `${g.tipo} ${g.quilates_ct}ct`)
      }] : []),
    ],
    variations: product.variantes.map(v => ({
      sku:           `${product.sku}-${v.id}`,
      regular_price: String(v.precio_usd),
      stock_quantity: v.stock,
      attributes: [
        ...(v.talla_mm ? [{ name: 'Talla', option: `${v.talla_mm}mm` }] : []),
        { name: 'Acabado', option: v.acabado },
      ],
    })),
    // Metadatos específicos de joyería (custom fields WC)
    meta_data: buildJewelryMeta(product),
  }
}

// ─── Mapeo → Stripe ───────────────────────────────────────────────────────────

export function toStripeProduct(product) {
  return {
    product: {
      name:        product.nombre,
      description: `${product.metal.tipo} ${product.metal.quilates}K · ${product.gemas.map(g => `${g.tipo} ${g.quilates_ct}ct`).join(', ')}`,
      images:      product.imagenes.slice(0, 1).map(i => i.url),
      metadata: {
        sku:         product.sku,
        categoria:   product.categoria,
        metal:       `${product.metal.tipo}-${product.metal.quilates}K`,
        hb_jewelry:  'true',
      },
    },
    prices: product.variantes.map(v => ({
      unit_amount:  Math.round(v.precio_usd * 100),       // Stripe usa centavos
      currency:     'usd',
      nickname:     v.id,
      metadata:     { variante_id: v.id, talla: v.talla_mm || '', sku: `${product.sku}-${v.id}` },
    })),
  }
}

// ─── Vector embedding text (para RAG) ────────────────────────────────────────

export function toEmbeddingText(product) {
  const gemsText = product.gemas.map(g =>
    `${g.tipo} ${g.quilates_ct} quilates claridad ${g.claridad} color ${g.color} origen ${g.origen}`
  ).join('. ')

  const variantesText = product.variantes.map(v =>
    `Talla ${v.talla_mm || v.talla_cm || ''}mm acabado ${v.acabado} precio USD $${v.precio_usd}`
  ).join('. ')

  return [
    product.nombre,
    product.descripcion,
    `Categoría: ${product.categoria}`,
    `Metal: ${product.metal.tipo} ${product.metal.quilates} quilates, ${product.metal.peso_gramos}g`,
    gemsText,
    variantesText,
    `Precio desde $${product.precio_base_usd} USD`,
    product.personalizable ? 'Personalizable con grabado' : '',
    `Colección: ${product.coleccion}`,
    (product.seo.tags || []).join(' '),
  ].filter(Boolean).join('. ')
}

// ─── Calcular métricas ────────────────────────────────────────────────────────

export function getProductMetrics(product) {
  const margen = product.precio_base_usd > 0
    ? ((product.precio_base_usd - product.costo_base_usd) / product.precio_base_usd * 100).toFixed(1)
    : 0

  const valorStock = product.variantes.reduce((sum, v) => sum + (v.stock * v.costo_usd), 0)
  const stockBajo  = product.variantes.some(v => v.stock < v.stock_min)
  const sinStock   = product.variantes.every(v => v.stock === 0)

  return {
    margen_pct:    parseFloat(margen),
    valor_stock_usd: valorStock,
    stock_bajo:    stockBajo,
    sin_stock:     sinStock,
    plataformas_sync: [
      product.shopify_product_id     ? 'Shopify' : null,
      product.woocommerce_product_id ? 'WooCommerce' : null,
    ].filter(Boolean),
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildHTMLDescription(product) {
  const gemsHtml = product.gemas.length > 0
    ? `<ul>${product.gemas.map(g =>
        `<li>${g.tipo} ${g.quilates_ct}ct | ${g.claridad} | ${g.color}${g.certificado ? ` | Cert. ${g.certificado}` : ''}</li>`
      ).join('')}</ul>`
    : ''

  return `
    <p>${product.descripcion}</p>
    <h4>Especificaciones</h4>
    <ul>
      <li><strong>Metal:</strong> ${product.metal.tipo} ${product.metal.quilates}K (${product.metal.peso_gramos}g)</li>
      ${product.gemas.length > 0 ? `<li><strong>Gemas:</strong></li>` : ''}
    </ul>
    ${gemsHtml}
    ${product.personalizable ? '<p>✦ Personalizable con grabado</p>' : ''}
  `.trim()
}

function buildJewelryMeta(product) {
  return [
    { key: '_hb_metal_tipo',     value: product.metal.tipo },
    { key: '_hb_metal_quilates', value: String(product.metal.quilates) },
    { key: '_hb_peso_gramos',    value: String(product.metal.peso_gramos) },
    { key: '_hb_personalizable', value: product.personalizable ? 'yes' : 'no' },
    { key: '_hb_tiempo_produccion', value: String(product.tiempo_produccion_dias) },
    ...product.gemas.map((g, i) => [
      { key: `_hb_gema_${i}_tipo`,     value: g.tipo },
      { key: `_hb_gema_${i}_ct`,       value: String(g.quilates_ct) },
      { key: `_hb_gema_${i}_claridad`, value: g.claridad },
      { key: `_hb_gema_${i}_cert`,     value: g.certificado },
    ]).flat(),
  ]
}

function buildShopifyOptions(product) {
  const options = []
  const hasTallas  = product.variantes.some(v => v.talla_mm || v.talla_us)
  const hasAcabado = product.variantes.some(v => v.acabado)
  const hasMetalAlt = product.variantes.some(v => v.metal_alt)

  if (hasTallas)   options.push({ name: 'Talla',   values: [...new Set(product.variantes.map(v => v.talla_mm ? `${v.talla_mm}mm` : v.talla_us ? `US ${v.talla_us}` : null).filter(Boolean))] })
  if (hasAcabado)  options.push({ name: 'Acabado', values: [...new Set(product.variantes.map(v => v.acabado).filter(Boolean))] })
  if (hasMetalAlt) options.push({ name: 'Metal',   values: [...new Set(product.variantes.map(v => v.metal_alt).filter(Boolean))] })

  return options
}

// ─── Catálogo demo HBJewelry ──────────────────────────────────────────────────

export const DEMO_CATALOG = [
  createProduct({
    sku: 'ANI-001', nombre: 'Anillo Solitario Diamante', categoria: 'Anillos',
    coleccion: 'Eternidad', descripcion: 'Anillo de compromiso en oro 18K con diamante certificado GIA.',
    metal: { tipo: 'Oro', quilates: 18, peso_gramos: 3.2, descripcion: 'Oro amarillo 18K' },
    gemas: [{ tipo: 'Diamante', quilates_ct: 0.5, claridad: 'VS1', color: 'F', corte: 'Brillante redondo', certificado: 'GIA-2024-001', cantidad: 1 }],
    variantes: [
      { id: 'ANI-001-16', talla_mm: 16, talla_us: 5.5, acabado: 'Pulido', stock: 3, stock_min: 2, precio_usd: 850, precio_cop: 3400000, costo_usd: 420 },
      { id: 'ANI-001-17', talla_mm: 17, talla_us: 6.5, acabado: 'Pulido', stock: 5, stock_min: 2, precio_usd: 850, precio_cop: 3400000, costo_usd: 420 },
      { id: 'ANI-001-18', talla_mm: 18, talla_us: 7.5, acabado: 'Pulido', stock: 2, stock_min: 2, precio_usd: 850, precio_cop: 3400000, costo_usd: 420 },
    ],
    personalizable: true, opciones_grabado: ['inicial', 'fecha', 'frase_corta'],
    precio_base_usd: 850, costo_base_usd: 420,
    seo: { titulo: 'Anillo Solitario Diamante 0.5ct Oro 18K', tags: ['anillo', 'compromiso', 'diamante', 'oro'] },
    publicado: true, destacado: true, proveedor: 'Gemas Import',
  }),
  createProduct({
    sku: 'COL-002', nombre: 'Collar Esmeralda Colombia', categoria: 'Collares',
    coleccion: 'Muzo', descripcion: 'Collar en oro 18K con esmeralda colombiana certificada.',
    metal: { tipo: 'Oro', quilates: 18, peso_gramos: 5.1 },
    gemas: [{ tipo: 'Esmeralda', quilates_ct: 1.2, claridad: 'VS2', color: 'Verde intenso', origen: 'Colombia', certificado: 'GIA-2024-045', cantidad: 1 }],
    variantes: [
      { id: 'COL-002-42', talla_cm: 42, acabado: 'Pulido', stock: 2, stock_min: 1, precio_usd: 1800, precio_cop: 7200000, costo_usd: 880 },
      { id: 'COL-002-45', talla_cm: 45, acabado: 'Pulido', stock: 3, stock_min: 1, precio_usd: 1800, precio_cop: 7200000, costo_usd: 880 },
    ],
    precio_base_usd: 1800, costo_base_usd: 880,
    seo: { titulo: 'Collar Esmeralda Colombiana Certificada Oro 18K', tags: ['collar', 'esmeralda', 'colombia', 'certificada'] },
    publicado: true, proveedor: 'Muzo Gems',
  }),
]
