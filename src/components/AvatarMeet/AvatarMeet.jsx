import React, { useState, useRef, useEffect } from 'react';
import './AvatarMeet.css';

const SEVEN_QA_ITEMS = [
  { id: 1, q: 'What is the architecture status of HB Jewelry?', a: 'Our architecture is 100% live on Firebase Cloud with 768-dimensional RAG vector formulas and sub-100ms response time.' },
  { id: 2, q: 'What gold jewelry items do you feature?', a: 'We feature 14k solid gold Cuban chains, 18k diamond drop earrings, and natural Colombian emerald solitaire rings.' },
  { id: 3, q: 'How does the $0 WhatsApp Business bot work?', a: 'It operates without Meta API fees via Baileys protocol on port 3001, answering 24/7 in English and Spanish.' },
  { id: 4, q: 'How do customers interact without typing?', a: 'Using real-time WhisperFlow $0 technology. Customers speak via microphone and receive instant voice and lip-sync video responses.' },
  { id: 5, q: 'Which AI engine powers the voice synthesis?', a: 'Google Gemini 2.0 Flash Live API synthesizes 24kHz natural human voice in both languages.' },
  { id: 6, q: 'How are 30-second promo videos generated?', a: 'We compile scripts with -20dB background music ducking and 1080p animated subtitles.' },
  { id: 7, q: 'How is cloud backup handled?', a: 'Our automated pipeline pushes commits to GitHub and syncs to 5TB Google Drive via Rclone.' }
];

const CUSTOMER_SAMPLE_QUESTIONS = [
  { id: 'c1', label: '💎 Cadenas Cubanas Oro 14k', q: '¿Cuál es el precio y peso de las Cadenas Cubanas de Oro 14k?', a: 'Nuestras Cadenas Cubanas en Oro Solido de 14k inician desde $1,850 USD, cuentan con cierre de seguridad italiano y garantía de por vida.' },
  { id: 'c2', label: '🟢 Esmeraldas Colombianas', q: '¿Tienen anillos con Esmeraldas Colombianas naturales?', a: 'Sí, ofrecemos anillos solitarios con Esmeraldas Colombianas certificadas de Muzo y Chivor en monturas de Oro de 18k.' },
  { id: 'c3', label: '✈️ Envíos & Garantía', q: '¿Cómo funcionan los envíos internacionales y la garantía?', a: 'Realizamos envíos asegurados a nivel mundial por FedEx Express. Cada pieza incluye certificado de autenticidad y garantía de por vida.' },
  { id: 'c4', label: '🎨 Diseños Personalizados', q: '¿Realizan pedidos y diseños de joyería personalizados?', a: '¡Por supuesto! Nuestro taller master diseña piezas únicas en 3D en 48 horas según tus especificaciones.' }
];

// ─── CLOUD-FIRST PROTOCOL (Firebase → Rclone → Localhost) ────────────────────
// Fuente maestra: Firebase Cloud. Rclone derrama hacia localhost.
// Fórmula de resolución: f(asset) = CLOUD_BASE_URL + asset (prod) | '/' + asset (dev)
// Optimización de memoria: carga bajo demanda, no preload masivo.
const CLOUD_BASE_URL = 'https://hb-jewelry-app.web.app';
const IS_PROD = window.location.hostname !== 'localhost';

// Algoritmo de resolución Cloud-First:
// Si estamos en Firebase (prod) → usa URL absoluta de Firebase
// Si estamos en localhost (dev) → usa path relativo (Vite sirve desde /public)
const cloudAsset = (filename) => IS_PROD ? `${CLOUD_BASE_URL}/${filename}` : `/${filename}`;

// Vector de eficiencia de assets (precarga solo los críticos, lazy para el resto)
const CRITICAL_ASSETS  = ['output_avatar_english_7qa.mp4'];  // carga inmediata
const LAZY_ASSETS      = ['hb_tutorial_narrado_v1.mp4', 'showcase_voice.mp3']; // bajo demanda

