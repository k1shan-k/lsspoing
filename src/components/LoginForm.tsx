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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { login } = useAuth();
  const demoCredentials = getDemoCredentials();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const success = await login(formData.username.trim(), formData.password.trim());
      
      if (success) {
        onViewChange('home');
      } else {
        setErrors({ form: 'Invalid username or password. Please check your credentials and try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ form: 'An error occurred during login. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const fillDemoCredentials = (credentials: { username: string; password: string }) => {
    setFormData(credentials);
    setErrors({});
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="auth-icon primary">
            <LogIn />
          </div>
          <h2 className="h3 fw-bold text-dark mb-2">Welcome back</h2>
          <p className="text-muted">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Demo Section */}
        <div className="demo-section">
          <div className="d-flex align-items-center mb-3">
            <Info className="me-2" size={20} />
            <h6 className="mb-0 fw-semibold text-primary">Demo Accounts Available</h6>
          </div>
          <p className="small text-muted mb-3">
            Use these test credentials to explore the application:
          </p>
          
          {demoCredentials.map((cred, index) => (
            <div key={index} className="demo-credential">
              <div>
                <div className="small fw-semibold">Account {index + 1}</div>
                <div className="small text-muted">
                  <strong>Username:</strong> {cred.username}
                </div>
                <div className="small text-muted">
                  <strong>Password:</strong> {cred.password}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => copyToClipboard(`${cred.username}:${cred.password}`, `demo-${index}`)}
                  title="Copy credentials"
                >
                  {copiedField === `demo-${index}` ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-gradient-primary"
                  onClick={() => fillDemoCredentials(cred)}
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
              {errors.form}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-medium">
              Username
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <User size={20} />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <div className="invalid-feedback d-block">
                {errors.username}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-medium">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={20} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gradient-primary w-100 py-3 fw-semibold"
          >
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onViewChange('signup')}
                className="btn btn-link p-0 text-decoration-none fw-semibold"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;