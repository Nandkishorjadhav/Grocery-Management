import React from 'react';

const Card = ({ children, title, subtitle, className = '', headerAction, hover = false }) => {
  return (
    <div className={`card ${hover ? 'hoverable' : ''} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
