import React, { useState, useEffect } from 'react';
import "../../styles/hb.css";

const Deploy = () => {
  const [deployStatus, setDeployStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeployStatus();
    fetchLogs();
  }, []);

  const fetchDeployStatus = async () => {
    try {
      const response = await fetch('/api/deploy/status');
      const data = await response.json();
      setDeployStatus(data.status);
    } catch (error) {
      console.error('Error fetching deploy status:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/deploy/logs');
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deploy', { method: 'POST' });
      const data = await response.json();
      setDeployStatus('deploying');
      // Real-time log polling
      const logInterval = setInterval(async () => {
        const logResponse = await fetch('/api/deploy/logs');
        const logData = await logResponse.json();
        setLogs(logData.logs);
        if (logData.status === 'success' || logData.status === 'failed') {
          clearInterval(logInterval);
          setDeployStatus(logData.status);
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error deploying:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (deployStatus) {
      case 'success':
        return <span className="hb-badge hb-badge-green">Success</span>;
      case 'failed':
        return <span className="hb-badge hb-badge-red">Failed</span>;
      case 'deploying':
        return <span className="hb-badge">Deploying...</span>;
      default:
        return <span className="hb-badge">Idle</span>;
    }
  };

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h1 className="hb-page-title">Cloud Run Deploy</h1>
        <p className="hb-page-subtitle">Gestiona los deploys de tu aplicacion</p>
      </div>

      <div className="hb-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
          <div>
            <h3>Estado del Deploy</h3>
            <div style={{ marginTop: '10px' }}>
              {getStatusBadge()}
            </div>
          </div>
          <button 
            className="hb-btn" 
            onClick={handleDeploy}
            disabled={loading || deployStatus === 'deploying'}
            style={{ backgroundColor: '#d4af6a', border: 'none', color: '#1a1a1a' }}
          >
            {loading ? 'Desplegando...' : 'Nuevo Deploy'}
          </button>
        </div>
      </div>

      <div className="hb-card">
        <div className="hb-card-header">
          <h3>Logs Recientes</h3>
        </div>
        <div className="hb-table-wrap">
          <table className="hb-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Mensaje</th>
                <th>Severidad</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#f0ede8' }}>
                    No hay logs disponibles
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.timestamp}</td>
                    <td>{log.message}</td>
                    <td>
                      {log.severity === 'ERROR' ? (
                        <span className="hb-badge hb-badge-red">{log.severity}</span>
                      ) : log.severity === 'WARNING' ? (
                        <span className="hb-badge">{log.severity}</span>
                      ) : (
                        <span className="hb-badge hb-badge-green">{log.severity}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deploy;






