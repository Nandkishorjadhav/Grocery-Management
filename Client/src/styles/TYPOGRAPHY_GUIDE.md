# Typography System Guide

## Overview

The typography system provides a comprehensive, responsive, and reusable set of styles for consistent typography across all pages in your Grocery Management application. It includes CSS custom properties, utility classes, and semantic HTML element styling.

## Quick Start

The typography system is automatically imported via `styles/index.css`. You can use it immediately without additional setup.

### Using CSS Variables

```css
/* In any CSS file */
.my-heading {
  font-size: var(--h1-size);
  font-weight: var(--h1-weight);
  line-height: var(--h1-line-height);
  letter-spacing: var(--h1-letter-spacing);
}
```

### Using CSS Classes

```html
<!-- In JSX components -->
<h1 className="h1">Page Title</h1>
<p className="body-md">Regular paragraph text</p>
<span className="caption-sm text-tertiary">Small label</span>
```

## Heading Scale

All headings scale responsively across different breakpoints.

| Class | Desktop | Tablet | Mobile | Weight | Use Case |
|-------|---------|--------|--------|--------|----------|
| `.h1` / `h1` | 3rem | 2.25rem | 1.875rem | 900 | Page titles, major sections |
| `.h2` / `h2` | 2rem | 1.75rem | 1.5rem | 800 | Section headers, card titles |
| `.h3` / `h3` | 1.5rem | 1.5rem | 1.25rem | 800 | Card titles, subsections |
| `.h4` / `h4` | 1.25rem | 1.125rem | 1.125rem | 700 | Component titles |
| `.h5` / `h5` | 1.125rem | 1.125rem | 1rem | 600 | Smaller titles |
| `.h6` / `h6` | 1rem | 1rem | 1rem | 600 | Mini titles |

### Example

```jsx
// Dashboard.jsx
<h1 className="h1">Dashboard</h1>
<h2 className="h2">Quick Actions</h2>
<h3 className="h3">Manage Inventory</h3>
```

## Body Text Scale

Body text scales smoothly across all devices for optimal readability.

| Class | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `.body-lg` | 1.125rem | 400 | 1.7 | Introductory paragraphs, highlighted text |
| `.body-md` / `p` | 1rem | 400 | 1.6 | Regular content, descriptions |
| `.body-sm` | 0.938rem | 400 | 1.6 | Secondary content, captions |
| `.body-xs` | 0.875rem | 400 | 1.5 | Metadata, timestamps |

### Example

```jsx
<p className="body-lg">Welcome to GroceryHub!</p>
<p className="body-md">Manage your inventory efficiently.</p>
<span className="body-xs">Last updated: 2 hours ago</span>
```

## Captions & Labels

Use captions and labels for smaller, emphasizing text like form labels and badges.

| Class | Size | Weight | Letter Spacing | Use Case |
|-------|------|--------|-----------------|----------|
| `.caption-lg` / `.label-lg` | 0.938rem | 600 | 0.25px | Form labels, section labels |
| `.caption-md` / `.label-md` | 0.875rem | 600 | 0.05em | Field labels, captions |
| `.caption-sm` / `.label-sm` | 0.75rem | 700 | 0.1em | Badges, tags, small labels (uppercase) |

### Example

```jsx
<label className="label-md">Product Name</label>
<span className="caption-sm">FEATURED</span>
<p className="caption-lg">Low Stock Alert</p>
```

## Font Weight Utilities

Apply specific font weights to any element.

```html
<span className="font-thin">Thin (300)</span>
<span className="font-regular">Regular (400)</span>
<span className="font-medium">Medium (500)</span>
<span className="font-semibold">Semi-bold (600)</span>
<span className="font-bold">Bold (700)</span>
<span className="font-extrabold">Extra-bold (800)</span>
<span className="font-black">Black (900)</span>
```

## Text Color Utilities

Semantic color utilities for text content.

```html
<!-- Color utilities -->
<p className="text-primary">Primary text (main content)</p>
<p className="text-secondary">Secondary text (descriptions)</p>
<p className="text-tertiary">Tertiary text (metadata)</p>
<p className="text-disabled">Disabled text</p>

<!-- Semantic colors -->
<p className="text-accent">Accent color text</p>
<p className="text-success">Success message</p>
<p className="text-warning">Warning message</p>
<p className="text-error">Error message</p>
```

## Text Alignment Utilities

```html
<p className="text-left">Left aligned text</p>
<p className="text-center">Center aligned text</p>
<p className="text-right">Right aligned text</p>
<p className="text-justify">Justified text</p>
```

## Text Transform Utilities

```html
<p className="text-uppercase">ALL CAPS TEXT</p>
<p className="text-lowercase">lowercase text</p>
<p className="text-capitalize">Capitalized Text</p>
<p className="text-normal-case">Normal case text</p>
```

## Line Height Utilities

```html
<p className="leading-none">1 (1)</p>
<p className="leading-tight">1.25</p>
<p className="leading-normal">1.5 (default)</p>
<p className="leading-relaxed">1.75</p>
<p className="leading-loose">2</p>
```

## Letter Spacing Utilities

