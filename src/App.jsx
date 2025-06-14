import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSelectedProductId(null);
    if (view !== 'products') {
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onViewChange={handleViewChange} />;
      case 'signup':
        return <SignupForm onViewChange={handleViewChange} />;
      case 'products':
      case 'mens':
      case 'womens':
      case 'girls':
      case 'boys':
      case 'beauty':
      case 'accessories':
      case 'others':
      case 'car':
        return (
          <ProductList
            category={currentView}
            searchQuery={searchQuery}
            onProductClick={handleProductClick}
          />
        );
      case 'product-details':
        return selectedProductId ? (
          <ProductDetails
            productId={selectedProductId}
            onBack={() => handleViewChange('products')}
          />
        ) : (
          <ProductList onProductClick={handleProductClick} />
        );
      case 'cart':
        return <Cart onViewChange={handleViewChange} />;
      case 'wishlist':
        return <Wishlist onViewChange={handleViewChange} onProductClick={handleProductClick} />;
      case 'home':
      default:
        return <Home onViewChange={handleViewChange} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-gray-50">
            {currentView !== 'login' && currentView !== 'signup' && (
              <Navigation
                currentView={currentView}
                onViewChange={handleViewChange}
                onSearch={handleSearch}
              />
            )}
            {renderView()}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;