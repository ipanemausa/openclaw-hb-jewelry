# 🎓 Guion Educativo Maestro — "7 Hacks de Claude AI para Tu Negocio en 2026"
## Adaptado para Guillermo AI · HB Jewelry & OpenClaw Enterprise

> **Tono:** Amigable, Profesional, Educativo, Convincente  
> **Formato:** Video HD 1080p (9:16 Shorts/Reels/TikTok y 16:9 YouTube)  
> **Motor:** `HB_JEWELRY_DIGITAL_HUMAN_VIDEO_ENGINE_v1.0`  
> **Voz:** Gemini Live 24kHz / Audio Ducking -20dB (Español Neutro / Inglés)

---

## 🎬 Estructura del Video por Nodos y Marcas de Tiempo

```mermaid
timeline
    title Estructura del Video Educativo (3 minutos)
    00:00 - 00:20 : 🚀 Gancho de Valor (La Revolución de Claude)
    00:20 - 01:00 : 💡 Hacks 1 a 3 (Procesamiento Masivo y Prototipado)
    01:00 - 01:40 : ⚡ Hacks 4 a 5 (Loops Autónomos y Conexión RAG)
    01:40 - 02:20 : 💎 Hacks 6 a 7 (Automatización Comercial HB Jewelry)
    02:20 - 02:40 : 🏁 Conclusión y Llamado a la Acción (CTA)
```

---

## 📜 Guion Técnico Completo (Speech + Visual Layer Prompts)

### Escena 1: Introducción y Gancho (00:00 - 00:20)
- **Voz de Guillermo AI:**  
  > *"¡Hola a todos! La inteligencia artificial no es solo una moda, es la herramienta de productividad más potente del siglo XXI. Mientras muchos siguen atrapados en los chats tradicionales, en OpenClaw y HB Jewelry hemos descubierto que **Claude** ha dado un salto gigante, superando a cualquier otro modelo en razonamiento y automatización. Hoy quiero enseñarte **7 Hacks de Claude** que transformarán la manera en que trabajas y vendes en 2026. ¡Vamos a verlo!"*
- **Capa Visual / Overlay:**
  - **Fondo:** Estudio cálido 3200K de Guillermo con espaldar de silla ejecutiva.
  - **Subtítulos:** Estilo activo en oro `#fbbf24` con borde negro.
  - **Gráfico:** Logo animado de Claude + HB Jewelry 18k.

---

### Escena 2: Hacks 1 al 3 — Razonamiento y Prototipado Rápido (00:20 - 01:00)
- **Voz de Guillermo AI:**  
  > *"**Hack 1: Análisis Masivo de Datos.** Claude procesa documentos extensos, inventarios y catálogos completos sin perder el contexto.  
  > **Hack 2: Prototipado de Interfaces en Segundos.** Con Claude Artifacts, puedes generar tableros de control y tiendas web interactivas al instante.  
  > **Hack 3: Redacción Comercial Persuasiva.** Convierte fichas técnicas en historias emocionales que conectan con tus clientes de lujo."*
- **Capa Visual / Overlay:**
  - **Iconos:** 📊 Datos | 💻 Código Artifacts | ✍️ Storytelling.
  - **Waveform:** Barra de sonido dinámica en el borde inferior.

---

### Escena 3: Hacks 4 al 5 — Loops Autónomos y RAG Vectorial (01:00 - 01:40)
- **Voz de Guillermo AI:**  
  > *"**Hack 4: Ejecución de Loops Autónomos.** Olvídate de escribir prompt tras prompt. Claude puede ejecutar secuencias completas de código y pruebas por sí solo.  
  > **Hack 5: Conexión Directa con Tu Base RAG.** Al integrar Claude con nuestra base vectorial de 768 dimensiones en Firebase, el asistente responde preguntas sobre precios y certificados de oro con 100% de precisión matemática."*
- **Capa Visual / Overlay:**
  - **Esquema:** Diagrama vectorial 768-dim -> Firebase Firestore.

---

### Escena 4: Hacks 6 al 7 — Ecosistema Comercial y Avatares 3D (01:40 - 02:20)
- **Voz de Guillermo AI:**  
  > *"**Hack 6: Creación de Contenido Multilingüe.** Genera guiones educativos en español e inglés sin perder la identidad de tu marca.  
  > **Hack 7: Integración con Humano Digital.** Combinando Claude con nuestro motor de avatar 3D, transformas cada respuesta de texto en un video interactivo de alta calidad listo para TikTok, YouTube y redes sociales."*
- **Capa Visual / Overlay:**
  - **Asset:** Avatar 3D Guillermo con gesticulación de manos y micrófono boom.

---

### Escena 5: Cierre y Llamado a la Acción (02:20 - 02:40)
- **Voz de Guillermo AI:**  
  > *"La tecnología no reemplaza el talento humano, potencia nuestra capacidad de crear valor. Si quieres ver este ecosistema en acción, entra ahora a **hb-jewelry-app.web.app** y prueba nuestra experiencia digital. ¡Suscríbete y nos vemos en la próxima lección!"*
- **Capa Visual / Overlay:**
  - **CTA Final:** URL `https://hb-jewelry-app.web.app/` en texto dorado brillante.

---

## ⚙️ Configuración del Renderizador en `HB_JEWELRY_DIGITAL_HUMAN_VIDEO_ENGINE_v1.0`

```json
{
  "project_id": "claude_hacks_educational_v1",
  "avatar": "guillermo_ai_master_official",
  "audio": {
    "engine": "Gemini Live 24kHz / ElevenLabs Professional",
    "language": "es-MX",
    "loudness_target_lufs": -14.0,
    "music_ducking_db": -20.0
  },
  "motion": {
    "facial_engine": "NVIDIA Audio2Face + LivePortrait",
    "body_engine": "EchoMimic Pose Transfer",
    "blendshapes_profile": "ARKit_52_Default"
  },
  "composition": {
    "resolution": "1080x1920",
    "fps": 30,
    "subtitle_style": {
      "font": "Outfit-Bold",
      "size": 42,
      "color": "#FFFFFF",
      "active_word_color": "#FBBF24",
      "stroke": "2px #000000",
      "shadow": "0px 4px 12px rgba(0,0,0,0.8)"
    }
  }
}
```
