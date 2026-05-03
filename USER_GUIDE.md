# 🛒 Grocery Management System - User Guide

Welcome to the Grocery Management System! This guide will walk you through all the features and how to use them effectively.

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Dashboard](#dashboard)
4. [Inventory Management](#inventory-management)
5. [Shopping List](#shopping-list)
6. [Cart](#cart)
7. [Checkout & Orders](#checkout--orders)
8. [Reports & Analytics](#reports--analytics)
9. [Profile Management](#profile-management)
10. [Admin Panel](#admin-panel)
11. [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL (typically `http://localhost:3000` for local development)
3. You'll be directed to the home page

### First Time Users

- Create a new account or log in with existing credentials
- Complete your profile information
- Start exploring the features

---

## Authentication

### Sign Up

1. Click on **"Sign Up"** button on the login page
2. Fill in the registration form:
   - Email address
   - Full name
   - Password (minimum 8 characters recommended)
   - Confirm password
3. Click **"Create Account"**
4. You'll be logged in automatically and redirected to the dashboard

### Log In

1. Enter your registered email address
2. Enter your password
3. Click **"Log In"**
4. You'll be redirected to your personalized dashboard

### Log Out

1. Click your profile icon or name in the top-right corner
2. Select **"Log Out"**
3. You'll be logged out and returned to the login page

### Password Recovery

- Click **"Forgot Password?"** on the login page
- Enter your registered email
- Follow the instructions sent to your email

---

## Dashboard

The Dashboard is your home page after logging in. It provides a quick overview of your grocery management activities.

### Dashboard Features

#### Key Metrics
- **Total Items**: Number of items in your inventory
- **Total Value**: Combined value of all inventory items
- **Low Stock Items**: Count of items below your set threshold
- **Items Expiring Soon**: Items approaching their expiration date

#### Quick Actions
- Add new item to inventory
- View full inventory
- Create a shopping list
- Check recent orders

#### Activity Summary
- Recently added products
- Recent shopping list activity
- Upcoming deliveries

---

## Inventory Management

### Viewing Your Inventory

1. Click **"Inventory"** in the main navigation
2. See all your grocery items displayed in a table or grid view
3. Use **Search** to find specific items
4. **Filter** by category, expiration date, or stock level

### Adding Items to Inventory

1. Click **"Add Item"** button
2. Fill in the item details:
   - **Item Name**: Name of the product
   - **Category**: Select from available categories (Vegetables, Fruits, Dairy, etc.)
   - **Quantity**: Number of units
   - **Unit**: Measurement type (kg, liter, pieces, etc.)
   - **Purchase Price**: Cost per unit
   - **Expiration Date**: When the item expires
   - **Location**: Where it's stored (Fridge, Pantry, etc.)
   - **Notes**: Any additional information
3. Click **"Add to Inventory"**
4. Item will appear in your inventory list

### Editing Items

1. Click the **Edit** icon (pencil) next to an item
2. Modify any details
3. Click **"Update"**
4. Changes are saved immediately

### Deleting Items

1. Click the **Delete** icon (trash) next to an item
2. Confirm deletion in the popup
3. Item is removed from inventory

### Stock Management

- **Low Stock Alerts**: Items below threshold are highlighted
- **Update Quantity**: Click on quantity field to update stock levels
- **Mark as Used**: Decrease quantity when item is consumed

---

## Shopping List

### Creating a New Shopping List

1. Click **"Shopping List"** in navigation
2. Click **"Create New List"**
3. Give your list a name (e.g., "Weekly Groceries")
4. Click **"Create"**

### Adding Items to Shopping List

#### Option 1: From Inventory
1. Go to **Inventory**
2. Click **"Add to Cart"** on any item
3. Enter quantity needed
4. Select your shopping list
5. Click **"Add"**

#### Option 2: Adding New Items
1. In your shopping list, click **"Add Item"**
2. Enter item name
3. Set quantity
4. Add category (optional)
5. Click **"Add to List"**

### Managing Shopping Lists

- **Mark as Purchased**: Check off items as you buy them
- **Remove Items**: Click delete icon to remove items
- **Rename List**: Click edit icon to change list name
- **Share List**: Get link to share with family/roommates (if available)
- **Delete List**: Remove entire list

### Shopping List Tips

- Create separate lists for different stores
- Pin frequently used lists for quick access
- Use the checklist to track what you've bought

---

## Cart

### Adding Items to Cart

1. Browse products through **Products** page
2. Click **"Add to Cart"** on desired item
3. Select quantity
4. Click **"Add"**

### Viewing Your Cart

1. Click **Cart** icon in navigation (top-right)
2. See all items, quantities, and prices
3. Total cost is displayed at bottom

### Modifying Cart Items

- **Increase Quantity**: Click **"+"** button
- **Decrease Quantity**: Click **"-"** button
- **Remove Item**: Click **"Remove"** or trash icon
- **Clear Cart**: Use **"Clear Cart"** button to remove all items

### Save for Later

1. Select items in cart
2. Click **"Save for Later"** button
3. Items move to "Saved Items" section
4. Restore anytime by clicking **"Move to Cart"**

---

## Checkout & Orders

### Proceeding to Checkout

1. Click **"Proceed to Checkout"** in cart
2. Review order summary
3. Confirm or modify delivery address
4. Select payment method

### Available Payment Methods

- **Credit/Debit Card**
- **Digital Wallet** (if available)
- **Cash on Delivery** (if available)

### Applying Coupons

1. In checkout, look for **"Coupon Code"** field
2. Enter your coupon code
3. Click **"Apply"**
4. Discount will be calculated and shown
5. Total will update accordingly

### Placing Order

1. Review final order summary
2. Agree to terms and conditions
3. Click **"Place Order"**
4. You'll receive order confirmation

### Tracking Orders

1. Click **"Orders"** in navigation
2. View order history with status
3. Click order to see details:
   - Order date and time
   - Items ordered
   - Delivery address
   - Payment status
   - Current status (Processing, Shipped, Delivered, etc.)

---

## Reports & Analytics

### Accessing Reports

1. Click **"Reports"** in navigation
2. Choose report type from the menu

### Available Reports

#### Inventory Value Report
- Total current inventory value
- Value by category
- Trends over time
- Export as PDF or CSV

#### Expiration Report
- Items expiring this week
- Items expiring this month
- Items already expired
- Categories most affected

#### Low Stock Report
- Items below minimum threshold
- Recommended reorder quantities
- Estimated restocking cost

#### Purchase History
- Monthly spending trends
- Top purchased categories
- Seasonal patterns

#### Category Analysis
- Breakdown by product category
- Most purchased categories
- Budget allocation by category

### Exporting Reports

1. Click **"Export"** button
2. Choose format:
   - PDF (for printing)
   - CSV (for spreadsheets)
   - Excel (for advanced analysis)
3. File will download automatically

### Setting Alerts

1. In Reports section, find **"Manage Alerts"**
2. Set thresholds for:
   - Low stock levels
   - Expiration warnings (days before expiry)
   - Budget limits
3. Click **"Save Alerts"**
4. You'll receive notifications when thresholds are met

---

## Profile Management

### Accessing Your Profile

1. Click profile icon in top-right corner
2. Select **"Profile"** or **"Account Settings"**

### Updating Personal Information

1. Go to Profile page
2. Click **"Edit Profile"**
3. Update information:
   - Name
   - Email
   - Phone number
   - Profile picture
4. Click **"Save Changes"**

### Changing Password

1. In Profile settings, find **"Security"**
2. Click **"Change Password"**
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click **"Update Password"**

### Managing Addresses

1. In Profile, go to **"Addresses"**
2. **Add New Address**: Click "Add" and fill details
3. **Edit Address**: Click edit icon
4. **Set as Default**: Click "Set as Default" checkbox
5. **Delete Address**: Click delete icon

### Notification Preferences

1. Go to **"Preferences"** or **"Settings"**
2. Toggle notifications for:
   - Order updates
   - Low stock alerts
   - Expiration reminders
   - Weekly reports
3. Choose notification method (Email, SMS, In-app)
4. Save preferences

### Privacy & Security

- Review privacy policy by clicking link in footer
- Manage cookie preferences
- View login activity
- Set up two-factor authentication (if available)

---

## Admin Panel

*Note: Only accessible to admin users*

### Accessing Admin Panel

1. Log in as admin user
2. Click **"Admin"** in navigation
3. You'll see admin dashboard with advanced options

### Admin Features

#### User Management
- View all registered users
- Manage user roles
- Disable/enable user accounts
- View user activity logs

#### Product Management
- Add new products to catalog
- Edit product details
- Set product availability
- Manage product images
- Track product inventory

#### Order Management
- View all orders system-wide
- Update order status
- Process refunds
- Generate order reports

#### Coupon Management
- Create discount coupons
- Set coupon validity periods
- Track coupon usage
- Disable expired coupons

#### System Settings
- Configure system parameters
- Manage categories
- Set delivery options
- Configure payment methods

#### Reports & Analytics
- View system-wide analytics
- Generate business reports
- Track revenue and trends
- Monitor user activity

---

## Frequently Asked Questions

### General Questions

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption and secure authentication. Your personal information is protected.

**Q: Can I use this on mobile?**
A: The application is responsive and works on mobile browsers, but a dedicated app may offer better experience.

**Q: How do I contact support?**
A: Look for a "Help" or "Contact Us" section in the footer or settings menu.

### Account Issues

**Q: I forgot my password. What should I do?**
A: Click "Forgot Password?" on the login page and follow the email instructions.

**Q: How do I delete my account?**
A: Go to Account Settings and find "Delete Account" option. Note: This cannot be undone.

**Q: Can I change my email address?**
A: Yes, go to Profile > Account Settings > Email and update it.

### Shopping & Orders

**Q: What payment methods do you accept?**
A: This depends on system configuration. Check during checkout for available methods.

**Q: Can I cancel an order?**
A: You can cancel orders that haven't been shipped. Go to Orders and find the cancel option.

**Q: How long does delivery take?**
A: Delivery time depends on your location. Check order details for estimated delivery.

**Q: What if I receive a wrong item?**
A: Contact support immediately with your order number. Include photos if possible.

### Inventory Management

**Q: How do I set low stock warnings?**
A: Go to Inventory Settings and set your minimum stock levels for each item.

**Q: Can I import inventory from a file?**
A: Contact admin to see if bulk import feature is available.

**Q: What do the different categories mean?**
A: Categories help organize items. Standard categories include Vegetables, Fruits, Dairy, etc. Click on categories to learn more.

### Reports & Analytics

**Q: How far back do reports go?**
A: Historical data is typically available for the last 12 months.

**Q: Can I schedule automated reports?**
A: Check Reports Settings to enable automatic weekly/monthly reports via email.

**Q: How do I interpret the analytics?**
A: Hover over charts for detailed information, or contact support for help understanding metrics.

---

## Tips & Tricks

### Maximize Efficiency

1. **Organize Categories**: Use consistent naming for easy searching
2. **Set Reminders**: Enable expiration alerts to reduce food waste
3. **Regular Updates**: Keep inventory updated for accurate reports
4. **Use Shopping Lists**: Plan purchases to save time and money
5. **Review Reports**: Check analytics monthly to optimize spending

### Save Money

1. Track spending with purchase history reports
2. Use coupons and discount codes
3. Monitor expiration dates to avoid waste
4. Identify frequently purchased items for bulk buying
5. Compare prices across categories

### Best Practices

- Update inventory when items are used
- Set realistic stock levels based on consumption
- Keep notes on items with special storage requirements
- Review reports monthly for insights
- Backup important data regularly

---

## Keyboard Shortcuts (if available)

| Shortcut | Action |
|----------|--------|
| `Ctrl + A` | Add new item |
| `Ctrl + S` | Save changes |
| `Ctrl + F` | Search/Find |
| `Esc` | Close modal/Cancel |

---

## Troubleshooting

### Common Issues

**Issue**: Application won't load
- **Solution**: Clear browser cache and reload the page

**Issue**: Can't log in
- **Solution**: Check caps lock, verify email, try password reset

**Issue**: Changes not saving
- **Solution**: Check internet connection, try again, or contact support

**Issue**: Slow performance
- **Solution**: Clear browser cache, close other tabs, check internet speed

---

## Additional Resources

- **Help Center**: Look for "?" icon throughout the app
- **Contact Support**: Found in footer or settings
- **Documentation**: See README.md for technical details
- **Setup Guide**: See SETUP_GUIDE.md for installation help

---

## Updates & Feedback

We're constantly improving! Have suggestions or found a bug? Contact us through the support section or submit feedback in settings.

**Version**: 1.0.0  
**Last Updated**: May 2026

---

Happy Grocery Managing! 🎉
