import React from 'react';

const FormButton = ({ children, onClick, type = 'button', disabled, fullWidth }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      ${fullWidth ? 'w-full' : ''}
      ${disabled ? 'bg-blue-200 text-white cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
  >
    {children}
  </button>
);

export default FormButton; 