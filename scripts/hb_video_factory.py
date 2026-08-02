#!/usr/bin/env python3
"""
====================================================================
 HB JEWELRY — AUTOMATED VIDEO FACTORY (TEXT -> VOICE -> LIPS-SYNC -> MP4)
 Version: 2026.7.1
====================================================================
Este script convierte cualquier texto en un video MP4 real de Guillermo AI:
 1. Genera audio de voz natural con Edge-TTS (es-ES / en-US).
 2. Involucra SadTalker V2V para sincronizar los labios del avatar.
 3. Ensambla y exporta el video en 16:9 (YouTube) y 9:16 (TikTok/Reels).
"""

import os
import sys
import subprocess
import asyncio

# Configurar encoding UTF-8 para consola de Windows PowerShell
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Rutas principales del sistema
SADTALKER_DIR = r"C:\openclaw\SadTalker"
OUTPUT_DIR = r"C:\openclaw\hb-jewelry\public"

async def generate_speech(text: str, output_wav: str, voice: str = "es-MX-JorgeNeural"):
    """Paso 1: Genera la voz profesional usando Edge-TTS"""
    print(f"🎙️ [1/3] Generando locución de voz para: '{text[:40]}...'")
    mp3_tmp = output_wav.replace(".wav", ".mp3")
    cmd = f'edge-tts --voice "{voice}" --text "{text}" --write-media "{mp3_tmp}"'
    subprocess.run(cmd, shell=True, check=True)
    
    # Convertir MP3 a WAV de 16kHz PCM (Requerido por SadTalker)
    ffmpeg_cmd = f'ffmpeg -y -i "{mp3_tmp}" -ar 16000 -ac 1 "{output_wav}"'
    subprocess.run(ffmpeg_cmd, shell=True, check=True)
    if os.path.exists(mp3_tmp):
        os.remove(mp3_tmp)
    print("✓ Audio listo en 16kHz PCM.")

def run_sadtalker_lipsync(source_img: str, audio_wav: str, output_name: str):
    """Paso 2: Ejecuta SadTalker para animar los labios sobre la foto de Guillermo"""
    print(f"🤖 [2/3] Ejecutando animación labial SadTalker sobre '{os.path.basename(source_img)}'...")
    cmd = [
        sys.executable,
        os.path.join(SADTALKER_DIR, "inference.py"),
        "--driven_audio", audio_wav,
        "--source_image", source_img,
        "--result_dir", os.path.join(SADTALKER_DIR, "results"),
        "--enhancer", "None",  # Inferencia rápida ultra-estable
        "--still"
    ]
    subprocess.run(cmd, cwd=SADTALKER_DIR, check=True)
    print("✓ Lip-sync completado exitosamente.")

def export_multi_format(raw_mp4: str, target_basename: str):
    """Paso 3: Exporta formatos 16:9 YouTube y 9:16 TikTok/Reels"""
    print(f"🎬 [3/3] Exportando formatos finales de video...")
    yt_output = os.path.join(OUTPUT_DIR, f"{target_basename}_16x9.mp4")
    tiktok_output = os.path.join(OUTPUT_DIR, f"{target_basename}_9x16.mp4")

    # Formato 16:9 YouTube
    cmd_yt = f'ffmpeg -y -i "{raw_mp4}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -c:a aac "{yt_output}"'
    subprocess.run(cmd_yt, shell=True, check=True)

    # Formato 9:16 TikTok / Reels
    cmd_tk = f'ffmpeg -y -i "{raw_mp4}" -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -c:a aac "{tiktok_output}"'
    subprocess.run(cmd_tk, shell=True, check=True)

    print(f"✅ Video YouTube 16:9: {yt_output}")
    print(f"✅ Video TikTok 9:16:  {tiktok_output}")

if __name__ == "__main__":
    script_text = "Hola, bienvenido a HB Jewelry. Soy el avatar de Guillermo y hoy te presento nuestra nueva colección de cadenas cubanas de oro de 18 kilates."
    wav_path = os.path.join(SADTALKER_DIR, "temp_speech.wav")
    ref_image = os.path.join(SADTALKER_DIR, "avatar_pro.png")
    
    asyncio.run(generate_speech(script_text, wav_path))
    print("🚀 Video Factory listo para producción automatizada!")
