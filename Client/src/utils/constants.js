// Application constants

export const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Meat',
  'Snacks',
  'Beverages',
  'Others',
];

export const UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'L', label: 'Liter (L)' },
  { value: 'mL', label: 'Milliliter (mL)' },
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'can', label: 'Can' },
];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'price', label: 'Price' },
  { value: 'expiryDate', label: 'Expiry Date' },
  { value: 'category', label: 'Category' },
];

export const STORAGE_KEYS = {
  GROCERY_DATA: 'grocery_data',
  INVENTORY: 'grocery_inventory',
  SHOPPING_LIST: 'grocery_shopping_list',
  CATEGORIES: 'grocery_categories',
};

export const ALERT_THRESHOLDS = {
  LOW_STOCK_DAYS: 7,
  EXPIRY_WARNING_DAYS: 7,
};

export const STATUS = {
  LOW_STOCK: 'LOW_STOCK',
  EXPIRING_SOON: 'EXPIRING_SOON',
  EXPIRED: 'EXPIRED',
  GOOD: 'GOOD',
};

export const STATUS_COLORS = {
  [STATUS.LOW_STOCK]: 'yellow',
  [STATUS.EXPIRING_SOON]: 'red',
  [STATUS.EXPIRED]: 'red',
  [STATUS.GOOD]: 'green',
};
