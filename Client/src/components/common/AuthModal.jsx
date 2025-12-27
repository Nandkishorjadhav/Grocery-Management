import { useState } from 'react';
import './AuthModal.css';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const AuthModal = () => {
  const { closeAuthModal, login } = useAuth();
  const [method, setMethod] = useState('email'); // 'email' or 'mobile'
  const [step, setStep] = useState('input'); // 'input' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: ''
  });
  const [userId, setUserId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setError('');
    setFormData({ ...formData, email: '', mobile: '', otp: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        method,
        name: formData.name,
        email: method === 'email' ? formData.email : undefined,
        mobile: method === 'mobile' ? formData.mobile : undefined
      };

      const response = await authService.initiateAuth(payload);

      if (response.success) {
        setUserId(response.userId);
        setIsNewUser(response.isNewUser);
        setStep('otp');
        startCountdown();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.verifyOTP({
        userId,
        otp: formData.otp
      });

      if (response.success) {
        login(response.token, response.user);
        closeAuthModal();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authService.resendOTP(userId);
      if (response.success) {
        setFormData({ ...formData, otp: '' });
        startCountdown();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal}>
          ×
        </button>

        {step === 'input' ? (
          <>
            <h2>Welcome to Grocery Management</h2>
            <p className="auth-subtitle">
              {isNewUser ? 'Create your account' : 'Login to continue'}
            </p>

            <div className="auth-method-toggle">
              <button
                className={method === 'email' ? 'active' : ''}
                onClick={() => handleMethodChange('email')}
              >
                Email
              </button>
              <button
                className={method === 'mobile' ? 'active' : ''}
                onClick={() => handleMethodChange('mobile')}
              >
                Mobile
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {method === 'email' ? (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>

            <p className="auth-info">
              We'll send you a one-time password (OTP) to verify your {method}
            </p>
          </>
        ) : (
          <>
            <h2>Enter OTP</h2>
            <p className="auth-subtitle">
              We've sent a 6-digit code to your {method}
              <br />
              <strong>
                {method === 'email' ? formData.email : formData.mobile}
              </strong>
            </p>

            <form onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit OTP"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="otp-actions">
              {countdown > 0 ? (
                <p className="resend-timer">Resend OTP in {countdown}s</p>
              ) : (
                <button
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
              <button className="back-btn" onClick={() => setStep('input')}>
                Change {method}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
