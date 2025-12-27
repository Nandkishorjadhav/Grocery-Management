import React, { useEffect, useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import './Cart.css';

const Cart = () => {
  const { cart, cartCount, removeFromCart, incrementCartItem, decrementCartItem, clearCart, fetchCart } = useGrocery();
  const [isLoading, setIsLoading] = useState(false);

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

  const totalAmount = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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

          <Card>
            <div className="cart-items-container">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
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
                      className="remove-btn"
                      onClick={() => handleRemove(item._id)}
                      disabled={isLoading}
                      title="Remove from cart"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal ({totalItems} items)</span>
                <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Delivery Charges</span>
                <span className="summary-value free">FREE</span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="checkout-actions">
                <Link to="/" style={{ flex: 1 }}>
                  <Button variant="outline" style={{ width: '100%' }}>
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="primary" style={{ flex: 1 }}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </Card>
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
