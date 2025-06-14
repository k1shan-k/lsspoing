import React from 'react';
import { UserPlus, Info } from 'lucide-react';

interface SignupFormProps {
  onViewChange: (view: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onViewChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Demo Application</h2>
            <p className="mt-2 text-sm text-gray-600">
              This is a demo shopping cart application
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">Demo Account Only</h3>
                <p className="mt-1 text-sm text-blue-700">
                  This application uses DummyJSON for authentication. Please use the demo credentials provided on the login page to access the application.
                </p>
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-gray-600">Email: kminchelle@qq.com</p>
                  <p className="text-xs text-gray-600">Password: 0lelplR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-6">
            <button
              onClick={() => onViewChange('login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Go to Login
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a demonstration application showcasing a shopping cart with authentication, product browsing, wishlist, and cart functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;