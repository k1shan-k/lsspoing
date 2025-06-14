import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Info, AlertCircle, Copy, CheckCircle } from 'lucide-react';
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="auth-icon primary">
            <LogIn />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account to continue your shopping journey</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="demo-section">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <div className="bg-blue-600 rounded-full flex items-center justify-center w-8 h-8">
                <Info size={16} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h6 className="font-semibold text-blue-600 mb-2">Demo Accounts Available</h6>
              <p className="text-sm text-gray-600 mb-3">
                Explore the application with pre-configured demo accounts. No registration required!
              </p>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showDemoCredentials ? 'Hide' : 'Show'} Demo Credentials
              </button>
            </div>
          </div>
          
          {showDemoCredentials && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {demoCredentials.slice(0, 6).map((cred, index) => (
                  <div key={index} className="demo-credential">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{cred.username}</div>
                      <div className="text-gray-600 text-sm">{cred.password}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cred.username, `username-${index}`)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                        title="Copy username"
                      >
                        {copiedField === `username-${index}` ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => useDemoCredentials(cred.username, cred.password)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle size={18} className="text-red-600 mr-2 flex-shrink-0" />
              <div className="text-red-600 text-sm">{errors.form}</div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Try: Bret"
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Try: password123"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                ) : (
                  <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2" style={{ width: '18px', height: '18px' }}></div>
                Signing in...
              </div>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Sign In
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onViewChange('signup')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;