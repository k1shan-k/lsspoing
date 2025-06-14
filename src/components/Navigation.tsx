import React, { useState } from 'react';
import { ShoppingCart, Heart, User, LogOut, Store, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch: (query: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onSearch }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = getCartItemsCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onViewChange('products');
    }
  };

  const mainNavigationItems = [
    { id: 'home', label: 'Home' },
  ];

  const categoryItems = [
    { id: 'products', label: 'All Products' },
    { id: 'mens', label: 'Mens' },
    { id: 'womens', label: 'Womens' },
    { id: 'girls', label: 'Girls' },
    { id: 'boys', label: 'Boys' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'others', label: 'Others' },
  ];

  const isProductsActive = ['products', 'mens', 'womens', 'girls', 'boys', 'beauty', 'accessories', 'others'].includes(currentView);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div className="container">
        {/* Brand */}
        <button 
          className="navbar-brand btn btn-link text-decoration-none p-0"
          onClick={() => onViewChange('home')}
        >
          <Store className="me-2" size={24} />
          <span className="fw-bold fs-4">ShopCart</span>
        </button>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation items */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Main Navigation */}
            {mainNavigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link btn btn-link text-decoration-none ${
                    currentView === item.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* Products Dropdown */}
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${
                  isProductsActive ? 'active' : ''
                }`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Products
              </button>
              <ul className="dropdown-menu">
                {categoryItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`dropdown-item ${currentView === item.id ? 'active' : ''}`}
                      onClick={() => {
                        onViewChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Search bar */}
          <form className="d-flex me-3 flex-grow-1" style={{ maxWidth: '400px' }} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Right side actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Wishlist */}
            <button
              className={`btn btn-link text-decoration-none position-relative ${
                currentView === 'wishlist' ? 'text-primary' : 'text-muted'
              }`}
              onClick={() => onViewChange('wishlist')}
            >
              <Heart size={20} />
              <span className="d-none d-sm-inline ms-1">Wishlist</span>
            </button>

            {/* Cart */}
            <button
              className={`btn btn-link text-decoration-none position-relative ${
                currentView === 'cart' ? 'text-primary' : 'text-muted'
              }`}
              onClick={() => onViewChange('cart')}
            >
              <ShoppingCart size={20} />
              <span className="d-none d-sm-inline ms-1">Cart</span>
              {cartItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User actions */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-none d-sm-flex align-items-center">
                  <img
                    src={user?.image || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=667eea&color=fff`}
                    alt="Profile"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <span className="text-muted small">
                    Hi, {user?.firstName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center"
                >
                  <LogOut size={16} className="me-1" />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button
                  onClick={() => onViewChange('login')}
                  className={`btn btn-outline-primary btn-sm ${
                    currentView === 'login' ? 'active' : ''
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onViewChange('signup')}
                  className={`btn btn-gradient-primary btn-sm ${
                    currentView === 'signup' ? 'active' : ''
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;