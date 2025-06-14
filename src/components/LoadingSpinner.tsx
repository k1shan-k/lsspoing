import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center position-relative"
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}
    >
      {/* Background Pattern */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cpattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 50 0 L 0 0 0 50' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="text-center text-white position-relative">
        <div className="mb-4">
          <div 
            className="loading-spinner mx-auto"
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              borderLeft: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
        <h3 className="fw-bold mb-3">Loading ShopCart</h3>
        <p className="opacity-75 mb-0">Preparing your shopping experience...</p>
        
        {/* Loading dots animation */}
        <div className="d-flex justify-content-center mt-3">
          <div className="d-flex gap-2">
            <div 
              className="bg-white rounded-circle"
              style={{
                width: '8px',
                height: '8px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            <div 
              className="bg-white rounded-circle"
              style={{
                width: '8px',
                height: '8px',
                animation: 'pulse 1.5s ease-in-out 0.2s infinite'
              }}
            />
            <div 
              className="bg-white rounded-circle"
              style={{
                width: '8px',
                height: '8px',
                animation: 'pulse 1.5s ease-in-out 0.4s infinite'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;