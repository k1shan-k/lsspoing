import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Lock, Eye, EyeOff, UserPlus, Info } from 'lucide-react';

interface SignupFormProps {
  onViewChange: (view: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
    verifyPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Verify password validation
    if (!formData.verifyPassword) {
      newErrors.verifyPassword = 'Please verify your password';
    } else if (formData.password !== formData.verifyPassword) {
      newErrors.verifyPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Since DummyJSON doesn't support user registration, we'll show a message
      // In a real app, you would call your registration API here
      setErrors({ 
        form: 'Registration is not available with DummyJSON API. Please use the demo login credentials provided on the login page.' 
      });
    } catch (error) {
      setErrors({ form: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="auth-icon secondary">
            <UserPlus />
          </div>
          <h2 className="h3 fw-bold text-dark mb-2">Create your account</h2>
          <p className="text-muted">
            Join us and start shopping today
          </p>
        </div>

        {/* Info Section */}
        <div className="alert alert-primary d-flex align-items-start" role="alert">
          <Info className="me-2 mt-1" size={20} />
          <div>
            <h6 className="alert-heading mb-1">Demo Mode</h6>
            <p className="mb-2 small">
              This demo uses DummyJSON API which doesn't support user registration. 
              Please use the demo login credentials available on the login page.
            </p>
            <button
              type="button"
              onClick={() => onViewChange('login')}
              className="btn btn-sm btn-gradient-primary"
            >
              Go to Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="alert alert-danger" role="alert">
              {errors.form}
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label fw-medium">
                Full Name *
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <User size={20} />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                Email Address *
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={20} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label fw-medium">
              Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <MapPin size={20} />
              </span>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Enter your full address (optional)"
              />
            </div>
            {errors.address && (
              <div className="invalid-feedback d-block">
                {errors.address}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label fw-medium">
              Phone Number
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Phone size={20} />
              </span>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                placeholder="Enter your phone number (optional)"
              />
            </div>
            {errors.phoneNumber && (
              <div className="invalid-feedback d-block">
                {errors.phoneNumber}
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label fw-medium">
                Password *
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
                  placeholder="Create a password"
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

            <div className="col-md-6 mb-4">
              <label htmlFor="verifyPassword" className="form-label fw-medium">
                Verify Password *
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={20} />
                </span>
                <input
                  id="verifyPassword"
                  name="verifyPassword"
                  type={showVerifyPassword ? 'text' : 'password'}
                  value={formData.verifyPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.verifyPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                >
                  {showVerifyPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.verifyPassword && (
                <div className="invalid-feedback d-block">
                  {errors.verifyPassword}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gradient-secondary w-100 py-3 fw-semibold"
          >
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onViewChange('login')}
                className="btn btn-link p-0 text-decoration-none fw-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;