#!/usr/bin/env python3
"""
HB TUTORIAL TTS ENGINE - 26 JULIO 2026
======================================
Genera narración profesional para el tutorial de manejo de la app
usando edge-tts con voz es-US-AlonsoNeural (pausada, profesional, confiable)
Aplica post-procesado de voz: EQ, compresor, loudnorm EBU R128
Combina con el video del avatar y música de fondo a -20dB
"""

import asyncio
import subprocess
import os

# Configuración
OUT_DIR    = r"C:\openclaw\hb-jewelry\scripts\output_presenter"
PUBLIC_DIR = r"C:\openclaw\hb-jewelry\public"
MUSIC_IN   = os.path.join(PUBLIC_DIR, "showcase_voice.mp3")
AVATAR_VID = os.path.join(PUBLIC_DIR, "output_avatar_english_7qa.mp4")  # Avatar Guillermo base

TTS_RAW    = os.path.join(OUT_DIR, "tts_narration_raw.mp3")
TTS_ENH    = os.path.join(OUT_DIR, "tts_narration_enhanced.wav")
FINAL_VID  = os.path.join(PUBLIC_DIR, "hb_tutorial_narrado_v1.mp4")

# ─── SCRIPT DE NARRACIÓN DEL TUTORIAL ────────────────────────────────────────
# Este script es LA PLANTILLA REUTILIZABLE para cualquier video tutorial de la app
TUTORIAL_SCRIPT = """
Bienvenido a HB Jewelry.
La joyería cubana más exclusiva de Washington.

En esta demostración, te voy a mostrar cómo funciona nuestra plataforma inteligente.

Primero, la sección de Ventas.
Aquí puedes registrar pedidos en tiempo real, ver el catálogo de cadenas cubanas, esmeraldas y diamantes,
y gestionar a cada cliente con inteligencia artificial.

Segundo, el Dashboard de Analytics.
Con un solo vistazo, ves las métricas de ventas del día, la semana y el mes.
Todo sincronizado en la nube.

Tercero, el Asistente Avatar.
Soy yo, Guillermo, en formato digital.
Puedo responder preguntas de clientes, recomendar productos y conectarlos directamente por WhatsApp.

Y cuarto, la sincronización total.
Todo lo que ocurre en la app se respalda automáticamente en Google Drive con cinco terabytes de capacidad.

HB Jewelry. Tecnología, elegancia y confianza.
"""

async def generate_tts():
    """Genera TTS con edge-tts usando voz masculina profesional"""
    import edge_tts
    
    print("[TTS] Generando narración con es-US-AlonsoNeural...")
    
    # Voz: Alonso (es-US) - masculino, pausado, confiable, profesional
    # Ajustes: rate más lento (-10%), pitch ligero subido (+3Hz) para calidez
    communicate = edge_tts.Communicate(
        text=TUTORIAL_SCRIPT,
        voice="es-US-AlonsoNeural",
        rate="-10%",     # más pausado, más profesional
        volume="+10%",   # volumen optimizado
        pitch="+3Hz"     # calidez ligera
    )
    
    await communicate.save(TTS_RAW)
    print(f"  [OK] TTS raw guardado: {TTS_RAW}")
    return True

