import React from "react";
import "../../styles/hb.css";

const ProductoForm = () => {
  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h1 className="hb-page-title">Producto</h1>
        <p className="hb-page-subtitle">Registro de nuevo producto</p>
      </div>

      <form className="hb-form hb-form-grid">
        <div>
          <label>Nombre</label>
          <input type="text" className="hb-input" placeholder="Nombre del producto" />
        </div>
        <div>
          <label>Precio</label>
          <input type="number" className="hb-input" placeholder="Precio" step="0.01" />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" className="hb-input" placeholder="Stock" />
        </div>
        <div>
          <label>Categoría</label>
          <select className="hb-select">
            <option value="">Seleccionar</option>
            <option value="anillos">Anillos</option>
            <option value="collares">Collares</option>
            <option value="pulseras">Pulseras</option>
            <option value="aretes">Aretes</option>
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Descripción</label>
          <textarea className="hb-input" placeholder="Descripción del producto" rows="4"></textarea>
        </div>
        <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          <button type="submit" className="hb-btn">Guardar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;