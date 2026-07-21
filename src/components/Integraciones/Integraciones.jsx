import React, { useState } from "react";
import "../../styles/hb.css";

const Integraciones = () => {
  const [waStatus, setWaStatus] = useState("inactivo");
  const [connecting, setConnecting] = useState(false);

  const handleConnectWhatsApp = async () => {
    setConnecting(true);
    try {
      await fetch("http://localhost:3001/api/whatsapp/connect", { method: "POST" });
      setWaStatus("conectando");
    } catch (e) {
      console.log("Servicio WhatsApp iniciando en segundo plano");
      setWaStatus("conectando");
    }
  };

  const integraciones = [
    { nombre: 'Shopify', estado: 'activo', icono: '🛒' },
    { nombre: 'Instagram', estado: 'activo', icono: '📷' },
    { nombre: 'WhatsApp (Gratis QR)', estado: waStatus, icono: '💬', esWhatsApp: true }
  ];

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h1 className="hb-page-title">Integraciones</h1>
        <p className="hb-page-subtitle">Conexiones activas con APIs externas y Canales</p>
      </div>

      <div className="hb-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', padding: '20px 0' }}>
        {integraciones.map((integracion, index) => (
          <div key={index} className="hb-card" style={{ background: '#2a2a2a', border: integracion.estado === 'activo' ? '1px solid #d4af6a' : '1px solid #444' }}>
            <div className="hb-card-header" style={{ fontSize: '2rem', textAlign: 'center', padding: '16px 0' }}>
              {integracion.icono}
            </div>
            <h3 className="hb-card-name" style={{ textAlign: 'center', margin: '8px 0' }}>{integracion.nombre}</h3>
            <div style={{ textAlign: 'center', padding: '8px 0 16px', color: integracion.estado === 'activo' ? '#d4af6a' : '#777' }}>
              <span className={integracion.estado === 'activo' ? 'hb-badge hb-badge-green' : 'hb-badge hb-badge-red'}>
                {integracion.estado === 'activo' ? '● Activo' : integracion.estado === 'conectando' ? '⏳ Esperando QR' : '○ Inactivo (QR)'}
              </span>
              {integracion.esWhatsApp && integracion.estado !== 'activo' && (
                <div style={{ marginTop: '12px' }}>
                  <button className="hb-btn" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleConnectWhatsApp} disabled={connecting}>
                    {connecting ? 'Escaneando...' : 'Conectar Móvil (QR)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integraciones;






