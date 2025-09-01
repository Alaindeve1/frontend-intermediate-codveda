// src/components/UI/ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-red-300">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-red-100 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;