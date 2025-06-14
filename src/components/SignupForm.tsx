import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword, validateUsername } from '../services/auth';

interface SignupFormProps {
  onViewChange: (view: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, errors: [] as string[] });
  const [usernameValidation, setUsernameValidation] = useState({ isValid: false, errors: [] as string[] });

  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }

    if (name === 'firstName') {
      setUsernameValidation(validateUsername(value));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Name is required';
    } else if (!usernameValidation.isValid) {
      newErrors.firstName = usernameValidation.errors[0];
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await signup({
        username: formData.firstName.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });
      
      if (result.success) {
        onViewChange('login');
      } else {
        setErrors({ form: result.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldValidationClass = (fieldName: string, isValid?: boolean) => {
    if (errors[fieldName]) return 'is-invalid';
    if (formData[fieldName as keyof typeof formData] && isValid !== false) return 'is-valid';
    return '';
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card fade-in-up">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="auth-icon secondary">
                  <UserPlus />
                </div>
                <h2 className="display-6 fw-bold mb-2">Create Account</h2>
                <p className="text-muted">Join our community and start your shopping journey</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {errors.form && (
                  <div className="alert alert-danger d-flex align-items-center border-0 shadow-sm" role="alert">
                    <AlertCircle size={18} className="me-2 flex-shrink-0" />
                    <div>{errors.form}</div>
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <User className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-control ps-5 ${getFieldValidationClass('firstName', usernameValidation.isValid)}`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`form-control ${getFieldValidationClass('lastName')}`}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <Mail className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ps-5 ${getFieldValidationClass('email')}`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <Lock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ps-5 pe-5 ${getFieldValidationClass('password', passwordValidation.isValid)}`}
                      placeholder="At least 6 characters"
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
                  {formData.password && !passwordValidation.isValid && passwordValidation.errors.length > 0 && (
                    <div className="mt-2">
                      {passwordValidation.errors.map((error, index) => (
                        <div key={index} className="small text-danger">• {error}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <Lock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ps-5 pe-5 ${getFieldValidationClass('confirmPassword')}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 translate-middle-y end-0 me-3 p-0 border-0 bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-muted" size={20} />
                      ) : (
                        <Eye className="text-muted" size={20} />
                      )}
                    </button>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <CheckCircle className="position-absolute top-50 translate-middle-y text-success" style={{ right: '50px' }} size={20} />
                    )}
                  </div>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || !usernameValidation.isValid}
                  className="btn btn-secondary w-100 py-3 mb-4"
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="loading-spinner me-2" style={{ width: '18px', height: '18px' }}></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <UserPlus size={18} className="me-2" />
                      Create Account
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onViewChange('login')}
                      className="btn btn-link p-0 text-primary text-decoration-none fw-semibold"
                    >
                      Sign in here
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

export default SignupForm;