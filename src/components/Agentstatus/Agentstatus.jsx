import "../../styles/hb.css";

const AgentStatus = ({ agents = [] }) => {
  const defaultAgents = [
    { id: 1, name: 'María López', status: 'active', sales: 12, online: true },
    { id: 2, name: 'Carlos Ruiz', status: 'active', sales: 8, online: false },
    { id: 3, name: 'Ana García', status: 'active', sales: 15, online: true },
    { id: 4, name: 'Pedro Sánchez', status: 'active', sales: 6, online: true },
  ];

  const displayAgents = agents.length > 0 ? agents : defaultAgents;

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h2 className="hb-page-title">Estado de Agentes Activos</h2>
        <p className="hb-page-subtitle">Monitoreo en tiempo real</p>
      </div>
      <div className="hb-table-wrap">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Agente</th>
              <th>Estado</th>
              <th>Ventas</th>
              <th>Online</th>
            </tr>
          </thead>
          <tbody>
            {displayAgents.map(agent => (
              <tr key={agent.id}>
                <td>
                  <div className="hb-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div className="hb-card-header">
                      <span className="hb-card-name">{agent.name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`hb-badge ${agent.status === 'active' ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {agent.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <span className="hb-card-price" style={{ color: '#d4af6a' }}>{agent.sales}</span>
                </td>
                <td>
                  <span className={`hb-badge ${agent.online ? 'hb-badge-green' : 'hb-badge-red'}`}>
                    {agent.online ? 'Online' : 'Offline'}
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

export default AgentStatus;






