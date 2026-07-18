import React from "react";
import "../../styles/hb.css";

const BotonEmergencia = ({ onClick, texto = "Emergencia", activo = true, sm = false }) => {
  const handleClick = () => {
    if (activo && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`hb-btn ${sm ? "hb-btn-sm" : ""} ${activo ? "" : "hb-btn-disabled"}`}
      onClick={handleClick}
      disabled={!activo}
      style={{
        cursor: activo ? "pointer" : "not-allowed",
        opacity: activo ? 1 : 0.6,
      }}
    >
      {texto}
    </button>
  );
};

export default BotonEmergencia;