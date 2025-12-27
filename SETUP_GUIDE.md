# 🛒 Grocery Management System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas URI)
- npm or yarn

---

## 📦 Installation Steps

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### 2. Setup Backend Server

```bash
# Navigate to Server directory
cd Server

# Install dependencies (if not already installed)
npm install

# Seed the database with initial products
npm run seed

# Start the development server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 3. Setup Frontend Client

Open a new terminal:

```bash
# Navigate to Client directory
cd Client

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## ✅ Verify Installation

1. **Check Backend**: Visit http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"Grocery Management API is running"}`

2. **Check Database**: 
   ```bash
   # In MongoDB shell or Compass
   use grocery_management
   db.inventories.count()
   ```
   - Should return: 24 products

3. **Check Frontend**: Visit http://localhost:5173
   - Home page should display 24 products

---

## 🔑 Environment Variables

### Server/.env
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/grocery_management
JWT_SECRET=your_jwt_secret_key_here
```

### Client/.env (Optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Available Scripts

### Backend (Server/)
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with initial data
```

### Frontend (Client/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎯 Features to Test

1. **Home Page**
   - Browse all products
   - Filter by category
   - Add products to cart
   - See cart count in navbar

2. **Cart Page**
   - View all cart items
   - Increment/decrement quantities
   - Remove items
   - See total amount
   - Cart persists in database

3. **Inventory Page**
   - View all inventory items
   - Add new products
   - Edit existing products
   - Delete products
   - Search and filter

4. **Dashboard**
   - View statistics
   - Low stock alerts
   - Expiring items alerts

5. **Reports**
   - Category distribution
   - Inventory analytics
   - Top value items

---

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct URI
- Check if port 5000 is not already in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure VITE_API_URL is correct

### Database is empty
- Run `npm run seed` in Server directory
- Check MongoDB connection string

### Cart not updating
- Check browser console for API errors
- Verify backend is connected to database
- Try clearing browser cache

---

## 📱 API Endpoints

### Inventory
- `GET /api/inventory` - Get all products
- `POST /api/inventory` - Create product
- `PUT /api/inventory/:id` - Update product
- `DELETE /api/inventory/:id` - Delete product

### Cart
- `GET /api/cart` - Get cart items
- `GET /api/cart/count` - Get cart count
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `PATCH /api/cart/:id/increment` - Increment quantity
- `PATCH /api/cart/:id/decrement` - Decrement quantity
- `DELETE /api/cart` - Clear cart

### Shopping List
- `GET /api/shopping-list` - Get shopping list
- `POST /api/shopping-list` - Add item
- `PUT /api/shopping-list/:id` - Update item
- `DELETE /api/shopping-list/:id` - Delete item
- `PATCH /api/shopping-list/:id/toggle` - Toggle purchased

---

## 🎉 Success!

Your Grocery Management System should now be fully operational!

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: MongoDB (grocery_management)

Happy coding! 🚀
