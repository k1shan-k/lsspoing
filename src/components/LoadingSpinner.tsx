import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="text-center text-white">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h4 className="fw-semibold">Loading...</h4>
        <p className="opacity-75">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;