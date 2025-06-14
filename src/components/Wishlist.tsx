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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Your Wishlist</h2>
            <p className="text-gray-600 mb-6">
              Please log in to view and manage your favorite items.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => onViewChange('login')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Log In
              </button>
              <button
                onClick={() => onViewChange('signup')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
              <p className="text-gray-600 mb-8">
                Hello {user?.name}! Save your favorite items here.
              </p>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Your wishlist is empty. Start browsing to add items you love!
                  </p>
                </div>
                <button
                  onClick={() => onViewChange('products')}
                  className="w-full px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                >
                  Discover Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlistItems.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
            
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => onProductClick(item.product.id)}
                  />
                  {item.product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      -{Math.round(item.product.discountPercentage)}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => onProductClick(item.product.id)}
                  >
                    {item.product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.product.description}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({item.product.rating})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      {item.product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        addToCart(item.product);
                        removeFromWishlist(item.product.id);
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Move to Cart
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.product.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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