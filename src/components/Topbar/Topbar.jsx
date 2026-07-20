import "../../styles/hb.css";

const TopBar = () => {
  return (
    <div className="hb-page-header" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: '#1a1a1a',
      borderBottom: '1px solid #d4af6a'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="hb-page-title" style={{ color: '#d4af6a', margin: 0 }}>
          💎 HB Jewelry
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="hb-btn hb-btn-sm" style={{ 
            color: '#d4af6a', 
            background: 'transparent', 
            border: '1px solid #d4af6a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📊 Dashboard
          </button>
          <button className="hb-btn hb-btn-sm" style={{ 
            color: '#d4af6a', 
            background: 'transparent', 
            border: '1px solid #d4af6a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            💬 Chat
          </button>
          <button className="hb-btn hb-btn-sm" style={{ 
            color: '#d4af6a', 
            background: 'transparent', 
            border: '1px solid #d4af6a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📦 Productos
          </button>
          <button className="hb-btn hb-btn-sm" style={{ 
            color: '#d4af6a', 
            background: 'transparent', 
            border: '1px solid #d4af6a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            💰 Ventas
          </button>
        </div>
      </div>
      <div style={{ 
        color: '#f0ede8', 
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ color: '#d4af6a' }}>🏪 Tienda</span>
        <span style={{ color: '#f0ede8' }}>|</span>
        <span style={{ color: '#d4af6a' }}>👤 Admin</span>
      </div>
    </div>
  );
};

export default TopBar;



