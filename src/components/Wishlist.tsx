import React from 'react';
import { Heart, LogIn, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface WishlistProps {
  onViewChange: (view: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onViewChange }) => {
  const { isAuthenticated, user } = useAuth();

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
                onClick={() => onViewChange('home')}
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
};

export default Wishlist;