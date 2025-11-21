import React from 'react';

const Card = ({ children, title, subtitle, className = '', headerAction, hover = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${hover ? 'hover:shadow-2xl transition-all duration-300 hover:-translate-y-2' : 'transition-shadow duration-300'} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 bg-linear-to-r from-gray-50 via-blue-50/30 to-indigo-50/30 border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && <h3 className="text-2xl font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1.5 font-medium">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
