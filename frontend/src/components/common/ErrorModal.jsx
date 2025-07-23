import React from 'react';

const ErrorModal = ({ show, message, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border-t-4 border-blue-500">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors font-semibold">OK</button>
      </div>
    </div>
  );
};

export default ErrorModal; 