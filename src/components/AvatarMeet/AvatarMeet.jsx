import React, { useState, useRef, useEffect } from 'react';
import './AvatarMeet.css';

const AvatarMeet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [godMode, setGodMode] = useState(false);
  const [isAnimatedBg, setIsAnimatedBg] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(true); // Para MediaPipe
  
  const wsRef = useRef(null);
  const localVideoRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const bgLayerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const requestRef = useRef();
  
  // VTuber Face Tracking Ref
  const facePoseRef = useRef({ rotX: 0, rotY: 0, rotZ: 0 });
  const faceMeshRef = useRef(null);
  const aiVisionLoopRef = useRef(null);
  
  // Audio Pipeline Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const recorderCtxRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const audioInputRef = useRef(null);

  // Initialize MediaPipe & Camera
  useEffect(() => {
    const initVisionAI = async () => {
      // 1. Iniciar Cámara
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error de cámara/micrófono.", err);
      }

      // 2. Iniciar MediaPipe FaceMesh
      if (window.FaceMesh) {
        const faceMesh = new window.FaceMesh({locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }});
        
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults((results) => {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            // Nariz = 1, Ojo Izq = 33, Ojo Der = 263, Mentón = 152
            const nose = landmarks[1];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            
            // Matemáticas de Rotación Básica (Pitch, Yaw, Roll)
            // Multiplicadores agresivos para que el Avatar reaccione bien a pequeños movimientos
            const rotY = (nose.x - 0.5) * -70; // Izquierda-Derecha (Yaw)
            const rotX = (nose.y - 0.5) * 50;  // Arriba-Abajo (Pitch)
            const rotZ = (leftEye.y - rightEye.y) * -100; // Inclinación (Roll)
            
            // Suavizado (Lerp) manual se hará en el loop de animación, aquí guardamos el target
            facePoseRef.current = { rotX, rotY, rotZ };
          }
        });
        
        faceMeshRef.current = faceMesh;
        setIsAiLoading(false);
      }
    };
    
    initVisionAI();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      stopAudioPipeline();
      cancelAnimationFrame(requestRef.current);
      cancelAnimationFrame(aiVisionLoopRef.current);
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, []);

  // Computer Vision Processing Loop (Envía fotogramas de la cámara a la IA)
  const processVisionFrame = async () => {
    if (faceMeshRef.current && localVideoRef.current && isVideoOn) {
      try {
        await faceMeshRef.current.send({image: localVideoRef.current});
      } catch (e) {}
    }
    aiVisionLoopRef.current = requestAnimationFrame(processVisionFrame);
  };

  // Activar la visión cuando se conecte
  useEffect(() => {
    if (isConnected) {
      aiVisionLoopRef.current = requestAnimationFrame(processVisionFrame);
    } else {
      cancelAnimationFrame(aiVisionLoopRef.current);
      // Resetear postura
      facePoseRef.current = { rotX: 0, rotY: 0, rotZ: 0 };
    }
  }, [isConnected, isVideoOn]);

  // 3D Parallax & LipSync Engine (Aplicando tracking facial)
  const animateLayers = () => {
    const { rotX, rotY, rotZ } = facePoseRef.current;

    let scale = 1;
    // Lip sync math (Habla en Inglés)
    if (isConnected && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      let average = sum / dataArray.length;
      scale = 1 + (average / 255) * 0.15; 
    }

    if (avatarVideoRef.current) {
      // Aplicar captura de movimiento facial al modelo estático
      avatarVideoRef.current.style.transform = `perspective(1000px) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) translateZ(40px)`;
      avatarVideoRef.current.style.filter = `drop-shadow(${rotY * 0.5}px ${rotX * -0.5}px 25px rgba(0,0,0,0.8))`; // Sombra sigue el rostro
    }

    if (bgLayerRef.current) {
      bgLayerRef.current.style.transform = `translate(${rotY * 0.5}px, ${rotX * -0.5}px)`;
    }

    requestRef.current = requestAnimationFrame(animateLayers);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateLayers);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isConnected]); 


  const stopAudioPipeline = () => {
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (audioInputRef.current) audioInputRef.current.disconnect();
    if (recorderCtxRef.current) recorderCtxRef.current.close();
    if (audioCtxRef.current) audioCtxRef.current.close();
    if (wsRef.current) wsRef.current.close();
  };

  const floatTo16BitPCM = (input) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  };

  const startAudioPipeline = () => {
    if (!mediaStreamRef.current) return;
    
    recorderCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    audioInputRef.current = recorderCtxRef.current.createMediaStreamSource(mediaStreamRef.current);
    scriptProcessorRef.current = recorderCtxRef.current.createScriptProcessor(2048, 1, 1);
    
    scriptProcessorRef.current.onaudioprocess = (e) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      if (isMuted) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16Buffer = floatTo16BitPCM(inputData);
      wsRef.current.send(pcm16Buffer); 
    };

    audioInputRef.current.connect(scriptProcessorRef.current);
    scriptProcessorRef.current.connect(recorderCtxRef.current.destination);

    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    analyserRef.current.connect(audioCtxRef.current.destination);
  };

  const toggleConnection = () => {
    if (isAiLoading) {
      alert("Por favor espera, el modelo de Visión de IA (MediaPipe) está cargando...");
      return;
    }

    if (isConnected) {
      stopAudioPipeline();
      setIsConnected(false);
      setTranscript('Desconectado.');
    } else {
      setTranscript('Conectando motores (Voz y Visión)...');
      wsRef.current = new WebSocket('ws://localhost:8091');
      wsRef.current.binaryType = "arraybuffer";
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setTranscript('VTuber Activo. Transmitiendo movimientos faciales y voz.');
        startAudioPipeline();
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
          if (!audioCtxRef.current) return;
          try {
            const arrayBuffer = event.data;
            const int16Array = new Int16Array(arrayBuffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
              float32Array[i] = int16Array[i] / 32768.0;
            }
            
            const audioBuffer = audioCtxRef.current.createBuffer(1, float32Array.length, 16000);
            audioBuffer.copyToChannel(float32Array, 0);
            
            const source = audioCtxRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(analyserRef.current);
            source.start();
          } catch(e) {}
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        setTranscript('Desconectado.');
      };
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setTranscript(isMuted ? 'Micrófono encendido' : 'Micrófono silenciado');
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
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div className="avatar-header">
        <h2>Traductor Gemini 1.5 (Avatar Room)</h2>
        <span className={`status-badge ${isConnected ? 'connected' : ''}`} style={{ background: isAiLoading ? '#880' : ''}}>
          {isAiLoading ? 'CARGANDO IA VISUAL...' : (isConnected ? 'VTUBER MOCAP LÍNEA' : 'DESCONECTADO')}
        </span>
      </div>

      <div className="video-grid">
        {/* Avatar Video (Motor de Mocap VTuber) */}
        <div 
          className="video-panel" 
          style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            overflow: 'hidden',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Background Layer */}
          <div 
            ref={bgLayerRef}
            style={{
              position: 'absolute',
              top: '-15%', left: '-15%', width: '130%', height: '130%',
              background: isAnimatedBg ? 'linear-gradient(270deg, #111, #4a3b2c, #111)' : '#1a1a1a',
              backgroundSize: isAnimatedBg ? '400% 400%' : 'auto',
              animation: isAnimatedBg ? 'gradientBG 5s ease infinite' : 'none',
              zIndex: 1,
              transition: 'transform 0.1s ease-out'
            }} 
          />

          {/* Avatar Layer */}
          <img 
            ref={avatarVideoRef} 
            src="/avatar_transparent.png" 
            className="avatar-video"
            alt="Avatar Profesional HB Jewelry"
            style={{ 
              position: 'relative', 
              zIndex: 2, 
              width: '300px', 
              height: '300px', 
              objectFit: 'contain', 
              transition: 'transform 0.05s linear',
              opacity: isConnected ? 1 : 0.5
            }}
          />
          {!isConnected && (
            <div className="video-placeholder" style={{ zIndex: 3, position: 'absolute' }}>
              <i className="bi bi-robot"></i>
              <p>Esperando conexión Edge...</p>
            </div>
          )}
        </div>

        {/* Local Video (Hidden but active for MediaPipe) */}
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ display: 'none' }} 
        />
      </div>
      
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
          className={`control-btn ${isAnimatedBg ? 'active' : ''}`} 
          onClick={() => setIsAnimatedBg(!isAnimatedBg)}
          style={{ background: isAnimatedBg ? '#d4af37' : '#444', color: '#000' }}
          title="Fondo Dinámico / Sólido"
        >
          <i className="bi bi-layers-fill"></i>
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
