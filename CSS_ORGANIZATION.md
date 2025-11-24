# CSS Organization Guide for Grocery Management Project

## Current Structure
Currently all CSS is in `src/main.css` (5115 lines)

## Proposed Structure

```
src/
├── styles/
│   ├── index.css              # Main entry point (imports all other CSS)
│   ├── base.css               # Reset, body, root styles
│   ├── animations.css         # All @keyframes
│   ├── responsive.css         # All media queries
│   ├── components/
│   │   ├── layout.css         # layout-wrapper, main-content
│   │   ├── navbar.css         # All navbar styles
│   │   ├── footer.css         # Footer styles
│   │   ├── home.css           # Home page styles (filters, products grid)
│   │   ├── product-detail.css # Product detail page
│   │   ├── profile.css        # Profile button & modal
│   │   ├── forms.css          # Input, select, form styles
│   │   ├── buttons.css        # Button styles
│   │   ├── modals.css         # Modal styles
│   │   └── cards.css          # Card component styles
│   └── pages/
│       ├── dashboard.css
│       ├── inventory.css
│       ├── cart.css
│       └── reports.css
```

## Steps to Reorganize

### Step 1: Create folder structure
```bash
mkdir src/styles/components
mkdir src/styles/pages
```

### Step 2: Extract sections from main.css

**Lines to extract for each file:**

1. **base.css** - Lines 1-25 (reset & body)
2. **animations.css** - Lines 26-103 (all @keyframes)
3. **layout.css** - Lines 104-120 (layout-wrapper, main-content)
4. **navbar.css** - Lines 121-479 (all navbar, search, menu styles)
5. **footer.css** - Lines 480-510 (footer styles)
6. **home.css** - Lines 3167-3787 (filter buttons, products grid, categories)
7. **product-detail.css** - Lines 4042-4753 (product detail page)
8. **profile.css** - Lines 3788-4041 (profile button & modal)
9. **buttons.css** - Lines 935-1034 (button styles)
10. **forms.css** - Lines 1035-1093 (input, select styles)
11. **modals.css** - Lines 1094-1165 (modal styles)
12. **cards.css** - Lines 633-690 (card styles)
13. **responsive.css** - Lines 3750-4022 (all @media queries)

### Step 3: Update main.jsx
Change import from:
```javascript
import './main.css'
```
To:
```javascript
import './styles/index.css'
```

### Step 4: Create index.css
This file imports all component styles in the correct order.

## Benefits
- ✅ Easier to find specific styles
- ✅ Better organization
- ✅ Smaller, more manageable files
- ✅ Easier collaboration
- ✅ Better performance (tree-shaking possible)
- ✅ Component-based architecture

## Note
Keep dark mode styles with their respective components.
For example: `[data-theme="dark"] .navbar` stays in navbar.css
