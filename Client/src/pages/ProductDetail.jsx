import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory } = useGrocery();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Find the product by ID
    const foundProduct = inventory.find(item => item.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(0); // Reset selected image
      setSelectedQuantity(1); // Reset quantity
      
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

  const getProductImage = (category, name) => {
    // Product specific images
    const productImages = {
      'Fresh Red Apples': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
      'Organic Bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
      'Sweet Oranges': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
      'Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      'Farm Fresh Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      'Cheddar Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
      'Fresh Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      'Organic Tomatoes': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      'Baby Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
      'Fresh Broccoli': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
      'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
      'Dark Chocolate Bar': 'https://images.unsplash.com/photo-1606312619070-d48b4cac5bf2?w=400'
    };

    if (productImages[name]) {
      return productImages[name];
    }

    // Category fallback images
    const categoryImages = {
      'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
      'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      'Snacks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
      'Beverages': 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400',
      'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
      'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
    };
    return categoryImages[category] || categoryImages['default'];
  };

  // Generate multiple image variants for gallery
  const getProductImages = (category, name) => {
    const mainImage = getProductImage(category, name);
    return [
      mainImage,
      mainImage + '&sat=-20', // Slightly different variant
      mainImage + '&hue=20',
      mainImage + '&con=10'
    ];
  };

  const getDiscount = () => {
    return Math.floor(Math.random() * 30) + 10; // 10-40% discount
  };

  const originalPrice = Math.round(product.price * 1.3);
  const discount = getDiscount();
  const isLowStock = product.quantity <= product.minStock;
  const productImages = getProductImages(product.category, product.name);

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
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="product-large-image"
              />
              {discount > 0 && (
                <div className="product-discount-badge">{discount}% OFF</div>
              )}
              {isLowStock && (
                <div className="product-stock-badge">Only {product.quantity} left!</div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="product-thumbnails">
              {productImages.map((imgUrl, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={imgUrl} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
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
                    <img 
                      src={getProductImage(item.category, item.name)} 
                      alt={item.name}
                      loading="lazy"
                    />
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
