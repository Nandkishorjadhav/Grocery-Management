import React from 'react';

const Card = ({ children, title, subtitle, className = '', headerAction, hover = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${hover ? 'hover:shadow-lg transition-all duration-300 hover:-translate-y-1' : ''} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && <h3 className="text-xl font-bold text-gray-800 bg-clip-text">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
