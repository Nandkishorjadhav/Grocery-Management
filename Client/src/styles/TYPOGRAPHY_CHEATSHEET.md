# Typography System - Quick Reference Cheat Sheet

## 📋 Heading Scale (Always Responsive)

```jsx
<h1>Largest Title (3rem → 1.875rem)</h1>      {/* --h1-size */}
<h2>Large Title (2rem → 1.5rem)</h2>          {/* --h2-size */}
<h3>Medium Title (1.5rem)</h3>                {/* --h3-size */}
<h4>Small Title (1.25rem → 1.125rem)</h4>     {/* --h4-size */}
<h5>Smaller Title (1.125rem → 1rem)</h5>      {/* --h5-size */}
<h6>Smallest Title (1rem)</h6>                {/* --h6-size */}
```

## 📝 Body Text Scale

```jsx
<p className="body-lg">Large body text - 1.125rem</p>
<p className="body-md">Regular paragraph - 1rem (DEFAULT)</p>
<p className="body-sm">Small text - 0.938rem</p>
<p className="body-xs">Extra small text - 0.875rem</p>
```

## 🏷️ Labels & Captions

```jsx
<span className="label-lg">Form Label</span>          {/* 0.938rem, weight 600 */}
<span className="label-md">Field Label</span>        {/* 0.875rem, weight 600 */}
<span className="label-sm">BADGE</span>              {/* 0.75rem, weight 700, UPPERCASE */}
<span className="caption-lg">Large Caption</span>
<span className="caption-md">Regular Caption</span>
<span className="caption-sm">SMALL CAPTION</span>
```

## 🎨 Text Colors

```jsx
<p className="text-primary">Main content</p>      {/* #111827 */}
<p className="text-secondary">Description</p>     {/* #6b7280 */}
<p className="text-tertiary">Metadata</p>         {/* #9ca3af */}
<p className="text-disabled">Disabled</p>         {/* #d1d5db */}
<p className="text-accent">Accent color</p>       {/* Primary brand color */}
<p className="text-success">Success</p>           {/* Green */}
<p className="text-warning">Warning</p>           {/* Orange */}
<p className="text-error">Error</p>               {/* Red */}
```

## 🔤 Font Weights

```jsx
<p className="font-thin">300</p>
<p className="font-regular">400</p>
<p className="font-medium">500</p>
<p className="font-semibold">600</p>
<p className="font-bold">700</p>
<p className="font-extrabold">800</p>
<p className="font-black">900</p>
```

## 📐 Line Height

```jsx
<p className="leading-none">line-height: 1</p>
<p className="leading-tight">line-height: 1.25</p>
<p className="leading-normal">line-height: 1.5</p>
<p className="leading-relaxed">line-height: 1.75</p>
<p className="leading-loose">line-height: 2</p>
```

## 📏 Letter Spacing

```jsx
<p className="tracking-tighter">-0.025em</p>
<p className="tracking-tight">-0.01em</p>
<p className="tracking-normal">0</p>
<p className="tracking-wide">0.025em</p>
<p className="tracking-wider">0.05em</p>
<p className="tracking-widest">0.1em</p>
```

## ↔️ Text Alignment

```jsx
<p className="text-left">Left aligned</p>
<p className="text-center">Centered</p>
<p className="text-right">Right aligned</p>
<p className="text-justify">Justified</p>
```

## 🔤 Text Transform

```jsx
<p className="text-uppercase">ALL UPPERCASE</p>
<p className="text-lowercase">all lowercase</p>
<p className="text-capitalize">Capitalize Words</p>
<p className="text-normal-case">normal case</p>
```

## ✂️ Text Truncation

```jsx
<p className="text-truncate">Single line...</p>      {/* Adds ellipsis */}
<p className="text-ellipsis-2">Multi-line...</p>     {/* 2 lines max */}
<p className="text-ellipsis-3">Multi-line...</p>     {/* 3 lines max */}
<p className="text-break">VeryLongWordBreaks</p>   {/* Breaks long words */}
```

## 🎯 Semantic Styles

```jsx
<h1 className="text-hero">Extra Large Title</h1>
<h2 className="text-display">Display Title</h2>
<p className="text-lead">Important introduction</p>
```

## 🌙 Dark Mode (Automatic)

```jsx
// Just add data-theme="dark" to root element
<div data-theme="dark">
  <h1>Text automatically becomes light</h1>
  <p>Colors adjust without code changes</p>
</div>
```

## 📱 Responsive Behavior (Automatic)

All headings and body text automatically scale:
- **Desktop (1024px+)**: Full size
- **Tablet (768px)**: Medium size  
- **Mobile (480px)**: Small size
- **Extra small (<480px)**: Extra-small size

No classes needed - just use the elements!

## 🔗 Complete Tag Styles

```jsx
<h1>Automatically uses --h1-* variables</h1>
<h2>Automatically uses --h2-* variables</h2>
<h3>Automatically uses --h3-* variables</h3>
<h4>Automatically uses --h4-* variables</h4>
<h5>Automatically uses --h5-* variables</h5>
<h6>Automatically uses --h6-* variables</h6>
<p>Automatically uses --body-md-* variables</p>
```

## 💾 CSS Variables (Advanced)

```css
/* In your CSS, you can use any variable: */
.custom-element {
  font-size: var(--h2-size);
  font-weight: var(--fw-bold);
  color: var(--text-secondary);
  line-height: var(--body-lg-line-height);
  letter-spacing: var(--caption-lg-letter-spacing);
}
```

## 🚀 Real-World Example

```jsx
// Dashboard.jsx
export default function Dashboard() {
  return (
    <div>
      {/* Page title - automatically responsive */}
      <h1>Dashboard</h1>
      
      {/* Subtitle */}
      <p className="body-lg text-secondary">Welcome back!</p>
      
      {/* Stats section */}
      <div className="stats-grid">
        <div>
          <span className="label-sm">TOTAL ITEMS</span>
          <h3 className="font-black">24</h3>
        </div>
      </div>
      
      {/* Alert card */}
      <div className="card">
        <h2>Alerts</h2>
        <p className="body-md">You have 5 low stock items</p>
        <span className="label-sm text-warning">ACTION REQUIRED</span>
      </div>
    </div>
  );
}
```

## 🎯 When to Use Each Scale

| Use | Element | Class |
|-----|---------|-------|
| Page titles | `<h1>` | `.h1` |
| Section headers | `<h2>` | `.h2` |
| Card titles | `<h3>` | `.h3` |
| Component titles | `<h4>` | `.h4` |
| Main content | `<p>` | `.body-md` |
| Intro paragraphs | - | `.body-lg` |
| Secondary content | - | `.body-sm` |
| Form labels | `<label>` | `.label-md` |
| Badges/tags | `<span>` | `.label-sm` |
| Metadata | - | `.body-xs` |

## ✅ Best Practices

1. ✨ **Use semantic HTML** - Always use proper heading tags
2. 📐 **Maintain hierarchy** - h1 → h2 → h3 (don't skip levels)
3. 🎨 **Use color utilities** - `text-primary`, `text-secondary`, etc.
4. 📱 **Trust responsive scaling** - Don't override sizes
5. 🌙 **Dark mode ready** - Colors auto-switch
6. ♿ **Accessible** - Proper contrast maintained
7. 🔄 **Reusable** - No inline styles needed

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Typography not applying | Ensure `styles/index.css` is imported |
| Colors not in dark mode | System handles it automatically |
| Text too large on mobile | It's scaling automatically - this is intentional |
| Need custom sizing | Override in component-specific CSS file |

---

For detailed info, see `TYPOGRAPHY_GUIDE.md`
