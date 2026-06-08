# HB Jewelry — OpenClaw 2026

Sitio web oficial HB Jewelry. GitHub Pages desde `/docs`.

## Stack
- HTML/CSS/JS estático — cero dependencias
- GitHub Pages (branch: `main`, folder: `/docs`)
- OpenClaw Cloud 2026 — flujo de cotización vía agentes

## Estructura
```
hb-jewelry/
├── docs/               ← GitHub Pages sirve desde aquí
│   ├── index.html      ← Sitio principal
│   └── cotizacion.html ← Formulario de cotización
├── flows/
│   └── cotizacion.json ← Flujo OpenClaw (agente marketing)
└── README.md
```

## Deploy GitHub Pages
1. Push a `main`
2. Settings → Pages → Source: `main` branch, `/docs` folder
3. URL: `https://[usuario].github.io/openclaw-hb-jewelry`

## Flujo de cotización (OpenClaw)
Ver `flows/cotizacion.json` — agente `marketing` en gateway `:8080`.
