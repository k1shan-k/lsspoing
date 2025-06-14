import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;