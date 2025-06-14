import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { fetchProductById } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import LoadingSpinner from './LoadingSpinner';

interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productData = await fetchProductById(productId);
      setProduct(productData);
    } catch (err) {
      setError('Failed to load product details. Please try again.');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error || !product) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error || 'Product not found'}
          </div>
          <button
            onClick={onBack}
            className="btn btn-gradient-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="btn btn-outline-primary mb-4 d-flex align-items-center"
        >
          <ArrowLeft className="me-2" size={20} />
          Back to Products
        </button>

        <div className="card">
          <div className="card-body p-4">
            <div className="row g-4">
              {/* Product Images */}
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="ratio ratio-1x1 rounded overflow-hidden bg-light">
                    <img
                      src={product.images[selectedImage] || product.thumbnail}
                      alt={product.title}
                      className="img-fluid"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                {product.images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`btn p-0 border-0 flex-shrink-0 ${
                          selectedImage === index ? 'ring ring-primary' : ''
                        }`}
                        style={{ width: '80px', height: '80px' }}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="col-lg-6">
                <div className="d-flex flex-column h-100">
                  <div className="mb-3">
                    <h1 className="display-6 fw-bold text-dark mb-2">{product.title}</h1>
                    <p className="text-muted">{product.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.floor(product.rating) ? '' : 'star-empty'}
                          fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="h5 mb-0 fw-medium text-dark">
                      {product.rating}
                    </span>
                    <span className="text-muted">({Math.floor(Math.random() * 100) + 10} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="display-6 fw-bold text-dark">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="h4 text-muted text-decoration-line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="badge bg-danger fs-6">
                          {Math.round(product.discountPercentage)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h5 className="fw-semibold text-dark mb-2">Description</h5>
                    <p className="text-muted">{product.description}</p>
                  </div>

                  {/* Stock Status */}
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <span className="fw-medium text-dark">Stock:</span>
                    <span className={`badge ${
                      product.stock > 10 ? 'bg-success' : 
                      product.stock > 0 ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {product.stock > 10 ? 'In Stock' : 
                       product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fw-medium text-dark">Quantity:</span>
                    <div className="quantity-controls">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="quantity-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 mt-auto">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="btn btn-gradient-primary flex-grow-1 d-flex align-items-center justify-content-center py-3"
                    >
                      <ShoppingCart className="me-2" size={20} />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={handleWishlistToggle}
                      className={`btn py-3 px-4 ${
                        inWishlist
                          ? 'btn-danger'
                          : 'btn-outline-danger'
                      }`}
                    >
                      <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="border-top pt-4 mt-4">
                    <div className="row g-3 text-sm">
                      <div className="col-6">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Category:</span>
                          <span className="fw-medium text-dark text-capitalize">{product.category}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">SKU:</span>
                          <span className="fw-medium text-dark">#{product.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;