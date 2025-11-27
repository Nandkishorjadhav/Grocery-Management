import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false,
  className = '',
  icon = null,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && (
          <div className="form-input-icon">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${icon ? 'form-input-with-icon' : ''} ${error ? 'form-input-error' : ''} ${className}`.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="form-error">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
