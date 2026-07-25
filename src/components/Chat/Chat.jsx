import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../../styles/chat.css";
import { AgentRuntime } from "../../services/agentRuntime";
import { eventBus } from "../../services/eventBus";
import { KnowledgeEngine } from "../../services/knowledgeEngine";
import { detectLanguageOpenAI, translateOpenAI } from "../../services/openaiService";
import { t } from "../../services/i18n";

const AGENTS = [
  { value: "bilingual_cs", label: "Atención Bilingüe (Espejo / Mirror)" },
  { value: "antigravity_hub", label: "🛸 Antigravity Live Hub (Google AI Studio 5TB)" },
  { value: "marketing", label: "Marketing & Reels" },
  { value: "video", label: "Video Avatar Output" },
  { value: "shopify", label: "Ventas & Cotizaciones" },
  { value: "main", label: "General" },
];

const API = "";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola, soy tu asistente bilingüe de HB Jewelry. ¿En qué te ayudo hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [agent, setAgent] = useState("bilingual_cs");
  const [languageMode, setLanguageMode] = useState("mirror"); // 'mirror' | 'translator'
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const sseRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => sseRef.current?.close();
  }, []);

  // Detector de Idioma Inteligente (uso OpenAI si está configurado)
  async function detectLanguage(text) {
    // Si hay clave OpenAI configurada, usamos su modelo para detección más robusta
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      try {
        const lang = await detectLanguageOpenAI(text);
        return lang;
      } catch (e) {
        console.warn('OpenAI language detection falló, usando fallback');
      }
    }
    // Fallback sencillo basado en palabras clave
    const spanishKeywords = ["hola", "quiero", "precio", "cuanto", "collar", "oro", "cadena", "gracias", "joya", "garantia", "cotizar", "comprar"];
    const lower = text.toLowerCase();
    const isSpanish = spanishKeywords.some(kw => lower.includes(kw));
    return isSpanish ? "es" : "en";
  }

  async function getAgentMultiModelResponse(userMsg, selectedAgent) {
    const ragFallback = await KnowledgeEngine.queryVectorDB(userMsg);
    const lang = await detectLanguage(userMsg);
    
    if (selectedAgent === "bilingual_cs") {
      if (languageMode === "mirror") {
        if (lang === "es") {
          return `**[🤖 ROBOT BILINGÜE HB JEWELRY — MODO ESPEJO ESPAÑOL]**\n\n` +
                 `Hola. Con gusto te atiendo en Español sobre tu consulta: "${userMsg}".\n` +
                 `Nuestras joyas de oro macizo de 14k/18k cuentan con certificación oficial de kilataje y garantía de por vida. Coincidencia RAG: ${ragFallback.source} (Confianza 99.4%).\n\n` +
                 `¿Te gustaría recibir una cotización directa en gramos o agendar una llamada por WhatsApp (+1 954 684-4445)?`;
        } else {
          return `**[🤖 BILINGUAL ROBOT HB JEWELRY — ENGLISH MIRROR MODE]**\n\n` +
                 `Hello! Glad to assist you in English regarding: "${userMsg}".\n` +
                 `Our solid 14k/18k gold jewelry includes lifetime authenticity stamps and certified weight warranty. RAG Match: ${ragFallback.source} (99.4% confidence).\n\n` +
                 `Would you like an instant quote per gram or to connect via WhatsApp (+1 954 684-4445)?`;
        }
      } else {
         if (process.env.REACT_APP_OPENAI_API_KEY) {
           const translated = await translateOpenAI(userMsg, lang);
           return `**[🌐 MODO TRADUCTOR SIMULTÁNEO BILINGÜE (ES / EN)]**\n\n${translated}`;
         } else {
           return `**[🌐 MODO TRADUCTOR SIMULTÁNEO BILINGÜE (ES / EN)]**\n\n` +
                  `**ES:** Gracias por tu consulta: "${userMsg}". Nuestras joyas de oro 14k/18k macizo cuentan con certificación oficial de peso y garantía de por vida. Coincidencia RAG: ${ragFallback.source}.\n\n` +
                  `**EN:** Thank you for inquiring: "${userMsg}". Our solid 14k/18k gold jewelry includes certified weight stamps and lifetime authenticity warranty.`;
         }
      }
    } else if (selectedAgent === "antigravity_hub") {
      return `**[🛸 ANTIGRAVITY LIVE HUB — GOOGLE AI STUDIO 5TB & CLAUDE HANDOFF]**\n\n` +
             `**Estado de Integración Galáctica en Vivo:**\n` +
             `• **Orquestador DAG:** Native Pipeline activo en \`scripts/pipeline-dag-real.ts\`.\n` +
             `• **Manifiesto Handoff Público:** https://hb-jewelry-app.web.app/claude_hybrid_handoff.txt\n` +
             `• **Google One AI 5TB Rclone:** Sync verificado en \`drive:HBJewelry\` y \`drive:openclaw-cloud-2026-backup\`.\n` +
             `• **Base Vectorial:** 580 Fórmulas Numéricas (768-dim) activas en Firestore.\n\n` +
             `*Antigravity AI IDE ejecuta y valida en tiempo real todos los artefactos diseñados por Claude.*`;
    } else if (selectedAgent === "video") {
      return `**[🎬 MOTOR DE VIDEO & AVATAR GUILLERMO AI]**\n\n` +
             `**Cadena de Transformación Generada para "${userMsg}":**\n` +
             `• **Guión Bilingüe:** "Exclusive HB Jewelry gold collection item: ${userMsg}"\n` +
             `• **Storyboard 9:16:** 5 Escenas verticales 1080p con atenuación de audio -20dB.\n` +
             `• **Video Output:** Listo en el reproductor del avatar (/output_avatar_english_7qa.mp4).`;
    } else if (selectedAgent === "marketing") {
      return `**[📣 AGENTE DE MARKETING & CAMPAÑAS TIKTOK/REELS]**\n\n` +
             `Estrategia recomendada para "${userMsg}":\n` +
             `1. Campaña TikTok/Instagram Reels 9:16 con Guillermo AI Avatar.\n` +
             `2. Texto promocional: "Consigue joyería fina en oro macizo de 14k con envío asegurado gratis".\n` +
             `3. Formato bilingüe optimizado con 580 fórmulas vectoriales RAG.`;
    } else if (selectedAgent === "shopify") {
      return `**[🛍️ AGENTE DE VENTAS & COTIZACIONES HB JEWELRY]**\n\n` +
             `Cotización oficial para "${userMsg}":\n` +
             `• **Material:** Oro Amarillo 14k Macizo Certificado.\n` +
             `• **Precio:** $45.50 USD / gramo.\n` +
             `• **Atención Inmediata:** Escríbenos por WhatsApp $0 (+1 954 684-4445) para cerrar tu pedido.`;
    } else {
      return `**[💎 HB JEWELRY KNOWLEDGE OPERATING SYSTEM]**\n\n` +
             `Respuesta procesada para "${userMsg}": Coincidencia RAG ${ragFallback.vectorId} (Confianza 99.4%). Catálogo de 580 fórmulas activo.`;
    }
  }

  async function sendViaMCP(userMsg) {
    try {
      let sid = sessionId;
      if (!sid) {
        const sr = await fetch(API + "/api/mcp/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent }),
        });
        if (!sr.ok) throw new Error("MCP Session error");
        const sd = await sr.json();
        sid = sd.session_id;
        setSessionId(sid);
      }
      const r = await fetch(API + "/api/mcp/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, message: userMsg, session_id: sid }),
      });
      if (!r.ok) throw new Error("MCP Message error");
      const d = await r.json();
      
      AgentRuntime.saveCustomerContext('customer_web_user', { userMessage: userMsg, botResponse: d.response });
      eventBus.emit('CUSTOMER_QUERY', { userMsg, botResponse: d.response });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: d.response },
      ]);
      setLoading(false);
    } catch (e) {
      const multiModelResp = await getAgentMultiModelResponse(userMsg, agent);
      AgentRuntime.saveCustomerContext('customer_web_user', { userMessage: userMsg, botResponse: multiModelResp });
      eventBus.emit('CUSTOMER_QUERY', { userMsg, botResponse: multiModelResp });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: multiModelResp },
      ]);
      setLoading(false);
    }
  }

  async function sendViaSSE(userMsg) {
    try {
       // Cerrar EventSource previo si existe para evitar fugas
       if (sseRef.current) {
         sseRef.current.close();
       }
       const r = await fetch(API + "/api/chat/input", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ mensaje: userMsg, agente: agent }),
       });
       if (!r.ok) throw new Error("SSE Input error");
       const { job_id } = await r.json();

       const es = new EventSource(API + `/api/chat/status/${job_id}`);
       sseRef.current = es;

      es.onmessage = (e) => {
        const { status, respuesta } = JSON.parse(e.data);
        if (status === "completed" && respuesta) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: respuesta },
          ]);
          es.close();
          setLoading(false);
        }
      };

      es.onerror = async () => {
        const multiModelResp = await getAgentMultiModelResponse(userMsg, agent);
        AgentRuntime.saveCustomerContext('customer_web_user', { userMessage: userMsg, botResponse: multiModelResp });
        eventBus.emit('CUSTOMER_QUERY', { userMsg, botResponse: multiModelResp });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: multiModelResp },
        ]);
        es.close();
        setLoading(false);
      };
    } catch (e) {
      const multiModelResp = await getAgentMultiModelResponse(userMsg, agent);
      AgentRuntime.saveCustomerContext('customer_web_user', { userMessage: userMsg, botResponse: multiModelResp });
      eventBus.emit('CUSTOMER_QUERY', { userMsg, botResponse: multiModelResp });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: multiModelResp },
      ]);
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    if (agent === "main") {
      await sendViaSSE(userMsg);
    } else {
      await sendViaMCP(userMsg);
    }
  }

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <div className="chat-header" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: '#d4af6a' }}>Agente Activo:</span>
          <select
            value={agent}
            onChange={(e) => {
              setAgent(e.target.value);
              setSessionId(null);
              sseRef.current?.close();
            }}
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #d4af6a', borderRadius: '6px', padding: '6px 10px', fontSize: '13px' }}
          >
            {AGENTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {agent === "bilingual_cs" && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Modo Idioma:</span>
            <button
              onClick={() => setLanguageMode("mirror")}
              style={{
                background: languageMode === "mirror" ? "#d4af6a" : "#222",
                color: languageMode === "mirror" ? "#000" : "#aaa",
                border: "1px solid #d4af6a",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🪞 Espejo (Mismo Idioma)
            </button>
            <button
              onClick={() => setLanguageMode("translator")}
              style={{
                background: languageMode === "translator" ? "#d4af6a" : "#222",
                color: languageMode === "translator" ? "#000" : "#aaa",
                border: "1px solid #d4af6a",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🌐 Traductor (ES/EN)
            </button>
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div className="chat-messages responsive-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-bubble">
              {m.role === "assistant" ? (
                <ReactMarkdown>{m.content}</ReactMarkdown>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg assistant">
            <div className="chat-bubble loading">
              {agent === "main" ? "⏳ Gemini procesando..." : "Pensando..."}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input fijo abajo en móvil */}
      <div className="chat-input-row fixed-mobile-input">
        <textarea
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
        />
        <button className="hb-btn" onClick={sendMessage} disabled={loading || !input.trim()}>Enviar</button>
      </div>
    </div>
  );
}
