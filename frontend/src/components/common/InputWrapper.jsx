import React from 'react';

const InputWrapper = ({ label, error, children, required }) => (
  <div className="mb-4">
    <label className="block text-blue-700 font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

export default InputWrapper; 