import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onViewChange={setCurrentView} />;
      case 'signup':
        return <SignupForm onViewChange={setCurrentView} />;
      case 'cart':
        return <Cart onViewChange={setCurrentView} />;
      case 'wishlist':
        return <Wishlist onViewChange={setCurrentView} />;
      case 'home':
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {currentView !== 'login' && currentView !== 'signup' && (
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
        )}
        {renderView()}
      </div>
    </AuthProvider>
  );
}

export default App;