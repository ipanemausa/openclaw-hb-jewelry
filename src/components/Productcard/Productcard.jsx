import React from 'react';
import "../../styles/hb.css";

const ProductCard = ({ name, price }) => {
  return (
    <div className="hb-card">
      <div className="hb-card-header">
        <h3 className="hb-card-name" style={{ color: '#d4af6a' }}>{name}</h3>
        <p className="hb-card-price" style={{ color: '#d4af6a' }}>${price}</p>
      </div>
    </div>
  );
};

export default ProductCard;






