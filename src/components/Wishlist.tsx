import React from 'react';
import { Heart, LogIn, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface WishlistProps {
  onViewChange: (view: string) => void;
  onProductClick: (productId: number) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onViewChange, onProductClick }) => {
  const { isAuthenticated, user } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card text-center">
                <div className="card-body py-5">
                  <div className="auth-icon secondary mb-4">
                    <Heart size={32} />
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Access Your Wishlist</h2>
                  <p className="text-muted mb-4">
                    Please log in to view and manage your favorite items.
                  </p>
                  <div className="d-grid gap-3">
                    <button
                      onClick={() => onViewChange('login')}
                      className="btn btn-gradient-secondary btn-lg d-flex align-items-center justify-content-center"
                    >
                      <LogIn className="me-2" size={20} />
                      Log In
                    </button>
                    <button
                      onClick={() => onViewChange('signup')}
                      className="btn btn-outline-primary btn-lg"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card text-center">
                <div className="card-body py-5">
                  <div className="feature-icon warning mb-4 mx-auto">
                    <Star size={32} />
                  </div>
                  <h1 className="display-6 fw-bold text-dark mb-3">Your Wishlist</h1>
                  <p className="text-muted mb-4">
                    Hello {user?.firstName}! Save your favorite items here.
                  </p>
                  <div className="bg-light rounded-3 p-4 mb-4 mx-auto" style={{ maxWidth: '300px' }}>
                    <Heart className="text-muted mb-3" size={48} />
                    <p className="text-muted small mb-0">
                      Your wishlist is empty. Start browsing to add items you love!
                    </p>
                  </div>
                  <button
                    onClick={() => onViewChange('products')}
                    className="btn btn-gradient-secondary btn-lg px-4"
                  >
                    Discover Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="display-6 fw-bold text-dark">My Wishlist</h1>
          <span className="badge bg-primary fs-6">{wishlistItems.length} items</span>
        </div>

        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
          {wishlistItems.map((item) => {
            const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
            
            return (
              <div key={item.id} className="col">
                <div className="wishlist-item h-100">
                  <div className="position-relative mb-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="img-fluid rounded w-100"
                      style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => onProductClick(item.product.id)}
                    />
                    {item.product.discountPercentage > 0 && (
                      <div className="product-badge">
                        -{Math.round(item.product.discountPercentage)}%
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-column h-100">
                    <h5 
                      className="fw-semibold text-dark mb-2 line-clamp-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onProductClick(item.product.id)}
                    >
                      {item.product.title}
                    </h5>
                    
                    <p className="text-muted small line-clamp-2 mb-3">
                      {item.product.description}
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <div className="rating-stars me-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(item.product.rating) ? '' : 'star-empty'}
                            fill={i < Math.floor(item.product.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="text-muted small">({item.product.rating})</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="h5 mb-0 fw-bold text-dark">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {item.product.discountPercentage > 0 && (
                          <span className="text-muted text-decoration-line-through small">
                            ${item.product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          addToCart(item.product);
                          removeFromWishlist(item.product.id);
                        }}
                        className="btn btn-gradient-primary flex-grow-1 d-flex align-items-center justify-content-center"
                      >
                        <ShoppingCart size={16} className="me-1" />
                        Move to Cart
                      </button>
                      
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="btn btn-outline-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;