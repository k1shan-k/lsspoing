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
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card fade-in-up">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon primary">
                  <LogIn />
                </div>
                <h2 className="h3 fw-bold text-dark mb-2">Welcome back</h2>
                <p className="text-muted">Sign in to your account to continue shopping</p>
              </div>

              {/* Demo Credentials Info */}
              <div className="demo-credentials">
                <div className="d-flex align-items-start">
                  <Info className="text-primary me-3 mt-1" size={20} />
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold text-primary mb-1">Demo Accounts Available</h6>
                    <p className="small text-muted mb-2">
                      Use any of the demo credentials below to explore the application
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                      className="btn btn-link p-0 text-primary text-decoration-underline small"
                    >
                      {showDemoCredentials ? 'Hide' : 'Show'} demo credentials
                    </button>
                  </div>
                </div>
                
                {showDemoCredentials && (
                  <div className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {demoCredentials.slice(0, 5).map((cred, index) => (
                      <div key={index} className="demo-credential-item">
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">{cred.username}</div>
                          <div className="text-muted small">{cred.password}</div>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cred.username)}
                            className="btn btn-sm btn-outline-secondary p-1"
                            title="Copy username"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => useDemoCredentials(cred.username, cred.password)}
                            className="btn btn-sm btn-primary px-2 py-1"
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
              <form onSubmit={handleSubmit}>
                {errors.form && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <AlertCircle size={16} className="me-2" />
                    <div>{errors.form}</div>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">Username</label>
                  <div className="position-relative">
                    <User className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`form-control form-control-custom ps-5 ${
                        errors.username ? 'form-control-error' : ''
                      }`}
                      placeholder="Try: Bret"
                    />
                  </div>
                  {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <div className="position-relative">
                    <Lock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control form-control-custom ps-5 pe-5 ${
                        errors.password ? 'form-control-error' : ''
                      }`}
                      placeholder="Try: password123"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 translate-middle-y end-0 me-3 p-0 border-0 bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-muted" size={20} />
                      ) : (
                        <Eye className="text-muted" size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-custom-primary w-100 py-3 mb-3"
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="loading-spinner me-2" style={{ width: '16px', height: '16px' }}></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onViewChange('signup')}
                      className="btn btn-link p-0 text-primary text-decoration-underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;