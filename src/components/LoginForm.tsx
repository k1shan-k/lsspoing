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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card fade-in-up">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon primary">
                  <LogIn />
                </div>
                <h2 className="display-6 fw-bold mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to your account to continue your shopping journey</p>
              </div>

              {/* Demo Credentials Info */}
              <div className="demo-section">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <Info size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-primary mb-2">Demo Accounts Available</h6>
                    <p className="small text-muted mb-3">
                      Explore the application with pre-configured demo accounts. No registration required!
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      {showDemoCredentials ? 'Hide' : 'Show'} Demo Credentials
                    </button>
                  </div>
                </div>
                
                {showDemoCredentials && (
                  <div className="mt-4" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    <div className="row g-2">
                      {demoCredentials.slice(0, 6).map((cred, index) => (
                        <div key={index} className="col-12">
                          <div className="demo-credential">
                            <div className="flex-grow-1">
                              <div className="fw-semibold small text-dark">{cred.username}</div>
                              <div className="text-muted small">{cred.password}</div>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(cred.username, `username-${index}`)}
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                title="Copy username"
                              >
                                {copiedField === `username-${index}` ? (
                                  <CheckCircle size={14} className="text-success" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => useDemoCredentials(cred.username, cred.password)}
                                className="btn btn-sm btn-primary"
                              >
                                Use
                              </button>
                            </div>
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
                  <div className="alert alert-danger d-flex align-items-center border-0 shadow-sm" role="alert">
                    <AlertCircle size={18} className="me-2 flex-shrink-0" />
                    <div>{errors.form}</div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="position-relative">
                    <User className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`form-control ps-5 ${
                        errors.username ? 'is-invalid' : formData.username ? 'is-valid' : ''
                      }`}
                      placeholder="Try: Bret"
                    />
                  </div>
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="position-relative">
                    <Lock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ps-5 pe-5 ${
                        errors.password ? 'is-invalid' : formData.password ? 'is-valid' : ''
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
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-100 py-3 mb-4"
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="loading-spinner me-2" style={{ width: '18px', height: '18px' }}></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <LogIn size={18} className="me-2" />
                      Sign In
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onViewChange('signup')}
                      className="btn btn-link p-0 text-primary text-decoration-none fw-semibold"
                    >
                      Create one here
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