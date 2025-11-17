# Grocery Management System - Client

React-based frontend for the Grocery Management System.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the Client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Folder Structure

```
src/
├── components/      # Reusable components
│   ├── common/     # UI components (Button, Input, etc.)
│   └── layout/     # Layout components (Navbar, Footer)
├── pages/          # Page components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
└── assets/         # Static assets
```

## Technologies

- React 19
- React Router DOM 6
- Tailwind CSS 4
- Vite 7

