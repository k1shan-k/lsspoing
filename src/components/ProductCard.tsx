import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card card h-100" onClick={() => onProductClick(product.id)} style={{ cursor: 'pointer' }}>
      <div className="position-relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image card-img-top w-100"
        />
        {product.discountPercentage > 0 && (
          <div className="product-badge">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title line-clamp-2 mb-2 text-dark fw-semibold">
          {product.title}
        </h5>
        
        <p className="card-text text-muted small line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="d-flex align-items-center mb-3">
          <div className="rating-stars me-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? '' : 'star-empty'}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-muted small">({product.rating})</span>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="h5 mb-0 fw-bold text-dark">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-muted text-decoration-line-through small">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <span className="badge bg-light text-dark">
            Stock: {product.stock}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="btn btn-gradient-primary w-100 d-flex align-items-center justify-content-center mt-auto"
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} className="me-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;