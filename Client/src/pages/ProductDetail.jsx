import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory } = useGrocery();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    // Find the product by ID
    const foundProduct = inventory.find(item => item.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products from same category
      const related = inventory
        .filter(item => item.id !== parseInt(id) && item.category === foundProduct.category)
        .slice(0, 6);
      
      // If not enough related products in same category, add from other categories
      if (related.length < 6) {
        const additional = inventory
          .filter(item => item.id !== parseInt(id) && item.category !== foundProduct.category)
          .slice(0, 6 - related.length);
        setRelatedProducts([...related, ...additional]);
      } else {
        setRelatedProducts(related);
      }
    } else {
      navigate('/');
    }
  }, [id, inventory, navigate]);

  if (!product) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">⏳</div>
        <p>Loading product...</p>
      </div>
    );
  }

  const getProductImage = (category) => {
    const imageMap = {
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Snacks': '🍿',
      'Beverages': '🥤',
      'Meat': '🥩',
      'default': '🛒'
    };
    return imageMap[category] || imageMap['default'];
  };

  const getDiscount = () => {
    return Math.floor(Math.random() * 30) + 10; // 10-40% discount
  };

  const originalPrice = Math.round(product.price * 1.3);
  const discount = getDiscount();
  const isLowStock = product.quantity <= product.minStock;

  const handleAddToCart = () => {
    alert(`Added ${selectedQuantity} ${product.unit} of ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${selectedQuantity} ${product.unit} of ${product.name}`);
  };

  return (
    <div className="product-detail-page fade-in">
      <Breadcrumb />
      
      <div className="product-detail-container">
        {/* Product Main Section */}
        <div className="product-detail-grid">
          {/* Left - Product Image */}
          <div className="product-image-section">
            <div className="product-main-image">
              <span className="product-large-emoji">{getProductImage(product.category)}</span>
              {discount > 0 && (
                <div className="product-discount-badge">{discount}% OFF</div>
              )}
              {isLowStock && (
                <div className="product-stock-badge">Only {product.quantity} left!</div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="product-thumbnails">
              <div className="thumbnail active">{getProductImage(product.category)}</div>
              <div className="thumbnail">{getProductImage(product.category)}</div>
              <div className="thumbnail">{getProductImage(product.category)}</div>
              <div className="thumbnail">{getProductImage(product.category)}</div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="product-info-section">
            <div className="product-breadcrumb-tags">
              <span className="product-tag">{product.category}</span>
              <span className="product-tag fresh">✓ Fresh</span>
              {product.quantity > product.minStock * 2 && (
                <span className="product-tag in-stock">In Stock</span>
              )}
            </div>

            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="rating-text">4.5 (128 reviews)</span>
            </div>

            <div className="product-pricing">
              <div className="current-price">₹{product.price}</div>
              <div className="original-price">₹{originalPrice}</div>
              <div className="discount-text">{discount}% off</div>
            </div>

            <div className="product-highlights">
              <h3>Product Highlights</h3>
              <ul>
                <li>✓ Premium quality {product.category.toLowerCase()}</li>
                <li>✓ Fresh and handpicked</li>
                <li>✓ Delivered in 30 minutes</li>
                <li>✓ 100% quality guarantee</li>
                {product.expiryDate && (
                  <li>✓ Best before: {new Date(product.expiryDate).toLocaleDateString()}</li>
                )}
              </ul>
            </div>

            <div className="product-quantity-section">
              <label>Quantity ({product.unit})</label>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                >
                  −
                </button>
                <input 
                  type="number" 
                  className="qty-input"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.quantity}
                />
                <button 
                  className="qty-btn"
                  onClick={() => setSelectedQuantity(Math.min(product.quantity, selectedQuantity + 1))}
                >
                  +
                </button>
              </div>
              <span className="qty-available">Available: {product.quantity} {product.unit}</span>
            </div>

            <div className="product-actions">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleAddToCart}
                icon="🛒"
              >
                Add to Cart
              </Button>
              <Button 
                variant="success" 
                fullWidth 
                onClick={handleBuyNow}
                icon="⚡"
              >
                Buy Now
              </Button>
            </div>

            <div className="product-delivery-info">
              <div className="delivery-item">
                <span className="delivery-icon">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>Delivery in 30 minutes</p>
                </div>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <p>7 days return policy</p>
                </div>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">✓</span>
                <div>
                  <strong>Quality Assured</strong>
                  <p>100% fresh guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description-section">
          <h2>Product Description</h2>
          <p>
            {product.name} is a premium quality product from the {product.category} category. 
            We ensure the freshest produce delivered straight to your doorstep. Each item is 
            carefully selected and quality-checked to meet our high standards.
          </p>
          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Category:</span>
              <span className="spec-value">{product.category}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Unit:</span>
              <span className="spec-value">{product.unit}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Minimum Stock:</span>
              <span className="spec-value">{product.minStock} {product.unit}</span>
            </div>
            {product.expiryDate && (
              <div className="spec-item">
                <span className="spec-label">Best Before:</span>
                <span className="spec-value">{new Date(product.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <p className="related-subtitle">You might also like these products</p>
            
            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    <span className="related-emoji">{getProductImage(item.category)}</span>
                    <div className="related-discount">{Math.floor(Math.random() * 30) + 10}% OFF</div>
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name">{item.name}</h3>
                    <span className="related-product-category">{item.category}</span>
                    <div className="related-product-price">
                      <span className="related-price-current">₹{item.price}</span>
                      <span className="related-price-original">₹{Math.round(item.price * 1.3)}</span>
                    </div>
                    <button className="related-add-btn">Add to Cart</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
