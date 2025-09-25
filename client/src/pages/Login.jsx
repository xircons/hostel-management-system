import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegisterInputChange = (field, value) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (loginData.userType === 'admin') {
        window.location.href = '/admin';
      } else {
        alert('Login successful! Welcome back.');
        window.location.href = '/';
      }
    }, 1500);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Registration successful! Welcome to pppwtk.');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <img src="/img/logo.jpg" alt="pppwtk" className="logo-image" />
        </div>

        {/* Header */}
        <div className="login-header">
          {activeTab === 'login' ? (
            <>
              <h1 className="login-title">Welcome Back !</h1>
              <p className="login-subtitle">Please enter your details</p>
            </>
          ) : (
            <>
              <h1 className="login-title">Create Account</h1>
              <p className="login-subtitle">Please enter your details to create an account</p>
            </>
          )}
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={loginData.email}
                onChange={(e) => handleLoginInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={loginData.password}
                onChange={(e) => handleLoginInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-lg ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerData.firstName}
                  onChange={(e) => handleRegisterInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerData.lastName}
                  onChange={(e) => handleRegisterInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={registerData.email}
                onChange={(e) => handleRegisterInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerData.password}
                  onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerData.confirmPassword}
                  onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={registerData.agreeToTerms}
                  onChange={(e) => handleRegisterInputChange('agreeToTerms', e.target.checked)}
                  required
                />
                <span className="checkmark"></span>
                I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-lg ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !registerData.agreeToTerms}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Sign Up/Sign In Link */}
        <div className="signup-section">
          <p className="signup-text">
            {activeTab === 'login' ? (
              <>
                Don't have an account? <button type="button" className="signup-link" onClick={() => setActiveTab('register')}>Sign Up</button>
              </>
            ) : (
              <>
                Already have an account? <button type="button" className="signup-link" onClick={() => setActiveTab('login')}>Sign In</button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
