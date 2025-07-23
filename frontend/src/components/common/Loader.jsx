import React from 'react';

const Loader = ({ size = 10, overlay = false }) => {
  const spinner = (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-t-4 border-b-4 border-blue-500 border-solid`}></div>
  );
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default Loader; 