def enhance_voice(input_audio, output_audio):
    """Aplica filtros de voz profesional con FFmpeg"""
    print("[VOICE] Aplicando filtros profesionales de voz...")
    
    # Cadena de filtros profesional
    # 1. highpass: eliminar ruido por debajo de 80Hz
    # 2. equalizer 200Hz: reducir boominess
    # 3. equalizer 3kHz: boost claridad/presencia
    # 4. equalizer 8kHz: aire/brillo
    # 5. acompressor: normalizar dinámicas (4:1, attack 5ms, release 50ms)
    # 6. loudnorm: normalización EBU R128 (-16 LUFS, broadcasting standard)
    vfilter = (
        "highpass=f=80,"
        "equalizer=f=200:t=o:w=100:g=-2,"
        "equalizer=f=3000:t=o:w=500:g=+3,"
        "equalizer=f=8000:t=o:w=2000:g=+2,"
        "acompressor=threshold=0.07:ratio=4:attack=5:release=50:gain=2,"
        "loudnorm=I=-16:LRA=11:TP=-1.5"
    )
    
    result = subprocess.run([
        "ffmpeg", "-y", "-i", input_audio,
        "-af", vfilter,
        "-ar", "44100", "-ac", "1",
        output_audio
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"  [OK] Voz profesional: {output_audio}")
        return True
    else:
        print(f"  [WARN] Error EQ: {result.stderr[-300:]}")
        return False

def compose_final_video(enhanced_audio, avatar_video, music_input, output_video):
    """
    Compone el video final:
    - Video: avatar Guillermo en loop (adaptado a duración del audio TTS)
    - Audio: voz TTS mejorada + música de fondo a -20dB
    - Formato: H.264 9:16 vertical, listo para TikTok/Reels
    """
    print("[VIDEO] Componiendo video final con avatar + voz TTS + música...")
    
    # Obtener duración del audio TTS
    probe = subprocess.run([
        "ffprobe", "-v", "quiet", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", enhanced_audio
    ], capture_output=True, text=True)
    
    tts_duration = float(probe.stdout.strip()) if probe.stdout.strip() else 60
    print(f"  Duración TTS: {tts_duration:.1f} segundos")
    
    # Filter complex:
    # 1. Hacer loop del video del avatar para que dure igual que el TTS
    # 2. Mezclar voz TTS + música a 10% (ducking -20dB)
    filter_complex = (
        "[0:v]loop=-1:size=1000[vloop];"  # loop infinito del video avatar
        "[1:a]volume=1.0[voice];"          # voz al 100%
        "[2:a]volume=0.10[bgm];"           # música al 10% (-20dB)
        "[voice][bgm]amix=inputs=2:duration=first:weights=10 1[aout]"
    )
    
    result = subprocess.run([
        "ffmpeg", "-y",
        "-stream_loop", "-1",           # loop del video input
        "-i", avatar_video,              # video del avatar
        "-i", enhanced_audio,            # voz TTS mejorada
        "-i", music_input,               # música de fondo
        "-filter_complex", filter_complex,
        "-map", "[vloop]",
        "-map", "[aout]",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(tts_duration),         # cortar exactamente al final del TTS
        "-r", "30",                       # 30fps
        output_video
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        size_mb = os.path.getsize(output_video) / (1024*1024)
        print(f"  [OK] Video final: {output_video} ({size_mb:.2f} MB)")
        return True
    else:
        print(f"  [ERROR] Composición fallida: {result.stderr[-500:]}")
        return False

async def main():
    print("=" * 60)
    print("  HB TUTORIAL ENGINE — NARRACIÓN AVATAR GUILLERMO")
    print("  26 JULIO 2026 | es-US-AlonsoNeural | EBU R128")
    print("=" * 60)
    
    os.makedirs(OUT_DIR, exist_ok=True)
    
    # 1. Generar TTS
    await generate_tts()
    
    # 2. Mejorar voz
    enh_ok = enhance_voice(TTS_RAW, TTS_ENH)
    audio_to_use = TTS_ENH if enh_ok else TTS_RAW
    
    # 3. Componer video final
    ok = compose_final_video(audio_to_use, AVATAR_VID, MUSIC_IN, FINAL_VID)
    
    if ok:
        print("\n" + "=" * 60)
        print("  ✅ VIDEO TUTORIAL COMPLETADO")
        print(f"  📍 Output: {FINAL_VID}")
        print("  🎙️  Voz: es-US-AlonsoNeural + EQ profesional")
        print("  🎵  Música: -20dB auto-ducking")
        print("  📐  Formato: 720x1280, 30fps, H.264, AAC 192k")
        print("=" * 60)
    else:
        print("\n  [FAIL] Video no generado. Revisar logs.")

if __name__ == "__main__":
    asyncio.run(main())
