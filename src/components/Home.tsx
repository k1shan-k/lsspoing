import React from 'react';
import { Store, ShoppingBag, Heart, Users, Award, Truck, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onViewChange: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8">
                <h1 className="display-1 fw-bold mb-4 fade-in-up">
                  Welcome to{' '}
                  <span className="text-gradient">ShopCart</span>
                  {isAuthenticated && (
                    <div className="display-6 fw-normal mt-3 opacity-75 slide-in-right">
                      Hello, {user?.name}! 👋
                    </div>
                  )}
                </h1>
                <p className="lead mb-5 opacity-90 slide-in-left" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                  Discover premium products, curate your perfect wishlist, and enjoy a seamless shopping experience designed just for you.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center scale-in">
                  <button
                    onClick={() => onViewChange('products')}
                    className="btn btn-light btn-lg px-5 py-3"
                  >
                    <Store className="me-2" size={20} />
                    Explore Products
                  </button>
                  <button
                    onClick={() => onViewChange('cart')}
                    className="btn btn-outline-light btn-lg px-5 py-3"
                  >
                    <ShoppingBag className="me-2" size={20} />
                    View Cart
                  </button>
                  <button
                    onClick={() => onViewChange('wishlist')}
                    className="btn btn-outline-light btn-lg px-5 py-3"
                  >
                    <Heart className="me-2" size={20} />
                    My Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-4">
              Why Choose <span className="text-gradient">ShopCart</span>?
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Experience the future of online shopping with our cutting-edge features and exceptional service
            </p>
          </div>
          
          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon primary mb-4">
                  <Store />
                </div>
                <h4 className="fw-bold mb-3">Premium Products</h4>
                <p className="text-muted mb-0">
                  Curated selection of high-quality products from trusted brands worldwide, ensuring you get the best value for your money.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon success mb-4">
                  <Truck />
                </div>
                <h4 className="fw-bold mb-3">Lightning Fast Delivery</h4>
                <p className="text-muted mb-0">
                  Quick and reliable shipping to your doorstep with real-time tracking and express delivery options available.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon secondary mb-4">
                  <Award />
                </div>
                <h4 className="fw-bold mb-3">Award-Winning Service</h4>
                <p className="text-muted mb-0">
                  24/7 customer support and hassle-free returns for your complete peace of mind and satisfaction.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon primary mb-4">
                  <Shield />
                </div>
                <h4 className="fw-bold mb-3">Secure Shopping</h4>
                <p className="text-muted mb-0">
                  Advanced encryption and secure payment processing to protect your personal and financial information.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon success mb-4">
                  <Star />
                </div>
                <h4 className="fw-bold mb-3">Top Rated</h4>
                <p className="text-muted mb-0">
                  Consistently rated 5 stars by our customers for quality, service, and overall shopping experience.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card h-100">
                <div className="feature-icon secondary mb-4">
                  <Zap />
                </div>
                <h4 className="fw-bold mb-3">Smart Features</h4>
                <p className="text-muted mb-0">
                  AI-powered recommendations, smart search, and personalized shopping experience tailored to your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <div className="container py-4">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="h2 fw-bold mb-2">1M+</div>
              <p className="mb-0 opacity-75">Happy Customers</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="h2 fw-bold mb-2">50K+</div>
              <p className="mb-0 opacity-75">Premium Products</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="h2 fw-bold mb-2">99.9%</div>
              <p className="mb-0 opacity-75">Uptime Guarantee</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="h2 fw-bold mb-2">24/7</div>
              <p className="mb-0 opacity-75">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="container py-5 text-center text-white">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="display-4 fw-bold mb-4">Ready to Start Shopping?</h2>
                <p className="lead mb-5 opacity-90">
                  Join over 1 million satisfied customers and discover your next favorite product today
                </p>
                <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
                  <button
                    onClick={() => onViewChange('signup')}
                    className="btn btn-light btn-lg px-5 py-3"
                  >
                    <Users className="me-2" size={20} />
                    Create Free Account
                  </button>
                  <button
                    onClick={() => onViewChange('login')}
                    className="btn btn-outline-light btn-lg px-5 py-3"
                  >
                    Sign In
                  </button>
                </div>
                <p className="small mt-4 opacity-75">
                  No credit card required • Free forever • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;