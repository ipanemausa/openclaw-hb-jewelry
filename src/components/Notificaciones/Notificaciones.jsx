import "../../styles/hb.css";
import React, { useState } from 'react';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: 'Nuevo pedido de joyería #1045', severidad: 'alta', leido: false },
    { id: 2, mensaje: 'Inventario bajo de anillos de oro', severidad: 'media', leido: false },
    { id: 3, mensaje: 'Actualización de catálogo disponible', severidad: 'baja', leido: false },
    { id: 4, mensaje: 'Pago recibido del cliente #203', severidad: 'alta', leido: false },
    { id: 5, mensaje: 'Mantenimiento programado para mañana', severidad: 'media', leido: false },
  ]);

  const noLeidas = notificaciones.filter(n => !n.leido).length;

  const marcarComoLeido = (id) => {
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leido: true } : n)
    );
  };

  const getSeveridadClase = (severidad) => {
    switch (severidad) {
      case 'alta': return 'hb-badge-red';
      case 'media': return 'hb-badge';
      case 'baja': return 'hb-badge-green';
      default: return 'hb-badge';
    }
  };

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h1 className="hb-page-title">Notificaciones</h1>
        <span className="hb-badge" style={{ backgroundColor: '#d4af6a', color: '#1a1a1a' }}>
          {noLeidas}
        </span>
      </div>
      <div className="hb-form">
        {notificaciones.map(noti => (
          <div key={noti.id} className="hb-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span className={getSeveridadClase(noti.severidad)} style={{ marginRight: '1rem' }}>
                {noti.severidad}
              </span>
              <span className="hb-card-name" style={{ color: noti.leido ? '#666' : '#f0ede8' }}>
                {noti.mensaje}
              </span>
            </div>
            {!noti.leido && (
              <button className="hb-btn hb-btn-sm" onClick={() => marcarComoLeido(noti.id)}>
                Leído
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notificaciones;






