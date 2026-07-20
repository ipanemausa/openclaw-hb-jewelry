import "../../styles/hb.css";

const QuickActions = () => {
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 999 }}>
      <button className="hb-btn" title="Nuevo Producto" style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', padding: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d4af6a', color: '#1a1a1a', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
        <span role="img" aria-label="producto">📦</span>
      </button>
      <button className="hb-btn" title="Nueva Venta" style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', padding: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d4af6a', color: '#1a1a1a', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
        <span role="img" aria-label="venta">🛒</span>
      </button>
      <button className="hb-btn" title="Nueva Orden" style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', padding: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d4af6a', color: '#1a1a1a', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
        <span role="img" aria-label="orden">📋</span>
      </button>
      <button className="hb-btn" title="Nuevo Cliente" style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', padding: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d4af6a', color: '#1a1a1a', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
        <span role="img" aria-label="cliente">👤</span>
      </button>
    </div>
  );
};

export default QuickActions;



