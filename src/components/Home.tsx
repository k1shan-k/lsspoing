import React from 'react';
import { Store, ShoppingBag, Heart, Users, Award, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onViewChange: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content text-center py-5">
            <h1 className="display-3 fw-bold mb-4 fade-in-up">
              Welcome to ShopCart
              {isAuthenticated && (
                <div className="display-6 fw-normal mt-3 opacity-75">
                  Hello, {user?.firstName}!
                </div>
              )}
            </h1>
            <p className="lead mb-5 opacity-90 fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover amazing products, create your wishlist, and enjoy seamless shopping experience
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => onViewChange('cart')}
                className="btn btn-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
              >
                <ShoppingBag className="me-2" size={20} />
                View Cart
              </button>
              <button
                onClick={() => onViewChange('wishlist')}
                className="btn btn-outline-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
              >
                <Heart className="me-2" size={20} />
                My Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">Why Choose ShopCart?</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Experience the best in online shopping with our premium features and exceptional service
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card fade-in-up">
                <div className="feature-icon primary">
                  <Store size={32} />
                </div>
                <h3 className="h4 fw-semibold text-dark mb-3">Premium Products</h3>
                <p className="text-muted">
                  Curated selection of high-quality products from trusted brands worldwide
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon success">
                  <Truck size={32} />
                </div>
                <h3 className="h4 fw-semibold text-dark mb-3">Fast Delivery</h3>
                <p className="text-muted">
                  Quick and reliable shipping to your doorstep with real-time tracking
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon warning">
                  <Award size={32} />
                </div>
                <h3 className="h4 fw-semibold text-dark mb-3">Best Service</h3>
                <p className="text-muted">
                  24/7 customer support and hassle-free returns for your peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-5" style={{ background: 'var(--secondary-gradient)' }}>
          <div className="container text-center text-white">
            <div className="py-4">
              <h2 className="display-5 fw-bold mb-4">Ready to Start Shopping?</h2>
              <p className="lead mb-5 opacity-90 mx-auto" style={{ maxWidth: '600px' }}>
                Join thousands of satisfied customers and discover your next favorite product
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <button
                  onClick={() => onViewChange('signup')}
                  className="btn btn-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
                >
                  <Users className="me-2" size={20} />
                  Create Account
                </button>
                <button
                  onClick={() => onViewChange('login')}
                  className="btn btn-outline-light btn-lg px-4 py-3"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;