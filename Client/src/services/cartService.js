import api from './api.js';

class CartService {
  // Get all cart items
  async getCartItems() {
    return await api.get('/cart');
  }

  // Get cart count
  async getCartCount() {
    return await api.get('/cart/count');
  }

  // Add item to cart
  async addToCart(item) {
    return await api.post('/cart', item);
  }

  // Update cart item quantity
  async updateCartItem(id, quantity) {
    return await api.put(`/cart/${id}`, { quantity });
  }

  // Remove item from cart
  async removeFromCart(id) {
    return await api.delete(`/cart/${id}`);
  }

  // Clear entire cart
  async clearCart() {
    return await api.delete('/cart');
  }

  // Increment quantity
  async incrementQuantity(id) {
    return await api.patch(`/cart/${id}/increment`);
  }

  // Decrement quantity
  async decrementQuantity(id) {
    return await api.patch(`/cart/${id}/decrement`);
  }
}

export default new CartService();
