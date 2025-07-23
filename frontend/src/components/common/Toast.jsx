import React from 'react';

const Toast = ({ show, message, type = 'info' }) => {
  if (!show) return null;
  let color = 'bg-blue-500';
  if (type === 'success') color = 'bg-green-500';
  if (type === 'error') color = 'bg-red-500';

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} ${color} text-white px-6 py-3 rounded shadow-lg animate-slide-in`}
      style={{ minWidth: 220 }}>
      {message}
    </div>
  );
};

export default Toast; 