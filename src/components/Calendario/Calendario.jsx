import "../../styles/hb.css";

const Calendario = () => {
  const eventos = [
    { id: 1, titulo: 'Lanzamiento colección Otoño', fecha: '2025-03-15', estado: 'Completado' },
    { id: 2, titulo: 'Reunión proveedores', fecha: '2025-03-18', estado: 'Pendiente' },
    { id: 3, titulo: 'Taller diseño joyas', fecha: '2025-03-20', estado: 'En progreso' },
    { id: 4, titulo: 'Feria internacional HB', fecha: '2025-04-01', estado: 'Pendiente' },
  ];

  const tareas = [
    { id: 1, nombre: 'Diseñar anillo compromiso', fecha: '2025-03-14', estado: 'Completado' },
    { id: 2, nombre: 'Actualizar catálogo web', fecha: '2025-03-17', estado: 'Pendiente' },
    { id: 3, nombre: 'Control calidad lotes', fecha: '2025-03-19', estado: 'En progreso' },
  ];

  const estadoBadge = (estado) => {
    switch (estado) {
      case 'Completado': return 'hb-badge-green';
      case 'Pendiente': return 'hb-badge';
      case 'En progreso': return 'hb-badge';
      default: return 'hb-badge';
    }
  };

  return (
    <div className="hb-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      <header className="hb-page-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="hb-page-title" style={{ color: '#d4af6a', fontSize: '2.5rem', letterSpacing: '2px', textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Calendario HB</h1>
        <p className="hb-page-subtitle" style={{ color: '#f0ede8', opacity: 0.9, marginTop: '0.5rem' }}>Gestión de eventos y tareas programadas</p>
      </header>

      <div className="hb-form-grid" style={{ width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Sección Eventos */}
        <div className="hb-card" style={{ border: '1px solid #d4af6a', boxShadow: '0 8px 32px rgba(212, 175, 106, 0.3)' }}>
          <div className="hb-card-header" style={{ backgroundColor: '#d4af6a', padding: '1rem', borderBottom: '2px solid #b8963d' }}>
            <h3 style={{ color: '#1a1a1a', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>Eventos</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <div className="hb-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="hb-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d4af6a' }}>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Título</th>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Fecha</th>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evento) => (
                    <tr key={evento.id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.3s' }}>
                      <td style={{ padding: '0.75rem', color: '#f0ede8' }}>{evento.titulo}</td>
                      <td style={{ padding: '0.75rem', color: '#d4af6a' }}>{evento.fecha}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={estadoBadge(evento.estado)}>{evento.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección Tareas */}
        <div className="hb-card" style={{ border: '1px solid #d4af6a', boxShadow: '0 8px 32px rgba(212, 175, 106, 0.3)' }}>
          <div className="hb-card-header" style={{ backgroundColor: '#d4af6a', padding: '1rem', borderBottom: '2px solid #b8963d' }}>
            <h3 style={{ color: '#1a1a1a', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>Tareas</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <div className="hb-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="hb-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d4af6a' }}>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Nombre</th>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Fecha</th>
                    <th style={{ color: '#d4af6a', padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {tareas.map((tarea) => (
                    <tr key={tarea.id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.3s' }}>
                      <td style={{ padding: '0.75rem', color: '#f0ede8' }}>{tarea.nombre}</td>
                      <td style={{ padding: '0.75rem', color: '#d4af6a' }}>{tarea.fecha}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={estadoBadge(tarea.estado)}>{tarea.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario rápido (opcional) */}
      <div style={{ width: '100%', maxWidth: '600px', marginTop: '2rem' }}>
        <div className="hb-card" style={{ border: '1px solid #d4af6a', boxShadow: '0 8px 32px rgba(212, 175, 106, 0.3)' }}>
          <div className="hb-card-header" style={{ backgroundColor: '#d4af6a', padding: '1rem', borderBottom: '2px solid #b8963d' }}>
            <h3 style={{ color: '#1a1a1a', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>Agregar nuevo</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div className="hb-form">
              <div className="hb-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" className="hb-input" placeholder="Título/Nombre" style={{ backgroundColor: '#2a2a2a', borderColor: '#d4af6a', color: '#f0ede8' }} />
                <input type="date" className="hb-input" style={{ backgroundColor: '#2a2a2a', borderColor: '#d4af6a', color: '#f0ede8' }} />
                <select className="hb-select" style={{ backgroundColor: '#2a2a2a', borderColor: '#d4af6a', color: '#f0ede8' }}>
                  <option>Evento</option>
                  <option>Tarea</option>
                </select>
                <select className="hb-select" style={{ backgroundColor: '#2a2a2a', borderColor: '#d4af6a', color: '#f0ede8' }}>
                  <option>Pendiente</option>
                  <option>En progreso</option>
                  <option>Completado</option>
                </select>
              </div>
              <button className="hb-btn" style={{ backgroundColor: '#d4af6a', color: '#1a1a1a', width: '100%', padding: '0.8rem', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
                Programar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;






