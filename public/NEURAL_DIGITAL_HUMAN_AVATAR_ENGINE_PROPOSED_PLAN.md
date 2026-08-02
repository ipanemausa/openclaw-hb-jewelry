# 🧠 Plan Maestro de Síntesis Neuronal Real para Avatar Guillermo AI 2026

> **Diagnóstico del Usuario (100% Certero):**  
> *"EL AVATAR SE MUEVE COMO SI ESTUVIERA FLOTANDO, PERO SE MUEVE COMO LA FOTO, NO MOVIMIENTOS CORPORALES REALES."*

---

## 🔍 Análisis Técnico del Problema (Por qué la Foto Flotaba)

```mermaid
graph TD
  A[❌ Método Anterior: Pillow 2D Offset] --> B[Transformación de Imagen Estática PNG]
  B --> C[Efecto 'Foto Flotante / Cartón']
  
  D[🚀 Nuevo Método: Síntesis Neuronal V2V] --> E[PyTorch CUDA / LivePortrait / Wav2Lip / Google Veo]
  E --> F[Deformación Neuronal de Músculos Faciales, Labios y Hombros en MP4 Real]
```

### Causas Fundamentales Identificadas en el Código:

1. **Transformación 2D Affine (PIL/Pillow)**:
   - Rotar o desplazar una foto PNG sobre el lienzo genera un movimiento rígido de "cartón o recorte flotante". No hay contracción de músculos faciales, gesticulación real de cejas ni articulación anatómica.

2. **Rutas Estáticas Hardcodeadas**:
   - Los archivos `digitalHumanEngine.js` y `humanDigitalEngine.js` retornaban respuestas simuladas apuntando a `/output_avatar_english_7qa.mp4`.

---

## 🏗️ Nueva Arquitectura de Síntesis Neuronal Real (OpenClaw 2026.7.1)

```mermaid
flowchart TD
  subgraph Entrada [1. Audio Master & Avatar Base]
    AUDIO[Voz Real Clonada\nshowcase_voice.mp3]
    AVATAR[Foto/Video Semilla de Guillermo\nstudio_mic.png / Video Base]
  end

  subgraph Motor Neuronal PyTorch CUDA [2. Video-to-Video Engine]
    WAV2LIP[Wav2Lip / LivePortrait CUDA]
    VEO[Google Veo AI Studio Video API]
    FLOW[768-dim Motion Latent Vectors]
  end

  subgraph Compositor 1080p HD [3. Capa de Salida]
    CANVAS[Lienzo 1080p con Subtítulos Continuos]
    MP4[Video Final MP4 con Movimiento Facial & Labial Real]
  end

  AUDIO --> WAV2LIP
  AVATAR --> WAV2LIP
  AUDIO --> VEO
  AVATAR --> VEO
  WAV2LIP --> FLOW
  VEO --> FLOW
  FLOW --> CANVAS
  CANVAS --> MP4
```

---

## 📋 Hitos de Implementación por Fases

### Fase 1: Refactorización de Servicios Frontend (`digitalHumanEngine.js` & `humanDigitalEngine.js`)
- [ ] Eliminar los retornos hardcodeados de `/output_avatar_english_7qa.mp4`.
- [ ] Conectar las funciones `renderAvatarSpeechOutput()` y `processHumanDigitalPipeline()` a los endpoints reales del backend PyTorch / Docker Gordon (`/api/v2v/render` y `/api/digital-human/synthesize`).

### Fase 2: Integración de Motor Neuronal PyTorch CUDA / LivePortrait (`agents/video_agent/neural_avatar_renderer.py`)
- [ ] Implementar el pipeline de renderizado neuronal basado en **LivePortrait / Wav2Lip** sobre PyTorch CUDA.
- [ ] Generar fotogramas reales donde la boca de Guillermo se deforme según los fonemas del audio real (`showcase_voice.mp3`), y la cabeza/ojos gesticulen de forma anatómica sin efecto de foto flotante.

### Fase 3: Conexión con Google Veo Video Generation API
- [ ] Configurar el trabajador `video_veo_worker` en Docker Gordon para generar video continuo de Guillermo hablando (1080p 30fps).

### Fase 4: Despliegue en la Nube y Verificación de Video Real
- [ ] Compilar y desplegar el bundle actualizado en Firebase Hosting.
- [ ] Respaldar la suite completa en Google Drive 5TB vía Rclone.

---

*Plan técnico certificado por Antigravity AI IDE & Claude 4.6 Developer Assistant — 2026-07-31*
