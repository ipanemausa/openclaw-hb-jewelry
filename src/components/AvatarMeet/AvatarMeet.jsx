import React, { useState, useRef, useEffect } from 'react';
import './AvatarMeet.css';

const AvatarMeet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [godMode, setGodMode] = useState(false);
  
  const wsRef = useRef(null);
  
  const localVideoRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  // Initialize camera and mic
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };
    initMedia();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleConnection = () => {
    if (isConnected) {
      if (wsRef.current) wsRef.current.close();
      setIsConnected(false);
      setTranscript('Desconectado.');
    } else {
      setTranscript('Conectando con Gemini Live...');
      wsRef.current = new WebSocket('ws://localhost:8091');
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setTranscript('Conectado. Habla en español para traducir al inglés.');
        // Here we would start capturing audio via AudioContext 
        // and sending chunks: wsRef.current.send(pcmData)
      };
      
      wsRef.current.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'transcription') {
              setTranscript(data.text);
            }
          } catch (e) {}
        } else {
          // Matemáticas de Edge Computing: AudioContext para procesar PCM/Blob y animar Avatar
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            analyserRef.current = audioCtxRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
          }
          
          try {
            // Decodificar audio recibido
            const arrayBuffer = await event.data.arrayBuffer();
            // (Nota: Si el audio es raw PCM 16kHz, requiere conversión manual a AudioBuffer)
            // Para simplificar, simulamos el análisis matemático del volumen para el lip-sync:
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            
            const animateMouth = () => {
              if(!avatarVideoRef.current || !isConnected) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for(let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              let average = sum / dataArray.length;
              
              // Fórmula Matemática para Escala (Simulación Lip-sync)
              const scale = 1 + (average / 255) * 0.15; 
              avatarVideoRef.current.style.transform = `scale(${scale})`;
              
              requestAnimationFrame(animateMouth);
            };
            animateMouth();
            
          } catch(e) {
            console.error("Error procesando audio matemático", e);
          }
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        setTranscript('Desconectado.');
      };
    }
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  return (
    <div className="avatar-meet-container">
      <div className="avatar-header">
        <h2>Traductor Gemini 1.5 (Avatar Room)</h2>
        <span className={`status-badge ${isConnected ? 'connected' : ''}`}>
          {isConnected ? 'GEMINI 1.5 LÍNEA' : 'DESCONECTADO'}
        </span>
      </div>

      <div className="video-grid">
        {/* Avatar Video (Edge Computing) */}
        <div className="video-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
          {isConnected ? (
            <img 
              ref={avatarVideoRef} 
              src="https://via.placeholder.com/400x400.png?text=Avatar+Profesional" 
              className="avatar-video" 
              alt="Avatar Stream" 
              style={{ borderRadius: '50%', width: '250px', height: '250px', objectFit: 'cover', transition: 'transform 0.05s' }}
            />
          ) : (
            <div className="video-placeholder">
              <i className="bi bi-robot"></i>
              <p>Esperando conexión Edge (Sin latencia)...</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="video-panel">
          {isVideoOn ? (
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
          ) : (
            <div className="video-placeholder">
              <i className="bi bi-person-video-off"></i>
              <p>Cámara apagada</p>
            </div>
          )}
        </div>
      </div>
      
      
      {/* GOD MODE / TELEPROMPTER */}
      {godMode && (
        <div style={{ padding: '16px', background: 'rgba(0,50,0,0.8)', borderRadius: '8px', marginTop: '16px', minHeight: '80px', border: '1px solid #0f0' }}>
          <p style={{ margin: 0, color: '#0f0', fontSize: '14px', fontWeight: 'bold' }}>MODO DIOS (Teleprompter Privado):</p>
          <p style={{ margin: '8px 0 0 0', color: '#fff', fontSize: '18px' }}>{transcript || 'Esperando traducción...'}</p>
        </div>
      )}

      {!godMode && (
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', marginTop: '16px', minHeight: '60px' }}>
          <p style={{ margin: 0, color: '#d4af37', fontSize: '14px' }}>Traducción / Estado:</p>
          <p style={{ margin: '8px 0 0 0', color: '#fff' }}>{transcript || '...'}</p>
        </div>
      )}


      <div className="controls-bar">
        <button className={`control-btn ${!isVideoOn ? 'danger' : ''}`} onClick={toggleVideo}>
          <i className={`bi ${isVideoOn ? 'bi-camera-video-fill' : 'bi-camera-video-off-fill'}`}></i>
        </button>
        
        <button className={`control-btn ${isMuted ? 'danger' : ''}`} onClick={toggleMute}>
          <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
        </button>

        <button 
          className={`control-btn ${isConnected ? 'danger' : 'active'}`} 
          onClick={toggleConnection}
        >
          <i className={`bi ${isConnected ? 'bi-telephone-x-fill' : 'bi-telephone-fill'}`}></i>
        </button>

        <button 
          className={`control-btn ${godMode ? 'active' : ''}`} 
          onClick={() => setGodMode(!godMode)}
          style={{ marginLeft: 'auto', background: godMode ? '#0a0' : '#444' }}
        >
          <i className="bi bi-eye-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default AvatarMeet;
