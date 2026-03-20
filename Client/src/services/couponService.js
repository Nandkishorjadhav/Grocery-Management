import api from './api.js';

class CouponService {
  // Get all active coupons
  async getActiveCoupons() {
    return await api.get('/coupons');
  }

  // Validate coupon code
  async validateCoupon(code, totalAmount) {
    return await api.post('/coupons/validate', { code, totalAmount });
  }

  // Create coupon (admin only)
  async createCoupon(couponData) {
    return await api.post('/coupons', couponData);
  }

  // Update coupon (admin only)
  async updateCoupon(id, couponData) {
    return await api.put(`/coupons/${id}`, couponData);
  }

  // Delete coupon (admin only)
  async deleteCoupon(id) {
    return await api.delete(`/coupons/${id}`);
  }
}

export default new CouponService();
