// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Calculate days until date
export const daysUntil = (date) => {
  if (!date) return null;
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if item is low stock
export const isLowStock = (quantity, minStock) => {
  return quantity <= minStock;
};

// Check if item is expiring soon (within 7 days)
export const isExpiringSoon = (expiryDate) => {
  const days = daysUntil(expiryDate);
  return days !== null && days <= 7 && days >= 0;
};

// Check if item is expired
export const isExpired = (expiryDate) => {
  const days = daysUntil(expiryDate);
  return days !== null && days < 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Calculate percentage
export const calculatePercentage = (part, whole) => {
  if (whole === 0) return 0;
  return ((part / whole) * 100).toFixed(2);
};
