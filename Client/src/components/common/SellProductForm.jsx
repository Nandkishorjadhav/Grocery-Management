import React, { useState } from 'react';
import './SellProductForm.css';

const SellProductForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    basePrice: '',
    gstPercent: '5',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    'Fruits', 'Vegetables', 'Dairy', 'Bakery', 
    'Meat', 'Snacks', 'Beverages', 'Grains', 'Other'
  ];

  const units = ['kg', 'g', 'L', 'ml', 'piece', 'dozen', 'packet'];
  const gstOptions = ['0', '5', '12', '18', '28'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'Each image must be less than 5MB' }));
        return false;
      }
      return true;
    });

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const calculateFinalPrice = () => {
    const base = parseFloat(formData.basePrice) || 0;
    const gst = parseFloat(formData.gstPercent) || 0;
    const gstAmount = (base * gst) / 100;
    return (base + gstAmount).toFixed(2);
  };

  const calculateGSTAmount = () => {
    const base = parseFloat(formData.basePrice) || 0;
    const gst = parseFloat(formData.gstPercent) || 0;
    return ((base * gst) / 100).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Valid price is required';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const finalPrice = calculateFinalPrice();
    const gstAmount = calculateGSTAmount();

    onSubmit({
      ...formData,
      finalPrice: parseFloat(finalPrice),
      gstAmount: parseFloat(gstAmount)
    });
  };

  return (
    <div className="modal-overlay-sell" onClick={onClose}>
      <div className="modal-content-sell" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-sell">
          <h2>🛒 Sell Your Product</h2>
          <button className="modal-close-sell" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="sell-product-form">
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Fresh Organic Apples"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="3"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* Base Price */}
            <div className="form-group">
              <label>Base Price (₹) *</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.basePrice ? 'error' : ''}
              />
              {errors.basePrice && <span className="error-text">{errors.basePrice}</span>}
            </div>

            {/* GST Percent */}
            <div className="form-group">
              <label>GST % *</label>
              <select
                name="gstPercent"
                value={formData.gstPercent}
                onChange={handleInputChange}
              >
                {gstOptions.map(gst => (
                  <option key={gst} value={gst}>{gst}%</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                step="0.01"
                min="0"
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>

            {/* Unit */}
            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Expiry Date */}
            <div className="form-group full-width">
              <label>Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Price Breakdown */}
          {formData.basePrice && (
            <div className="price-breakdown">
              <h3>💰 Price Breakdown</h3>
              <div className="price-row">
                <span>Base Price:</span>
                <span>₹{parseFloat(formData.basePrice).toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>GST ({formData.gstPercent}%):</span>
                <span>₹{calculateGSTAmount()}</span>
              </div>
              <div className="price-row total">
                <span>Final Price:</span>
                <span>₹{calculateFinalPrice()}</span>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="form-group full-width">
            <label>Product Images * (Max 5, up to 5MB each)</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="product-images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="product-images" className="upload-label">
                📸 Click to upload images
              </label>
              {errors.images && <span className="error-text">{errors.images}</span>}
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              🚀 List Product for Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProductForm;
