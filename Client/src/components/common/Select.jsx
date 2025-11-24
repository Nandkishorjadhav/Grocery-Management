import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error,
  required = false,
  placeholder = 'Select an option',
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
        <select
          value={value}
          onChange={onChange}
          className={`form-select ${icon ? 'form-input-with-icon' : ''} ${error ? 'form-input-error' : ''} ${className}`.trim()}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default Select;
