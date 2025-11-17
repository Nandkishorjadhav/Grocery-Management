# 🛒 Grocery Management System

A comprehensive full-stack application for managing grocery inventory, shopping lists, and generating reports.

## 📋 Features

### Client (Frontend)
- **Dashboard**: Overview of inventory with key metrics and alerts
- **Inventory Management**: Add, edit, delete, and track grocery items
- **Shopping List**: Create and manage shopping lists with purchase tracking
- **Reports & Analytics**: View insights on inventory value, low stock, and expiring items
- **Responsive Design**: Built with React and Tailwind CSS
- **Local Storage**: Data persistence in the browser

### Server (Backend)
- **RESTful API**: Built with Node.js and Express
- **MongoDB Integration**: Database support with Mongoose
- **CRUD Operations**: Full create, read, update, delete functionality
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing enabled

## 🏗️ Project Structure

```
Grocery-Management/
├── Client/                  # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Button, Input, Card, Modal, Select
│   │   │   └── layout/     # Navbar, Footer, Layout
│   │   ├── pages/          # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── ShoppingList.jsx
│   │   │   └── Reports.jsx
│   │   ├── context/        # React Context for state management
│   │   │   └── GroceryContext.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useLocalStorage.js
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
└── Server/                  # Node.js backend application
    ├── src/
    │   ├── controllers/    # Route controllers
    │   │   ├── inventoryController.js
    │   │   └── shoppingListController.js
    │   ├── models/         # Mongoose models
    │   │   ├── Inventory.js
    │   │   └── ShoppingList.js
    │   ├── routes/         # API routes
    │   │   ├── inventoryRoutes.js
    │   │   └── shoppingListRoutes.js
    │   ├── middleware/     # Custom middleware
    │   └── config/         # Configuration files
    │       └── database.js
    ├── server.js           # Express server setup
    ├── package.json
    └── .env.example        # Environment variables template

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional, for database features)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/Nandkishorjadhav/Grocery-Management.git
cd Grocery-Management
```

#### 2. Install Client Dependencies
```bash
cd Client
npm install
```

#### 3. Install Server Dependencies
```bash
cd ../Server
npm install
```

#### 4. Configure Environment Variables
Create a `.env` file in the Server directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/grocery_management
JWT_SECRET=your_jwt_secret_key_here
```

## 🎮 Running the Application

### Development Mode

#### Start the Client (Frontend)
```bash
cd Client
npm run dev
```
The client will run on `http://localhost:5173`

#### Start the Server (Backend)
```bash
cd Server
npm run dev
```
The server will run on `http://localhost:5000`

### Production Build

#### Build the Client
```bash
cd Client
npm run build
```

#### Start the Server
```bash
cd Server
npm start
```

## 🔌 API Endpoints

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/expiring-soon` - Get expiring items

### Shopping List
- `GET /api/shopping-list` - Get all shopping list items
- `GET /api/shopping-list/:id` - Get single item
- `POST /api/shopping-list` - Create new item
- `PUT /api/shopping-list/:id` - Update item
- `DELETE /api/shopping-list/:id` - Delete item
- `PATCH /api/shopping-list/:id/toggle` - Toggle purchased status
- `DELETE /api/shopping-list/purchased/clear` - Clear purchased items

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **React Router DOM 6** - Routing
- **Tailwind CSS 4** - Styling
- **Vite 7** - Build tool
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **MongoDB** - Database
- **Mongoose 8** - ODM
- **CORS** - Cross-origin support
- **dotenv** - Environment variables
- **nodemon** - Development server

## 📱 Features in Detail

### Dashboard
- View total items and inventory value
- Low stock alerts
- Expiring soon notifications
- Quick action buttons

### Inventory Management
- Add new items with details (name, category, quantity, price, expiry date)
- Edit existing items
- Delete items
- Search and filter by category
- Sort by various criteria
- Stock status indicators

### Shopping List
- Create shopping lists
- Mark items as purchased
- Filter by status (all, pending, purchased)
- Clear completed items
- Category organization

### Reports
- Category-based breakdown
- Top value items
- Inventory health metrics
- Shopping list analytics
- Stock and expiry status

## 🎨 UI Components

- **Button** - Various variants (primary, secondary, success, danger, warning, outline)
- **Input** - Form input with label and error handling
- **Select** - Dropdown selection
- **Card** - Container component
- **Modal** - Dialog for forms and confirmations
- **Navbar** - Navigation with mobile support
- **Footer** - Application footer
- **Layout** - Page wrapper

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nandkishor Jadhav**
- GitHub: [@Nandkishorjadhav](https://github.com/Nandkishorjadhav)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by Nandkishor Jadhav
