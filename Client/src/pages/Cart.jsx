import React, { useEffect, useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    cartCount, 
    removeFromCart, 
    incrementCartItem, 
    decrementCartItem, 
    clearCart, 
    fetchCart,
    addToSaveForLater,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    updateCartOrderNotes,
    saveForLater
  } = useGrocery();
  
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      setIsLoading(true);
      try {
        await removeFromCart(id);
      } catch (error) {
        alert('Failed to remove item');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleIncrement = async (id) => {
    setIsLoading(true);
    try {
      await incrementCartItem(id);
    } catch (error) {
      alert('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (id) => {
    setIsLoading(true);
    try {
      await decrementCartItem(id);
    } catch (error) {
      alert('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForLater = async (item) => {
    try {
      setIsLoading(true);
      await addToSaveForLater(item);
      await removeFromCart(item._id);
      alert('Item moved to Save for Later');
    } catch (error) {
      alert('Failed to save item for later');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear the entire cart?')) {
      setIsLoading(true);
      try {
        await clearCart();
      } catch (error) {
        alert('Failed to clear cart');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setIsLoading(true);
      setCouponError('');
      const result = await applyCoupon(couponCode, totalAmount);
      setCouponCode('');
      alert(`Coupon applied! Discount: ₹${result.discount.toFixed(2)}`);
    } catch (error) {
      setCouponError(error.response?.data?.error || 'Invalid coupon code');
      setCouponCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
  };

  const handleUpdateOrderNotes = async (itemId, notes) => {
    try {
      setIsLoading(true);
      await updateCartOrderNotes(itemId, notes);
    } catch (error) {
      alert('Failed to update notes');
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalAmount = totalAmount - discountAmount;

  return (
    <div className="fade-in">
      <Breadcrumb />
      
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">🛒 Shopping Cart</h1>
          <p className="page-subtitle">Review and manage your cart items</p>
        </div>
        {cart.length > 0 && (
          <Button 
            onClick={handleClearCart} 
            icon="🗑️"
            variant="danger"
            disabled={isLoading}
          >
            Clear Cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <Card>
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your cart is empty</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start adding products to your cart</p>
            <Link to="/">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="stats-grid mb-6">
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Items</p>
                <p className="stat-value">{totalItems}</p>
              </div>
              <div className="stat-icon stat-icon-blue">📦</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Cart Items</p>
                <p className="stat-value">{cart.length}</p>
              </div>
              <div className="stat-icon stat-icon-green">🛒</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Amount</p>
                <p className="stat-value">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="stat-icon stat-icon-purple">💰</div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Average Price</p>
                <p className="stat-value">₹{cart.length > 0 ? (totalAmount / cart.length).toFixed(2) : '0.00'}</p>
              </div>
              <div className="stat-icon stat-icon-orange">📊</div>
            </div>
          </div>

          <div className="cart-main-layout">
            <div className="cart-items-section">
              <Card>
                <div className="cart-items-container">
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="cart-item-row">
                        <div className="cart-item-info">
                          <div className="cart-item-emoji">{getCategoryEmoji(item.category)}</div>
                          <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <span className="cart-item-category">{item.category}</span>
                            <div className="cart-item-meta">
                              <span className="cart-item-price">₹{item.price} / {item.unit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="cart-item-actions">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => handleDecrement(item._id)}
                              disabled={isLoading}
                            >
                              −
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => handleIncrement(item._id)}
                              disabled={isLoading}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="cart-item-total">
                            <span className="total-label">Total:</span>
                            <span className="total-value">₹{item.totalPrice.toFixed(2)}</span>
                          </div>

                          <button 
                            className="save-for-later-btn"
                            onClick={() => handleSaveForLater(item)}
                            disabled={isLoading}
                            title="Save for later"
                          >
                            💾
                          </button>

                          <button 
                            className="remove-btn"
                            onClick={() => handleRemove(item._id)}
                            disabled={isLoading}
                            title="Remove from cart"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Order Notes for individual item */}
                      <div className="cart-item-notes">
                        <button 
                          className="notes-toggle"
                          onClick={() => setExpandedNotes(prev => ({ ...prev, [item._id]: !prev[item._id] }))}
                        >
                          📝 {expandedNotes[item._id] ? 'Hide Notes' : 'Add Notes'}
                        </button>
                        {expandedNotes[item._id] && (
                          <textarea
                            className="item-notes-input"
                            placeholder="Add special instructions for this item..."
                            value={item.orderNotes || ''}
                            onChange={(e) => handleUpdateOrderNotes(item._id, e.target.value)}
                            maxLength="200"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="cart-summary-section">
              <Card className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>

                {/* Coupon Section */}
                <div className="coupon-section">
                  <h4 className="coupon-title">💳 Discount Code</h4>
                  {appliedCoupon ? (
                    <div className="coupon-applied">
                      <div className="coupon-badge">
                        <span className="coupon-code">{appliedCoupon.code}</span>
                        <span className="coupon-discount">-₹{appliedCoupon.discount.toFixed(2)}</span>
                      </div>
                      <button 
                        className="remove-coupon-btn"
                        onClick={handleRemoveCoupon}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="coupon-input-group">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        disabled={isLoading}
                        maxLength="20"
                        className="coupon-input"
                      />
                      <button 
                        className="apply-coupon-btn"
                        onClick={handleApplyCoupon}
                        disabled={isLoading || !couponCode.trim()}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="coupon-error">⚠️ {couponError}</p>}
                </div>

                {/* Order Notes Section */}
                <div className="order-notes-section">
                  <h4 className="notes-title">📋 Order Notes</h4>
                  <textarea
                    className="order-notes-input"
                    placeholder="Add any special instructions or requests for your entire order..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    maxLength="500"
                  />
                  <p className="notes-char-count">{orderNotes.length}/500 characters</p>
                </div>

                {/* Summary Details */}
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Delivery Charges</span>
                    <span className="summary-value free">FREE</span>
                  </div>
                  {appliedCoupon && (
                    <div className="summary-row discount">
                      <span className="summary-label">Discount</span>
                      <span className="summary-value discount">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-value">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-actions">
                  <Link to="/" style={{ width: '100%' }}>
                    <Button variant="outline" style={{ width: '100%' }}>
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link to="/checkout" style={{ width: '100%' }}>
                    <Button variant="primary" style={{ width: '100%' }}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Save for Later Section */}
              {saveForLater && saveForLater.length > 0 && (
                <Card className="saved-items-card">
                  <h4 className="saved-items-title">💾 Saved for Later ({saveForLater.length})</h4>
                  <p className="saved-items-hint">Items you've saved to view later</p>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
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

export default Cart;
