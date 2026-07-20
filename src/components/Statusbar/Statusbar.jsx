import "../../styles/hb.css";

const StatusBar = () => {
  return (
    <div className="hb-status-bar" style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#1a1a1a', 
      color: '#d4af6a', 
      padding: '5px 15px', 
      fontSize: '12px', 
      borderTop: '1px solid #d4af6a',
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      width: '100%', 
      zIndex: 1000
    }}>
      <span>Estado: Conectado</span>
      <span>Modelo: HB-2025</span>
      <span>Versión: 2.1.3</span>
    </div>
  );
};

export default StatusBar;


