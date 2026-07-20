import React, { useState, useEffect } from 'react';
import "../../styles/hb.css";

const Auditoria = () => {
  const [logs, setLogs] = useState([
    { timestamp: '2025-02-28 10:30:00', usuario: 'admin', accion: 'login', estado: 'exitoso' },
    { timestamp: '2025-02-28 10:31:00', usuario: 'user1', accion: 'crear_orden', estado: 'exitoso' },
    { timestamp: '2025-02-28 10:32:00', usuario: 'sistema', accion: 'backup', estado: 'completado' }
  ]);

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h2 className="hb-page-title">Auditoría del Sistema</h2>
        <p className="hb-page-subtitle">Log completo de acciones del sistema</p>
      </div>
      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.usuario}</td>
                <td>{log.accion}</td>
                <td>
                  <span className={`hb-badge ${log.estado === 'exitoso' || log.estado === 'completado' ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {log.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Auditoria;






