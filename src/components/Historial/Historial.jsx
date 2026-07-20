import React from 'react';
import "../../styles/hb.css";

const Historial = () => {
  const conversaciones = [
    { id: 1, fecha: '2024-03-15', mensaje: '¿Qué piezas tienen en oro amarillo?' },
    { id: 2, fecha: '2024-03-14', mensaje: 'Busco un collar con diamantes' },
    { id: 3, fecha: '2024-03-13', mensaje: '¿Tienen envíos internacionales?' },
  ];

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h2 className="hb-page-title">Historial de Conversaciones</h2>
        <p className="hb-page-subtitle">Todas tus interacciones anteriores</p>
      </div>

      <div className="hb-table-wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {conversaciones.length === 0 ? (
          <p style={{ color: '#d4af6a', textAlign: 'center', padding: '40px 0' }}>
            No hay conversaciones registradas
          </p>
        ) : (
          conversaciones.map((conv) => (
            <div
              key={conv.id}
              style={{
                marginBottom: '16px',
                padding: '16px',
                border: '1px solid #d4af6a',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 175, 106, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: '#d4af6a', fontSize: '14px', fontWeight: '500' }}>
                  #{conv.id}
                </span>
                <span style={{ color: '#f0ede8', fontSize: '12px', opacity: '0.7' }}>
                  {conv.fecha}
                </span>
              </div>
              <p
                style={{
                  color: '#d4af6a',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                }}
              >
                {conv.mensaje}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Historial;






