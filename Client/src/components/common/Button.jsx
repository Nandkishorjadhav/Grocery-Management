import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  icon = null,
  ...props 
}) => {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transform';
  
  const variants = {
    primary: 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-300/50',
    secondary: 'bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-300/50',
    success: 'bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-300/50',
    danger: 'bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-300/50',
    warning: 'bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white focus:ring-yellow-300/50',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-300/50 bg-white',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
