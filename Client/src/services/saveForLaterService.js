import api from './api.js';

class SaveForLaterService {
  // Get all save for later items
  async getSaveForLaterItems() {
    return await api.get('/saved-for-later');
  }

  // Add item to save for later
  async addToSaveForLater(item) {
    return await api.post('/saved-for-later', item);
  }

  // Remove item from save for later
  async removeFromSaveForLater(id) {
    return await api.delete(`/saved-for-later/${id}`);
  }

  // Move item from save for later to cart
  async moveToCart(id) {
    return await api.patch(`/saved-for-later/${id}/move-to-cart`);
  }

  // Clear all save for later items
  async clearSaveForLater() {
    return await api.delete('/saved-for-later');
  }
}

export default new SaveForLaterService();
