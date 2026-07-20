import React, { useState } from 'react';
import "../../styles/hb.css";

const ChatUI = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Consulta general 1', messages: [] },
    { id: 2, title: 'Pregunta técnica', messages: [] }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleNewConversation = () => {
    const newId = conversations.length + 1;
    const newConv = { id: newId, title: `Nueva conversación ${newId}`, messages: [] };
    setConversations([...conversations, newConv]);
    setActiveConversation(newId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !activeConversation) return;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, { role: 'user', content: currentMessage }]
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setCurrentMessage('');
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a1a1a', color: '#f0ede8' }}>
      {/* Sidebar de conversaciones */}
      <div style={{ width: '280px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
          <h3 style={{ margin: 0, color: '#d4af6a', fontSize: '1.1rem' }}>Conversaciones</h3>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              style={{
                padding: '10px 12px',
                margin: '4px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeConversation === conv.id ? '#2a2a2a' : 'transparent',
                border: activeConversation === conv.id ? '1px solid #d4af6a' : '1px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '0.9rem', color: '#f0ede8' }}>{conv.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                {conv.messages.length} mensajes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Barra de herramientas */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#222'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="hb-btn hb-btn-sm" onClick={handleNewConversation}>
              + Nueva conversación
            </button>
            <button className="hb-btn hb-btn-sm">
              Historial
            </button>
          </div>
          <div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="hb-select"
              style={{ background: '#2a2a2a', color: '#f0ede8', border: '1px solid #d4af6a', padding: '6px 12px', borderRadius: '4px' }}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="claude-3">Claude 3</option>
            </select>
          </div>
        </div>

        {/* Área de mensajes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {!activeConversation ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
              Selecciona o crea una conversación para comenzar
            </div>
          ) : activeConv.messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
              Envía tu primer mensaje
            </div>
          ) : (
            activeConv.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#d4af6a' : '#2a2a2a',
                  color: msg.role === 'user' ? '#1a1a1a' : '#f0ede8',
                  fontSize: '0.95rem',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.8rem' }}>
                    {msg.role === 'user' ? 'Tú' : 'Asistente'}
                  </div>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input de mensaje */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #333', background: '#222' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="hb-input"
              style={{ flex: 1, background: '#2a2a2a', color: '#f0ede8', border: '1px solid #444', borderRadius: '8px', padding: '10px 14px' }}
            />
            <button type="submit" className="hb-btn" style={{ background: '#d4af6a', color: '#1a1a1a', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600 }}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;






