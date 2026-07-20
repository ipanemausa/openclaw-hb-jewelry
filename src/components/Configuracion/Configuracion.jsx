import "../../styles/hb.css";

function Configuracion() {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h1 className="hb-page-title">Configuración del Sistema</h1>
        <p className="hb-page-subtitle">Administra las opciones generales de la aplicación</p>
      </div>

      <div className="hb-form">
        <div className="hb-form-grid">
          <label>Modelo Activo</label>
          <select className="hb-select">
            <option>Modelo Estándar v3</option>
            <option>Modelo Premium v2</option>
            <option>Modelo Experimental</option>
          </select>

          <label>Idioma</label>
          <select className="hb-select">
            <option>Español</option>
            <option>Inglés</option>
            <option>Portugués</option>
          </select>

          <label>Tema</label>
          <select className="hb-select">
            <option>Oscuro (predeterminado)</option>
            <option>Claro</option>
            <option>Contraste alto</option>
          </select>

          <label>Clave API Principal</label>
          <input type="password" className="hb-input" placeholder="Ingrese la clave API" />

          <label>Clave API Secundaria</label>
          <input type="password" className="hb-input" placeholder="Ingrese la clave secundaria" />

          <label>Región API</label>
          <select className="hb-select">
            <option>US-Este</option>
            <option>US-Oeste</option>
            <option>Europa</option>
            <option>Asia-Pacífico</option>
          </select>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="hb-btn">Guardar Configuración</button>
          <button className="hb-btn hb-btn-sm">Restablecer</button>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;





