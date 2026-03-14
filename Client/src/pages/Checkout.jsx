import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, fetchCart } = useGrocery();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [placedOrderSummary, setPlacedOrderSummary] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home' // home, work, other
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if cart is empty
    if ((!cart || cart.length === 0) && step !== 3) {
      navigate('/cart');
    }
    fetchCart();

    // Load saved address from localStorage
    const savedAddress = localStorage.getItem(`deliveryAddress_${user?._id}`);
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setDeliveryAddress(parsedAddress);
        setIsEditingAddress(false);
      } catch (e) {
        setIsEditingAddress(true);
      }
    } else {
      setIsEditingAddress(true);
    }
  }, [cart, step, navigate]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryCharges = 0; // FREE delivery
  const finalAmount = totalAmount + deliveryCharges;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};

    if (!deliveryAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!deliveryAddress.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(deliveryAddress.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!deliveryAddress.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryAddress.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!deliveryAddress.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!deliveryAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!deliveryAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToReview = () => {
    if (validateAddress()) {
      // Save address to localStorage
      localStorage.setItem(`deliveryAddress_${user?._id}`, JSON.stringify(deliveryAddress));
      setIsEditingAddress(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated()) {
      alert('Please login to place order');
      return;
    }

    // Check if user ID exists
    if (!user || !user._id) {
      alert('User information not found. Please login again.');
      navigate('/');
      return;
    }

    setIsProcessing(true);

    try {
      const generatedOrderId = `ORD${Date.now()}`;
      const payload = {
        orderId: generatedOrderId,
        items: cart.map((item) => ({
          productId: item.productId || item._id || item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          unit: item.unit,
          totalPrice: Number(item.totalPrice || (item.price * item.quantity) || 0)
        })),
        deliveryAddress,
        paymentMethod: 'cod',
        totalAmount,
        deliveryCharges,
        finalAmount
      };

      const response = await orderService.createOrder(payload);
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to place order');
      }

      setPlacedOrderSummary({ totalItems, finalAmount });
      setOrderId(response.order?.orderId || generatedOrderId);

      await clearCart();
      await fetchCart();

      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="checkout-steps">
      <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
        <div className="step-circle">
          {step > 1 ? '✓' : '1'}
        </div>
        <span className="step-label">Delivery Address</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
        <div className="step-circle">
          {step > 2 ? '✓' : '2'}
        </div>
        <span className="step-label">Review Order</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>
        <div className="step-circle">3</div>
        <span className="step-label">Confirmation</span>
      </div>
    </div>
  );

  const renderAddressForm = () => (
    <div className="checkout-content">
      <div className="checkout-main">
        <Card>
          <div className="section-header">
            <div>
              <h2 className="section-title">📍 Delivery Address</h2>
              <p className="section-subtitle">Enter your delivery details</p>
            </div>
            {!isEditingAddress && deliveryAddress.addressLine1 && (
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => setIsEditingAddress(true)}
              >
                Edit Address
              </Button>
            )}
          </div>

          {!isEditingAddress && deliveryAddress.addressLine1 ? (
            <div className="saved-address-display">
              <div className="address-detail">
                <strong>{deliveryAddress.fullName}</strong>
              </div>
              <div className="address-detail">
                {deliveryAddress.mobile} | {deliveryAddress.email}
              </div>
              <div className="address-detail">
                {deliveryAddress.addressLine1}
                {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`}
              </div>
              <div className="address-detail">
                {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
              </div>
              {deliveryAddress.landmark && (
                <div className="address-detail">
                  Landmark: {deliveryAddress.landmark}
                </div>
              )}
              <div className="address-type-badge">
                {deliveryAddress.addressType === 'home' && '🏠'}
                {deliveryAddress.addressType === 'work' && '💼'}
                {deliveryAddress.addressType === 'other' && '📍'}
                {' '}{deliveryAddress.addressType.charAt(0).toUpperCase() + deliveryAddress.addressType.slice(1)}
              </div>
            </div>
          ) : (
          <form className="address-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={deliveryAddress.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={deliveryAddress.mobile}
                  onChange={handleInputChange}
                  className={errors.mobile ? 'error' : ''}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={deliveryAddress.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1 *</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={deliveryAddress.addressLine1}
                onChange={handleInputChange}
                className={errors.addressLine1 ? 'error' : ''}
                placeholder="House No., Building Name"
              />
              {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={deliveryAddress.addressLine2}
                onChange={handleInputChange}
                placeholder="Road Name, Area, Colony (Optional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={deliveryAddress.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Enter city"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={deliveryAddress.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                  placeholder="Enter state"
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={deliveryAddress.pincode}
                  onChange={handleInputChange}
                  className={errors.pincode ? 'error' : ''}
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="landmark">Landmark (Optional)</label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={deliveryAddress.landmark}
                onChange={handleInputChange}
                placeholder="Nearby landmark for easy location"
              />
            </div>

            <div className="form-group">
              <label>Address Type *</label>
              <div className="address-type-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={deliveryAddress.addressType === 'home'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">🏠</span>
                    Home
                  </span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="work"
                    checked={deliveryAddress.addressType === 'work'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">💼</span>
                    Work
                  </span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="other"
                    checked={deliveryAddress.addressType === 'other'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">📍</span>
                    Other
                  </span>
                </label>
              </div>
            </div>
          </form>
          )}
        </Card>
      </div>

      <div className="checkout-sidebar">
        <Card>
          <h3 className="sidebar-title">Order Summary</h3>
          <div className="order-summary">
            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-text">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleContinueToReview}
            icon="→"
          >
            Continue to Review
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderReviewOrder = () => (
    <div className="checkout-content">
      <div className="checkout-main">
        <Card>
          <h2 className="section-title">📋 Review Your Order</h2>
          
          {/* Delivery Address */}
          <div className="review-section">
            <div className="review-header">
              <h3>📍 Delivery Address</h3>
              <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
            </div>
            <div className="address-display">
              <p className="address-name">{deliveryAddress.fullName}</p>
              <p className="address-line">{deliveryAddress.addressLine1}</p>
              {deliveryAddress.addressLine2 && <p className="address-line">{deliveryAddress.addressLine2}</p>}
              <p className="address-line">{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
              {deliveryAddress.landmark && <p className="address-landmark">Landmark: {deliveryAddress.landmark}</p>}
              <p className="address-contact">
                <span>📱 {deliveryAddress.mobile}</span>
                <span>📧 {deliveryAddress.email}</span>
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="review-section">
            <h3>🛒 Order Items ({cart.length})</h3>
            <div className="review-items">
              {cart.map((item) => (
                <div key={item._id} className="review-item">
                  <div className="review-item-info">
                    <span className="review-item-emoji">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="review-item-name">{item.name}</p>
                      <p className="review-item-meta">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <p className="review-item-price">₹{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="review-section">
            <h3>💳 Payment Method</h3>
            <div className="payment-method">
              <div className="payment-option selected">
                <span className="payment-icon">💵</span>
                <div>
                  <p className="payment-title">Cash on Delivery</p>
                  <p className="payment-desc">Pay when you receive your order</p>
                </div>
                <span className="payment-check">✓</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="checkout-sidebar">
        <Card>
          <h3 className="sidebar-title">Payment Summary</h3>
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="free-text">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Payable</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>
            <div className="cod-info">
              <p>💵 Cash on Delivery</p>
              <small>Pay ₹{finalAmount.toFixed(2)} when delivered</small>
            </div>
          </div>
          <div className="checkout-buttons">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => setStep(1)}
            >
              ← Back
            </Button>
            <Button 
              variant="success" 
              fullWidth 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              icon={isProcessing ? "⏳" : "✓"}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="confirmation-container">
      <Card>
        <div className="confirmation-content">
          <div className="success-animation">
            <div className="maintenance-icon">✅</div>
          </div>
          <h1 className="confirmation-title">Order Placed Successfully</h1>
          <p className="confirmation-subtitle">Your order has been confirmed and will be processed shortly.</p>

          {orderId && (
            <div className="confirmation-details">
              <div className="detail-item">
                <div>
                  <div className="detail-title">Order ID</div>
                  <div className="detail-value">{orderId}</div>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <div className="detail-title">Items</div>
                  <div className="detail-value">{placedOrderSummary?.totalItems ?? totalItems}</div>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <div className="detail-title">Total Paid</div>
                  <div className="detail-value">₹{(placedOrderSummary?.finalAmount ?? finalAmount).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="maintenance-message">
            <p>🎉 Thank you! Your order has been placed successfully.</p>
            <p>📦 We are preparing your products for dispatch.</p>
            <p>📱 You will receive updates via SMS and email.</p>
          </div>

          <div className="confirmation-actions">
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              icon="🏠"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/cart')}
              icon="🛒"
            >
              Back to Cart
            </Button>
          </div>

          <div className="confirmation-note">
            <p>Need help? Contact support with your Order ID.</p>
          </div>
        </div>
      </Card>
    </div>
  );

  if ((!cart || cart.length === 0) && step !== 3) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="checkout-page fade-in">
      <Breadcrumb />
      
      <div className="page-header">
        <h1 className="page-title gradient-text">🛍️ Checkout</h1>
        <p className="page-subtitle">Complete your order in a few simple steps</p>
      </div>

      {renderStepIndicator()}

      {step === 1 && renderAddressForm()}
      {step === 2 && renderReviewOrder()}
      {step === 3 && renderConfirmation()}
    </div>
  );
};

const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Vegetables': '🥬',
    'Fruits': '🍎',
    'Dairy': '🥛',
    'Bakery': '🍞',
    'Snacks': '🍿',
    'Beverages': '🥤',
    'Meat': '🥩',
    'Grains': '🌾',
    'default': '🛒'
  };
  return emojiMap[category] || emojiMap['default'];
};

export default Checkout;
