// src/components/UI/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-white border-t-transparent rounded-full animate-spin mb-4`}></div>
      <p className="text-white text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;