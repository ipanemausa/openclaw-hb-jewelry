#!/usr/bin/env python3
import os
import sys
import subprocess
import asyncio

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SADTALKER_DIR = r"C:\openclaw\SadTalker"
OUTPUT_DIR = r"C:\openclaw\hb-jewelry\public"

async def generate_audio():
    text = "Hola, bienvenido a HB Jewelry y al ecosistema OpenClaw AI 2026. Soy Guillermo, tu presentador oficial. Hoy combinamos joyería fina de oro de 18 kilates con Inteligencia Artificial de nivel empresarial. Explora nuestro catálogo."
    mp3_file = os.path.join(SADTALKER_DIR, "hb_promo_official.mp3")
    wav_file = os.path.join(SADTALKER_DIR, "hb_promo_official.wav")
    
    print("🎙️ [1/3] Sintetizando voz oficial...")
    cmd = f'edge-tts --voice "es-MX-JorgeNeural" --text "{text}" --write-media "{mp3_file}"'
    subprocess.run(cmd, shell=True, check=True)
    
    cmd_wav = f'ffmpeg -y -i "{mp3_file}" -ar 16000 -ac 1 "{wav_file}"'
    subprocess.run(cmd_wav, shell=True, check=True)
    print(f"✓ Audio WAV 16kHz PCM listo en: {wav_file}")

if __name__ == "__main__":
    asyncio.run(generate_audio())
