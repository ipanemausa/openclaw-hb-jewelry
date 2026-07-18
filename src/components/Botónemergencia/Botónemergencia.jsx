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
        backgroundColor: activo ? "#d4af6a" : "#555",
        color: "#1a1a1a",
        border: `2px solid ${activo ? "#d4af6a" : "#666"}`,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "1px",
        transition: "all 0.3s ease",
        cursor: activo ? "pointer" : "not-allowed",
        opacity: activo ? 1 : 0.6,
      }}
    >
      {texto}
    </button>
  );
};

export default BotonEmergencia;