```html
<p className="tracking-tighter">-0.025em</p>
<p className="tracking-tight">-0.01em</p>
<p className="tracking-normal">0 (normal)</p>
<p className="tracking-wide">0.025em</p>
<p className="tracking-wider">0.05em</p>
<p className="tracking-widest">0.1em</p>
```

## Text Truncation & Overflow

```html
<!-- Single line ellipsis -->
<p className="text-truncate">Very long text that will be truncated...</p>

<!-- Multi-line ellipsis -->
<p className="text-ellipsis-2">Text truncated after 2 lines...</p>
<p className="text-ellipsis-3">Text truncated after 3 lines...</p>

<!-- Word break -->
<p className="text-break">VeryLongWordThatNeedsToBreak</p>
```

## Semantic Text Classes

```html
<!-- Hero text - largest, most prominent -->
<h1 className="text-hero">Amazing Headline</h1>

<!-- Display text - large headlines -->
<h2 className="text-display">Section Headline</h2>

<!-- Lead text - emphasizing text -->
<p className="text-lead">This is an important introduction.</p>
```

## Responsive Typography

All heading scales automatically adjust based on viewport size:

- **Desktop (1024px+):** Full size scales
- **Tablet (768px - 1023px):** Medium scale
- **Mobile (480px - 767px):** Small scale
- **Extra Small (< 480px):** Extra-small scale

No additional classes needed - everything is automatic!

### Example of Responsiveness

```jsx
// This H1 will automatically:
// - Display 3rem on desktop
// - Display 2.25rem on tablet
// - Display 1.875rem on mobile
<h1>Dashboard</h1>
```

## Dark Mode Support

All typography styles automatically adapt to dark mode. Text colors will switch to light variants when `[data-theme="dark"]` is set.

```jsx
// In your theme switcher
<div data-theme="dark">
  <h1 className="h1">This text will be light in dark mode</h1>
</div>
```

## Real-World Example: Dashboard Page

```jsx
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="h1 text-accent">Dashboard</h1>
          <p className="body-md text-secondary">Welcome back! Here's your grocery overview.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="caption-sm text-tertiary">TOTAL ITEMS</p>
          <h3 className="h3">24</h3>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="h2">⚠️ Low Stock Alert</h2>
              <p className="body-sm text-secondary">5 items need restocking</p>
            </div>
          </div>
          <div className="card-body">
            <div className="alert-items">
              <div className="alert-item">
                <p className="body-md font-bold">Milk</p>
                <span className="caption-sm">Category: Dairy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

## CSS Variables Reference

### Heading Variables
```css
--h1-size, --h1-weight, --h1-line-height, --h1-letter-spacing
--h2-size, --h2-weight, --h2-line-height, --h2-letter-spacing
--h3-size, --h3-weight, --h3-line-height, --h3-letter-spacing
--h4-size, --h4-weight, --h4-line-height, --h4-letter-spacing
--h5-size, --h5-weight, --h5-line-height, --h5-letter-spacing
--h6-size, --h6-weight, --h6-line-height, --h6-letter-spacing
```

### Body Text Variables
```css
--body-lg-size, --body-lg-weight, --body-lg-line-height, --body-lg-letter-spacing
--body-md-size, --body-md-weight, --body-md-line-height, --body-md-letter-spacing
--body-sm-size, --body-sm-weight, --body-sm-line-height, --body-sm-letter-spacing
--body-xs-size, --body-xs-weight, --body-xs-line-height, --body-xs-letter-spacing
```

### Caption Variables
```css
--caption-lg-size, --caption-lg-weight, --caption-lg-line-height, --caption-lg-letter-spacing
--caption-md-size, --caption-md-weight, --caption-md-line-height, --caption-md-letter-spacing
--caption-sm-size, --caption-sm-weight, --caption-sm-line-height, --caption-sm-letter-spacing
```

### Font Weight Variables
```css
--fw-thin: 300
--fw-regular: 400
--fw-medium: 500
--fw-semibold: 600
--fw-bold: 700
--fw-extrabold: 800
--fw-black: 900
```

### Color Variables
```css
--text-primary: #111827        (main text)
--text-secondary: #6b7280      (descriptions)
--text-tertiary: #9ca3af       (metadata)
--text-disabled: #d1d5db       (disabled state)
```

## Best Practices

1. **Use semantic HTML**: Use `<h1>`, `<h2>`, etc., instead of `<div>` elements
2. **Maintain hierarchy**: Use heading levels sequentially (h1 → h2 → h3)
3. **Class utility for consistency**: Use `.body-md` class for consistent body text across pages
4. **Responsive by default**: Never override responsive sizes - they're designed for optimal readability
5. **Accessibility**: Ensure sufficient color contrast with `text-primary`, `text-secondary`, and `text-tertiary`
6. **Mobile-first**: Typography scales are optimized for mobile and grow appropriately on larger screens

## Troubleshooting

### Typography not applying?
- Ensure `styles/index.css` is imported in your main app
- Check that `typography.css` is in `src/styles/` directory
- Clear cache/rebuild: `npm run build`

### Dark mode text not visible?
- Use `text-primary-dark` variables or let the system handle it automatically
- Ensure you have `data-theme="dark"` on your root element

### Need custom typography?
- Create local CSS variables using the same pattern
- Or extend the typography system by adding new utility classes

---

For more information or to customize the typography system, see the `typography.css` file.
