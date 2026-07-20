import React, { useState } from "react";
import "../../styles/hb.css";

const ClienteForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    canalPreferido: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente registrado:", formData);
  };

  return (
    <div className="hb-page">
      <div className="hb-page-header">
        <h2 className="hb-page-title">Registro de Cliente</h2>
        <p className="hb-page-subtitle">Complete los datos del nuevo cliente</p>
      </div>

      <form className="hb-form" onSubmit={handleSubmit}>
        <div className="hb-form-grid">
          <div>
            <label>Nombre Completo</label>
            <input
              className="hb-input"
              type="text"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              className="hb-input"
              type="tel"
              name="telefono"
              placeholder="Ej: 3001234567"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              className="hb-input"
              type="email"
              name="email"
              placeholder="Ej: cliente@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Canal Preferido</label>
            <select
              className="hb-select"
              name="canalPreferido"
              value={formData.canalPreferido}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un canal</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Teléfono">Teléfono</option>
              <option value="Redes Sociales">Redes Sociales</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button type="submit" className="hb-btn">
            Registrar Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;