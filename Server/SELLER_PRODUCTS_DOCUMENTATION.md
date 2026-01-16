# Seller Products Database Documentation

## Overview
The Seller Products feature allows users to list their products for sale in a marketplace. All submissions require admin approval before being visible to buyers.

## Database Schema: SellerProduct

### Collection Name: `sellerproducts`

### Schema Structure

#### Seller Information
```javascript
{
  seller: ObjectId,              // Reference to User model
  sellerName: String,            // Seller's name
  sellerContact: {
    email: String,               // Seller's email
    mobile: String               // Seller's mobile
  }
}
```

#### Product Details
```javascript
{
  productName: String,           // Product name (required)
  category: String,              // Product category (required)
  description: String            // Product description (required)
}
```

#### Pricing
```javascript
{
  basePrice: Number,             // Base price without GST (required)
  gstPercentage: Number,         // GST rate: 0, 5, 12, 18, or 28 (default: 5)
  gstAmount: Number,             // Calculated GST amount
  finalPrice: Number             // Total price including GST
}
```

#### Stock Information
```javascript
{
  quantity: Number,              // Available quantity (required)
  unit: String                   // Unit: kg, g, l, ml, piece, dozen, pack (required)
}
```

#### Product Images
```javascript
{
  images: [{
    url: String,                 // Image URL (required)
    filename: String,            // Original filename
    uploadedAt: Date             // Upload timestamp
  }]
}
```

#### Additional Details
```javascript
{
  expiryDate: Date,              // Product expiry date (optional)
  brand: String,                 // Brand name (optional)
  origin: String                 // Origin/manufacturer (optional)
}
```

#### Status and Approval
```javascript
{
  status: String,                // 'pending', 'approved', 'rejected', 'sold', 'expired'
  approvedBy: ObjectId,          // Admin who approved
  approvedAt: Date,              // Approval timestamp
  rejectionReason: String        // Reason if rejected
}
```

#### Sales Information
```javascript
{
  views: Number,                 // Number of views (default: 0)
  inquiries: Number,             // Number of inquiries (default: 0)
  soldQuantity: Number,          // Quantity sold (default: 0)
  soldAt: Date,                  // Sale completion date
  soldTo: ObjectId               // Buyer reference
}
```

#### Timestamps
```javascript
{
  createdAt: Date,               // Creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

## API Endpoints

### Public Endpoints

#### Get Marketplace Products
```
GET /api/seller-products/marketplace
Query Params:
  - category: string
  - minPrice: number
  - maxPrice: number
  - search: string
  - page: number (default: 1)
  - limit: number (default: 12)
```

#### Get Product Details
```
GET /api/seller-products/:productId
```

#### Record Inquiry (Authenticated)
```
POST /api/seller-products/:productId/inquiry
```

### Seller Endpoints (Authenticated)

#### Create Product
```
POST /api/seller-products/
Body: {
  productName: string,
  category: string,
  description: string,
  basePrice: number,
  gstPercentage: number,
  quantity: number,
  unit: string,
  expiryDate?: date,
  brand?: string,
  origin?: string,
  images: array
}
```

#### Get My Products
```
GET /api/seller-products/my/products
Query Params:
  - status: string
  - category: string
  - page: number
  - limit: number
```

#### Update Product
```
PUT /api/seller-products/:productId
Body: (any updateable fields)
```

#### Delete Product
```
DELETE /api/seller-products/:productId
```

### Admin Endpoints

#### Get All Seller Products
```
GET /api/seller-products/admin/all
Query Params:
  - status: string
  - seller: string (sellerId)
  - category: string
  - page: number
  - limit: number
```

#### Approve Product
```
PUT /api/seller-products/admin/:productId/approve
```

#### Reject Product
```
PUT /api/seller-products/admin/:productId/reject
Body: {
  reason: string
}
```

## Model Methods

### Instance Methods

#### markAsSold(buyerId, quantity)
Marks product as sold and updates quantity
```javascript
await product.markAsSold(buyerId, quantity);
```

#### incrementViews()
Increments view count
```javascript
await product.incrementViews();
```

#### incrementInquiries()
Increments inquiry count
```javascript
await product.incrementInquiries();
```

### Static Methods

#### getBySellerFiltered(sellerId, filters)
Get products by seller with filters
```javascript
const products = await SellerProduct.getBySellerFiltered(sellerId, {
  status: 'approved',
  category: 'Vegetables'
});
```

#### getApprovedProducts(filters)
Get all approved products with filters
```javascript
const products = await SellerProduct.getApprovedProducts({
  category: 'Fruits',
  minPrice: 10,
  maxPrice: 100
});
```

## Indexes

The model has the following indexes for optimized queries:
- `{ seller: 1, status: 1 }` - For seller's product listing
- `{ category: 1, status: 1 }` - For category filtering
- `{ status: 1, createdAt: -1 }` - For status-based sorting
- Text index on `productName` and `description` - For search

## Middleware Hooks

### Pre-save Hook
Automatically calculates GST and final price when basePrice or gstPercentage changes:
```javascript
gstAmount = (basePrice * gstPercentage) / 100
finalPrice = basePrice + gstAmount
```

## Frontend Service

The frontend service (`sellerProductService.js`) provides the following methods:

```javascript
// Seller operations
createProduct(productData)
getMyProducts(params)
updateProduct(productId, updates)
deleteProduct(productId)

// Public operations
getMarketplaceProducts(params)
getProductById(productId)
recordInquiry(productId)

// Admin operations
getAllProducts(params)
approveProduct(productId)
rejectProduct(productId, reason)
uploadImage(file)
```

## Usage Example

### Creating a Product (Frontend)
```javascript
import sellerProductService from '../services/sellerProductService';

const createProduct = async () => {
  try {
    const productData = {
      productName: 'Fresh Tomatoes',
      category: 'Vegetables',
      description: 'Organic farm-fresh tomatoes',
      basePrice: 40,
      gstPercentage: 5,
      quantity: 100,
      unit: 'kg',
      images: [
        { url: 'https://...', filename: 'tomato1.jpg' }
      ]
    };

    const response = await sellerProductService.createProduct(productData);
    console.log('Product created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Fetching Marketplace Products
```javascript
const fetchProducts = async () => {
  try {
    const response = await sellerProductService.getMarketplaceProducts({
      category: 'Vegetables',
      page: 1,
      limit: 12
    });
    console.log('Products:', response.products);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Status Flow

```
pending → approved → (available for sale)
   ↓
rejected

approved → sold (when all quantity sold)
```

## Security & Authorization

- **Public**: Can view approved products
- **Authenticated Users**: Can create, view their own products, update/delete pending products
- **Sellers**: Cannot update approved or sold products
- **Admins**: Can approve/reject products, view all products with stats

## Notes

1. Products automatically calculate GST and final price on save
2. Only pending products can be updated by sellers
3. Sold products cannot be deleted
4. Views and inquiries are tracked automatically
5. Products with 0 quantity won't appear in marketplace
6. Expired status can be manually set or automated via cron job
