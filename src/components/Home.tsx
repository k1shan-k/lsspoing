import React from 'react';
import { Store, ShoppingBag, Heart, Users, Award, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onViewChange: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 className="display-3 fw-bold mb-4 fade-in-up">
                  Welcome to ShopCart
                  {isAuthenticated && (
                    <div className="h2 fw-normal mt-3 opacity-75">
                      Hello, {user?.name}!
                    </div>
                  )}
                </h1>
                <p className="lead mb-5 opacity-90 slide-in-right">
                  Discover amazing products, create your wishlist, and enjoy seamless shopping experience
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button
                    onClick={() => onViewChange('cart')}
                    className="btn btn-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    <ShoppingBag className="me-2" size={20} />
                    View Cart
                  </button>
                  <button
                    onClick={() => onViewChange('wishlist')}
                    className="btn btn-outline-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    <Heart className="me-2" size={20} />
                    My Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">Why Choose ShopCart?</h2>
            <p className="lead text-muted">
              Experience the best in online shopping with our premium features and exceptional service
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon primary">
                  <Store />
                </div>
                <h4 className="fw-bold mb-3">Premium Products</h4>
                <p className="text-muted">
                  Curated selection of high-quality products from trusted brands worldwide
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon success">
                  <Truck />
                </div>
                <h4 className="fw-bold mb-3">Fast Delivery</h4>
                <p className="text-muted">
                  Quick and reliable shipping to your doorstep with real-time tracking
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon secondary">
                  <Award />
                </div>
                <h4 className="fw-bold mb-3">Best Service</h4>
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
        <div className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="container py-5 text-center text-white">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="display-5 fw-bold mb-4">Ready to Start Shopping?</h2>
                <p className="lead mb-5 opacity-90">
                  Join thousands of satisfied customers and discover your next favorite product
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button
                    onClick={() => onViewChange('signup')}
                    className="btn btn-light btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    <Users className="me-2" size={20} />
                    Create Account
                  </button>
                  <button
                    onClick={() => onViewChange('login')}
                    className="btn btn-outline-light btn-lg px-4 py-3"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;