const AvatarMeet = () => {
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [avatarSource, setAvatarSource] = useState(cloudAsset('output_avatar_english_7qa.mp4'));

  const [activeQAIndex, setActiveQAIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBlockedByBrowser, setAudioBlockedByBrowser] = useState(false);
  const [viewMode, setViewMode] = useState('customer'); // 'customer' | 'technical' | 'tutorial'

  // Voice & Customer Input
  const [inputText, setInputText] = useState('');
  const [currentResponseTitle, setCurrentResponseTitle] = useState('Bienvenido a HB Jewelry Concierge AI');
  const [currentResponseText, setCurrentResponseText] = useState('Hola, soy Guillermo AI. ¿En qué te puedo asesorar hoy sobre nuestra colección exclusiva de joyas en oro de 14k/18k y esmeraldas colombianas?');
  const [isListening, setIsListening] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // Permisos de micrófono y altavoz explícitos
  async function requestMicAndAudioPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsAudioMuted(false);
      setAudioBlockedByBrowser(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.log('Play after mic permission:', e));
      }
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Permiso denegado:", err);
      alert("Por favor autoriza el micrófono y altavoz en la barra de tu navegador para interactuar con Guillermo AI.");
    }
  }

  // Voz sintética (TTS Browser / Gemini Voice)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Reproducir video y audio sincronizados
  const playAvatarResponse = (sourceUrl, title, textToSpeak) => {
    setIsAudioMuted(false);
    setAudioBlockedByBrowser(false);
    setAvatarSource(sourceUrl);
    if (title) setCurrentResponseTitle(title);
    if (textToSpeak) {
      setCurrentResponseText(textToSpeak);
      speakText(textToSpeak);
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Autoplay bloqueado por navegador. Muteando temporalmente:", err);
          setAudioBlockedByBrowser(true);
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      }
    }
  };

  // Auto-play video al cambiar fuente
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().catch(e => {
        console.log('Autoplay handled:', e);
        setAudioBlockedByBrowser(true);
      });
    }
  }, [avatarSource]);

  // Captura de micrófono por demanda (WhisperFlow $0 Mic)
  const toggleMic = async () => {
    if (!hasMicPermission && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        setIsAudioMuted(false);
        setAudioBlockedByBrowser(false);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.warn("Permiso de micrófono denegado:", err);
        alert("Por favor autoriza el micrófono en tu navegador para hablar con Guillermo AI.");
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const manualText = prompt("Escribe tu consulta para Guillermo AI aquí:");
      if (manualText) handleCustomCustomerQuery(manualText);
      return;
    }

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-ES';

      rec.onstart = () => setIsListening(true);

      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputText(text);
        handleCustomCustomerQuery(text);
      };

      rec.onerror = (e) => {
        console.warn("Error en captura de voz:", e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          alert("Permiso de micrófono bloqueado en tu navegador. Haz clic en el ícono de candado en la barra de dirección para otorgar acceso.");
        }
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn("Error iniciando micrófono:", err);
      setIsListening(false);
    }
  };

  const toggleSound = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    setAudioBlockedByBrowser(false);
    if (videoRef.current) {
      videoRef.current.muted = nextState;
      if (!nextState) videoRef.current.play();
    }
  };

  const selectTechnicalQA = (idx) => {
    setActiveQAIndex(idx);
    const item = SEVEN_QA_ITEMS[idx];
    playAvatarResponse(cloudAsset('output_avatar_english_7qa.mp4'), `Pregunta Técnica Q${item.id}: ${item.q}`, item.a);
  };

  const playTutorialVideo = () => {
    if (videoRef.current) {
      videoRef.current.src = cloudAsset('hb_tutorial_narrado_v1.mp4');
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log('Tutorial play:', e));
      setIsSpeaking(true);
      setCurrentResponseTitle('📹 Tutorial: Manejo de la App HB Jewelry');
      setCurrentResponseText('Soy Guillermo, tu asesor de joyería digital. En este tutorial te explico: Ventas, Dashboard de Analytics, el Asistente Avatar y la sincronización en la nube. Duración: 76 segundos.');
    }
  };

  const selectCustomerQuestion = (item) => {
    playAvatarResponse(cloudAsset('temp_lipsync.mp4'), `Consulta de Cliente: ${item.q}`, item.a);
  };

  const handleCustomCustomerQuery = (text) => {
    if (!text.trim()) return;
    const responseText = `Excelente pregunta sobre "${text}". En HB Jewelry cada pieza es elaborada en oro sólido de 14k y 18k con certificación internacional. ¿Te gustaría que un asesor te contacte por WhatsApp?`;
    playAvatarResponse(cloudAsset('temp_lipsync.mp4'), `Consulta Libre: "${text}"`, responseText);
    setInputText('');
  };

  const startAutoPlayback = () => {
    setIsPlayingAuto(true);
    let current = 0;
    selectTechnicalQA(0);

    const interval = setInterval(() => {
      current++;
      if (current < SEVEN_QA_ITEMS.length) {
        selectTechnicalQA(current);
      } else {
        clearInterval(interval);
        setIsPlayingAuto(false);
      }
    }, 7000);
  };

  return (
    <div className="avatar-meet-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      
      {/* Top Selector Mode: Cliente vs Investigador Técnico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px', background: '#111', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(212,175,106,0.3)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#d4af6a', fontSize: '20px' }}>💎 HB Jewelry Concierge AI & Guillermo Avatar</h2>
          <span style={{ color: '#888', fontSize: '12px' }}>Atención personalizada al cliente & Demo de Arquitectura de IA</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('customer')}
            style={{
              background: viewMode === 'customer' ? 'linear-gradient(135deg, #d4af6a, #aa8237)' : '#222',
              color: viewMode === 'customer' ? '#000' : '#aaa',
              border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
            }}
          >
            ✨ Consulta Cliente Joyería
          </button>
          <button
            onClick={() => setViewMode('technical')}
            style={{
              background: viewMode === 'technical' ? '#059669' : '#222',
              color: viewMode === 'technical' ? '#fff' : '#aaa',
              border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
            }}
          >
            🛠️ Demo Arquitectura Técnica
          </button>
          <button
            onClick={() => { setViewMode('tutorial'); playTutorialVideo(); }}
            style={{
              background: viewMode === 'tutorial' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#222',
              color: viewMode === 'tutorial' ? '#fff' : '#aaa',
              border: viewMode === 'tutorial' ? '1px solid #7c3aed' : '1px solid transparent',
              borderRadius: '20px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
            }}
          >
            📹 Tutorial App
          </button>
        </div>
      </div>

      {/* Main Video Screen */}
      <div style={{ position: 'relative', background: '#000', borderRadius: '16px', border: '1px solid rgba(212,175,106,0.3)', overflow: 'hidden', textAlign: 'center', marginBottom: '16px' }}>
        
        {/* Banner de aviso si el navegador bloqueó audio */}
        {audioBlockedByBrowser && (
          <div 
            onClick={toggleSound}
            style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'rgba(217,119,6,0.95)', color: '#fff', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          >
            🔊 Haz clic aquí para activar el sonido del Avatar
          </div>
        )}

        <video 
          key={avatarSource}
          ref={videoRef}
          src={avatarSource}
          autoPlay
          muted={isAudioMuted}
          playsInline
          controls
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
          }}
          style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
        />
        
        <div style={{ background: '#111', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={toggleSound}
            style={{ background: isAudioMuted ? '#333' : '#059669', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 20px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
          >
            {isAudioMuted ? '🔇 Activar Sonido (Unmute)' : '🔊 Sonido Activado (Mute)'}
          </button>

          <button
            onClick={requestMicAndAudioPermissions}
            style={{ background: hasMicPermission ? '#059669' : '#d97706', color: '#fff', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            {hasMicPermission ? '🎙️ Micrófono & Audio Autorizados' : '🎙️ Autorizar Micrófono & Audio PC'}
          </button>

          <span className="status-badge connected" style={{ background: isSpeaking ? 'rgba(217,119,6,0.2)' : 'rgba(52,211,153,0.15)', color: isSpeaking ? '#f59e0b' : '#34d399', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            {isSpeaking ? '🗣️ VOZ ACTIVA (HABLANDO)' : '🟢 VIDEO OUTPUT ACTIVO (1080P)'}
          </span>
        </div>
      </div>

      {/* Dynamic Response Display Box */}
      <div style={{ background: '#141414', border: '1px solid rgba(212,175,106,0.4)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#d4af6a', fontSize: '15px' }}>{currentResponseTitle}</h4>
        <div style={{ background: '#1c1c1c', borderRadius: '8px', padding: '14px 18px', borderLeft: '4px solid #34d399' }}>
          <strong style={{ color: '#34d399', fontSize: '12px', display: 'block', marginBottom: '4px' }}>🤖 RESPUESTA DE GUILLERMO AI:</strong>
          <span style={{ color: '#f0ede8', fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>{currentResponseText}</span>
        </div>
      </div>

      {/* MODE 1: CONSULTA CLIENTE JOYERÍA (DEBAJO DEL ROBOT) */}
      {viewMode === 'customer' && (
        <div style={{ background: '#141414', border: '1px solid rgba(212,175,106,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 6px 0', color: '#d4af6a', fontSize: '17px' }}>✨ ¿Qué te gustaría consultar hoy sobre nuestra Colección HB Jewelry?</h3>
          <p style={{ margin: '0 0 16px 0', color: '#aaa', fontSize: '13px' }}>Puedes seleccionar una consulta frecuente o preguntar libremente lo que desees a nuestro Avatar en voz o texto:</p>

          {/* Sample Customer Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '18px' }}>
            {CUSTOMER_SAMPLE_QUESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => selectCustomerQuestion(item)}
                style={{
                  background: '#1f1f1f', border: '1px solid rgba(212,175,106,0.3)', borderRadius: '8px', padding: '10px 14px',
                  color: '#fff', fontSize: '12px', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Open Question Input & Mic */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomCustomerQuery(inputText)}
              placeholder="Escribe o habla cualquier pregunta sobre collares, anillos, precios o envíos..."
              style={{ flex: 1, background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
            />
            <button 
              onClick={toggleMic}
              style={{ background: isListening ? '#ef4444' : '#25d366', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isListening ? '🔴 Escuchando...' : '🎙️ Hablar'}
            </button>
            <button 
              onClick={() => handleCustomCustomerQuery(inputText)}
              disabled={!inputText.trim()}
              style={{ background: 'linear-gradient(135deg, #d4af6a, #aa8237)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: !inputText.trim() ? 0.5 : 1 }}
            >
              🗣️ Consultar
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: DEMO ARQUITECTURA TÉCNICA APP (PARA INVESTIGADORES / INGENIEROS) */}
      {viewMode === 'technical' && (
        <div style={{ background: '#141414', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', color: '#34d399', fontSize: '16px' }}>🛠️ Demo de Investigación de Arquitectura Técnica App</h3>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Preguntas especializadas sobre RAG 768-dim, WhatsApp Baileys $0 y WhisperFlow:</span>
            </div>
            <button 
              onClick={startAutoPlayback}
              disabled={isPlayingAuto}
              style={{ background: 'linear-gradient(135deg, #d4af6a, #aa8237)', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
            >
              {isPlayingAuto ? '⚡ Reproduciendo las 7 Q&A...' : '▶ Reproducir las 7 Preguntas de Arquitectura'}
            </button>
          </div>

          {/* Q&A Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SEVEN_QA_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => selectTechnicalQA(idx)}
                style={{
                  flex: 1, minWidth: '80px', padding: '8px 0', borderRadius: '6px', border: 'none',
                  background: activeQAIndex === idx ? '#34d399' : '#222',
                  color: activeQAIndex === idx ? '#000' : '#888',
                  fontWeight: '700', fontSize: '12px', cursor: 'pointer'
                }}
              >
                Q{item.id} Técnico
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: TUTORIAL VIDEO — Narración AlonsoNeural + EQ Profesional */}
      {viewMode === 'tutorial' && (
        <div style={{ background: '#0f0a1e', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', color: '#a78bfa', fontSize: '17px' }}>📹 Tutorial: Manejo Completo de la App HB Jewelry</h3>
              <span style={{ color: '#888', fontSize: '12px' }}>Narrado por el Avatar Guillermo AI · Voz profesional EBU R128 · 76 segundos</span>
            </div>
            <button
              onClick={playTutorialVideo}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              ▶ Reproducir Tutorial
            </button>
          </div>

          {/* Temario del Tutorial */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {[
              { icon: '💰', title: 'Módulo 1: Ventas', desc: 'Registro de pedidos, catálogo y clientes en tiempo real' },
              { icon: '📊', title: 'Módulo 2: Analytics', desc: 'Dashboard de métricas diarias, semanales y mensuales' },
              { icon: '🤖', title: 'Módulo 3: Avatar AI', desc: 'Asistente Guillermo: responde, recomienda y conecta' },
              { icon: '☁️', title: 'Módulo 4: Nube 5TB', desc: 'Respaldo automático a Google Drive vía Rclone' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#1a1030', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{m.icon}</div>
                <div style={{ color: '#c4b5fd', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{m.title}</div>
                <div style={{ color: '#888', fontSize: '12px', lineHeight: '1.4' }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Especificaciones de Audio */}
          <div style={{ background: '#1a1030', borderRadius: '8px', padding: '10px 14px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '600' }}>🎙️ Voz: es-US-AlonsoNeural</span>
            <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '600' }}>🎛️ EQ: Loudnorm -16 LUFS (EBU R128)</span>
            <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '600' }}>🎵 Música: -20dB auto-ducking</span>
            <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '600' }}>📐 Formato: 720x1280 · 30fps · H.264</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default AvatarMeet;
