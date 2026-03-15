const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const getToken = () => localStorage.getItem('token');

class CartService {
  // Get all cart items
  async getCartItems() {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get cart items');
    return result;
  }

  // Get cart count
  async getCartCount() {
    const response = await fetch(`${API_BASE_URL}/cart/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get cart count');
    return result;
  }

  // Add item to cart
  async addToCart(item) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(item),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add to cart');
    return result;
  }

  // Update cart item quantity
  async updateCartItem(id, quantity) {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ quantity }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update cart item');
    return result;
  }

  // Remove item from cart
  async removeFromCart(id) {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to remove from cart');
    return result;
  }

  // Clear entire cart
  async clearCart() {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to clear cart');
    return result;
  }

  // Increment quantity
  async incrementQuantity(id) {
    const response = await fetch(`${API_BASE_URL}/cart/${id}/increment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to increment quantity');
    return result;
  }

  // Decrement quantity
  async decrementQuantity(id) {
    const response = await fetch(`${API_BASE_URL}/cart/${id}/decrement`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to decrement quantity');
    return result;
  }
}

export default new CartService();
