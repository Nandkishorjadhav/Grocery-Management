# Grocery Management System - Server

Node.js/Express backend API for the Grocery Management System.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/grocery_management
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Inventory
- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get item by ID
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/expiring-soon` - Get expiring items

### Shopping List
- `GET /api/shopping-list` - Get all items
- `GET /api/shopping-list/:id` - Get item by ID
- `POST /api/shopping-list` - Create item
- `PUT /api/shopping-list/:id` - Update item
- `DELETE /api/shopping-list/:id` - Delete item
- `PATCH /api/shopping-list/:id/toggle` - Toggle purchased status
- `DELETE /api/shopping-list/purchased/clear` - Clear purchased items

## Technologies

- Node.js
- Express 4
- MongoDB & Mongoose 8
- JWT & bcryptjs
- CORS
- dotenv
