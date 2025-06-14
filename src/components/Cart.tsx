import React, { useState } from 'react';
import { ShoppingCart, LogIn, Package, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onViewChange: (view: string) => void;
}

const Cart: React.FC<CartProps> = ({ onViewChange }) => {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card text-center">
                <div className="card-body py-5">
                  <div className="auth-icon primary mb-4">
                    <ShoppingCart size={32} />
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Access Your Cart</h2>
                  <p className="text-muted mb-4">
                    Please log in to view and manage your shopping cart items.
                  </p>
                  <div className="d-grid gap-3">
                    <button
                      onClick={() => onViewChange('login')}
                      className="btn btn-gradient-primary btn-lg d-flex align-items-center justify-content-center"
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

  if (cartItems.length === 0) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card text-center">
                <div className="card-body py-5">
                  <div className="feature-icon success mb-4 mx-auto">
                    <Package size={32} />
                  </div>
                  <h1 className="display-6 fw-bold text-dark mb-3">Your Shopping Cart</h1>
                  <p className="text-muted mb-4">
                    Welcome back, {user?.firstName}! Your cart is currently empty.
                  </p>
                  <div className="bg-light rounded-3 p-4 mb-4 mx-auto" style={{ maxWidth: '300px' }}>
                    <ShoppingCart className="text-muted mb-3" size={48} />
                    <p className="text-muted small mb-0">
                      Start shopping to add items to your cart
                    </p>
                  </div>
                  <button
                    onClick={() => onViewChange('products')}
                    className="btn btn-gradient-primary btn-lg px-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <h1 className="display-6 fw-bold text-dark mb-4">Shopping Cart</h1>
        
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => {
                const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                
                return (
                  <div key={item.id} className="cart-item">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-3">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="img-fluid rounded"
                          style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                        />
                      </div>
                      
                      <div className="col-md-9">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <h5 className="fw-semibold text-dark mb-1 line-clamp-2">
                              {item.product.title}
                            </h5>
                            <p className="text-muted small mb-2">{item.product.brand}</p>
                            
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
                          
                          <div className="col-md-6">
                            <div className="d-flex align-items-center justify-content-between">
                              {/* Quantity Controls */}
                              <div className="quantity-controls">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="quantity-btn"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="quantity-btn"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="text-end mt-2">
                              <span className="h5 fw-semibold text-dark">
                                ${(discountedPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              {/* Delivery Address */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Delivery Address</h5>
                </div>
                <div className="card-body">
                  {isEditingAddress ? (
                    <div>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="form-control mb-3"
                        rows={3}
                        placeholder="Enter your delivery address"
                      />
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => setIsEditingAddress(false)}
                          className="btn btn-gradient-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setDeliveryAddress('');
                            setIsEditingAddress(false);
                          }}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted mb-3">
                        {deliveryAddress || 'No address provided'}
                      </p>
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        {deliveryAddress ? 'Edit Address' : 'Add Address'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax</span>
                    <span className="fw-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="h5 fw-bold text-dark">Total</span>
                    <span className="h5 fw-bold text-dark">${total.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="alert alert-primary small" role="alert">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                  
                  <button
                    disabled={!deliveryAddress}
                    className="btn btn-gradient-success w-100 d-flex align-items-center justify-content-center"
                  >
                    <CreditCard className="me-2" size={20} />
                    Pay Now
                  </button>
                  
                  {!deliveryAddress && (
                    <p className="text-danger small text-center mt-2 mb-0">
                      Please add a delivery address to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;