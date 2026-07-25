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

const AvatarMeet = () => {
  const [hasMicPermission, setHasMicPermission] = useState(false);

  // Solicitud explícita de permisos de micrófono y parlante del PC
  async function requestMicAndAudioPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsAudioMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.log('Play after mic permission:', e));
      }
      // Detener stream temporal de prueba
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Permiso de micrófono o altavoz denegado por el usuario o navegador:", err);
      alert("Por favor autoriza el micrófono y altavoz en la barra de tu navegador para interactuar con Guillermo AI.");
    }
  }

  // Voice Input (WhisperFlow $0)
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-play video on source load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().catch(e => console.log('Autoplay handled:', e));
    }
  }, [avatarSource, isAudioMuted]);

  // Setup WebSpeech / WhisperFlow $0
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputText(text);
        triggerAvatarVoiceResponse(text);
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Mic speech recognition not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleSound = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    if (videoRef.current) {
      videoRef.current.muted = nextState;
      if (!nextState) videoRef.current.play();
    }
  };

  const selectQA = (idx) => {
    setActiveQAIndex(idx);
    setAvatarSource('/output_avatar_english_7qa.mp4');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const nextQA = () => {
    selectQA((activeQAIndex + 1) % SEVEN_QA_ITEMS.length);
  };

  const startAutoPlayback = () => {
    setIsPlayingAuto(true);
    let current = 0;
    selectQA(0);

    const interval = setInterval(() => {
      current++;
      if (current < SEVEN_QA_ITEMS.length) {
        selectQA(current);
      } else {
        clearInterval(interval);
        setIsPlayingAuto(false);
      }
    }, 5000);
  };

  const triggerAvatarVoiceResponse = (text) => {
    if (!text.trim()) return;
    setAvatarSource('/temp_lipsync.mp4');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsAudioMuted(false);
      videoRef.current.play();
    }
  };

  const currentQA = SEVEN_QA_ITEMS[activeQAIndex];

  return (
    <div className="avatar-meet-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      {/* Header Badge & Permission Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ margin: 0, color: '#d4af6a', fontSize: '20px' }}>Guillermo AI Avatar (English 7 Q&A Output)</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={requestMicAndAudioPermissions}
            style={{ background: hasMicPermission ? '#059669' : '#d97706', color: '#fff', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            {hasMicPermission ? '🎙️ Micrófono & Audio Autorizados' : '🎙️ Autorizar Micrófono & Audio PC'}
          </button>
          <span className="status-badge connected" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            🟢 VIDEO OUTPUT ACTIVO (1080P)
          </span>
        </div>
      </div>

      {/* Main Video Screen */}
      <div style={{ background: '#000', borderRadius: '16px', border: '1px solid rgba(212,175,106,0.3)', overflow: 'hidden', textAlign: 'center', marginBottom: '16px' }}>
        <video 
          key={avatarSource}
          ref={videoRef}
          src={avatarSource}
          autoPlay
          muted={isAudioMuted}
          loop
          playsInline
          controls
          style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
        />
        <div style={{ background: '#111', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={toggleSound}
            style={{ background: isAudioMuted ? '#333' : '#059669', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 20px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
          >
            {isAudioMuted ? '🔇 Activar Sonido (Unmute)' : '🔊 Sonido Activado (Mute)'}
          </button>

          <select 
            value={avatarSource}
            onChange={(e) => setAvatarSource(e.target.value)}
            style={{ background: '#1a1a1a', color: '#d4af6a', border: '1px solid #d4af6a', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600' }}
          >
            <option value="/output_avatar_english_7qa.mp4">🎬 REAL OUTPUT: Avatar English 7 Q&A</option>
            <option value="/temp_lipsync.mp4">👄 LipSync Real MP4</option>
            <option value="/tiktok_showcase.mp4">📱 TikTok Original (Guillermo)</option>
          </select>
        </div>
      </div>

      {/* Active Q&A Display Card */}
      <div style={{ background: '#141414', border: '1px solid rgba(212,175,106,0.4)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: '#d4af6a', fontSize: '14px', fontWeight: '700' }}>
            🎬 Question {currentQA.id} of 7:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={startAutoPlayback}
              disabled={isPlayingAuto}
              style={{ background: 'linear-gradient(135deg, #d4af6a, #aa8237)', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
            >
              {isPlayingAuto ? '⚡ Playing All 7...' : '▶ Play All 7 Q&A'}
            </button>
            <button 
              onClick={nextQA}
              style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 14px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
            >
              ⏭ Next ({currentQA.id}/7)
            </button>
          </div>
        </div>

        {/* Q&A Pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {SEVEN_QA_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectQA(idx)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: '4px', border: 'none',
                background: activeQAIndex === idx ? '#d4af6a' : '#222',
                color: activeQAIndex === idx ? '#000' : '#888',
                fontWeight: '700', fontSize: '12px', cursor: 'pointer'
              }}
            >
              Q{item.id}
            </button>
          ))}
        </div>

        {/* Question Text */}
        <div style={{ background: '#1c1c1c', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px', borderLeft: '4px solid #d4af6a' }}>
          <strong style={{ color: '#d4af6a', fontSize: '12px', display: 'block', marginBottom: '2px' }}>👤 USER QUESTION:</strong>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{currentQA.q}</span>
        </div>

        {/* Answer Text */}
        <div style={{ background: '#1c1c1c', borderRadius: '8px', padding: '12px 16px', borderLeft: '4px solid #34d399' }}>
          <strong style={{ color: '#34d399', fontSize: '12px', display: 'block', marginBottom: '2px' }}>🤖 GUILLERMO AI OUTPUT:</strong>
          <span style={{ color: '#f0ede8', fontSize: '14px', fontWeight: '400', lineHeight: '1.4' }}>{currentQA.a}</span>
        </div>
      </div>

      {/* WhisperFlow $0 Hands-Free Mic */}
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#a09d99', fontSize: '12px', fontWeight: '600' }}>🎙️ WhisperFlow $0 Hands-Free Mic Input:</span>
          <button 
            onClick={toggleMic}
            style={{ background: isListening ? '#ef4444' : '#25d366', color: '#fff', border: 'none', borderRadius: '16px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            {isListening ? '🔴 Stop Listening' : '🎙️ Speak by Microphone'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerAvatarVoiceResponse(inputText)}
            placeholder="Type or speak a question for Guillermo AI..."
            style={{ flex: 1, background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
          />
          <button 
            onClick={() => triggerAvatarVoiceResponse(inputText)}
            disabled={!inputText.trim()}
            style={{ background: 'linear-gradient(135deg, #d4af6a, #aa8237)', color: '#000', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', opacity: !inputText.trim() ? 0.5 : 1 }}
          >
            🗣️ Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarMeet;
