import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { signup } from '../services/auth';

interface SignupFormProps {
  onViewChange: (view: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
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
    setErrors({});
    
    try {
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      });

      if (result.success) {
        // Show success message and redirect to home
        onViewChange('home');
      } else {
        setErrors({ form: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
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

        {/* Success Info */}
        <div className="alert alert-success d-flex align-items-start" role="alert">
          <CheckCircle className="me-2 mt-1" size={20} />
          <div>
            <h6 className="alert-heading mb-1">Registration Available!</h6>
            <p className="mb-0 small">
              Create your account and start shopping immediately. All data is stored locally for this demo.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
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
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="username" className="form-label fw-medium">
                Username *
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
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <div className="invalid-feedback d-block">
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
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
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="invalid-feedback d-block">
                {errors.email}
              </div>
            )}
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
                autoComplete="street-address"
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
                autoComplete="tel"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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