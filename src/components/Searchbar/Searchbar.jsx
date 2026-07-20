import "../../styles/hb.css";

const SearchBar = () => {
  return (
    <div className="hb-page" style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a2a2a', borderBottom: '1px solid #d4af6a' }}>
      <input
        type="text"
        placeholder="Buscar productos, clientes, órdenes..."
        className="hb-input"
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid #d4af6a',
          backgroundColor: '#1a1a1a',
          color: '#f0ede8',
          fontSize: '0.9rem'
        }}
      />
      <span style={{ marginLeft: '0.5rem', color: '#d4af6a', fontSize: '1.2rem' }}>🔍</span>
    </div>
  );
};

export default SearchBar;



