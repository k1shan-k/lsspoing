import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Info, AlertCircle, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDemoCredentials } from '../services/auth';

interface LoginFormProps {
  onViewChange: (view: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const { login } = useAuth();
  const demoCredentials = getDemoCredentials();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        onViewChange('home');
      } else {
        setErrors({ form: result.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = (username: string, password: string) => {
    setFormData({ username, password });
    setErrors({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">Demo Accounts Available</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Use any of the demo credentials below to explore the application
                </p>
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  {showDemoCredentials ? 'Hide' : 'Show'} demo credentials
                </button>
              </div>
            </div>
            
            {showDemoCredentials && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {demoCredentials.slice(0, 5).map((cred, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded p-2 text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{cred.username}</div>
                      <div className="text-gray-600">{cred.password}</div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cred.username)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy username"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => useDemoCredentials(cred.username, cred.password)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <p className="text-sm text-red-600">{errors.form}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Try: Bret"
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Try: password123"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onViewChange('signup')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;