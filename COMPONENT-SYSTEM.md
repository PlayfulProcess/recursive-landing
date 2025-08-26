# Component-Based Header/Footer System

This document describes the reusable header and footer component system implemented for efficient maintenance across all pages.

## Overview

The component system uses Web Components to create reusable header and footer elements that:
- **Automatically load HTML partials** from the `/partials/` directory
- **Handle navigation state** (active page highlighting)
- **Initialize spiral animations** in headers
- **Work without build systems** (pure JavaScript + HTML)
- **Cache requests** for performance
- **Support multiple header types** for different page categories

## Files Structure

```
/assets/
  /js/
    /components/
      site-shell.js           # Main component system
  /css/
    components.css            # Component styling
/partials/
  header.html                 # Main header (home, about, governance)
  footer.html                 # Main footer (universal)
  spiral-header.html          # Spiral tools header (playgrounds)
```

## Components Available

### 1. `<site-header>`
**Usage:** Main site pages (home, about, governance)
```html
<site-header></site-header>
<!-- or with custom path -->
<site-header src="/partials/custom-header.html"></site-header>
```

**Features:**
- Full navigation with dropdown menus
- Spiral logo animation
- Responsive design
- Active page detection

### 2. `<site-footer>`
**Usage:** Universal footer for all pages
```html
<site-footer></site-footer>
```

**Features:**
- Consistent branding
- Legal links
- Copyright information

### 3. `<spiral-header>`
**Usage:** Spiral playground pages
```html
<spiral-header></spiral-header>
```

**Features:**
- Back to home navigation
- Spiral tools navigation with active states
- Compact design for tool pages

## Implementation Guide

### 1. Add to any HTML page:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- your head content -->
  <link rel="stylesheet" href="/assets/css/components.css">
</head>
<body>
  <!-- Load component system -->
  <script src="/assets/js/components/site-shell.js" defer></script>
  
  <!-- Use components -->
  <site-header></site-header>
  
  <!-- your page content -->
  
  <site-footer></site-footer>
</body>
</html>
```

### 2. For spiral tool pages:

```html
<spiral-header></spiral-header>
<!-- your tool content -->
<site-footer></site-footer>
```

## Navigation Active States

The system automatically:
- **Detects current page** URL
- **Highlights active navigation** items with `aria-current="page"` and `.is-active` class
- **Handles different URL formats** (index.html, /, relative paths)
- **Special styling** for spiral tools (purple background when active)

## Spiral Integration

The component system automatically:
- **Loads spiral.js** if not present
- **Initializes header spirals** with default parameters
- **Waits for spiral functions** to be available
- **Handles timing issues** with script loading

## Benefits

1. **✅ DRY (Don't Repeat Yourself)** - Write once, use everywhere
2. **✅ Easy Maintenance** - Update header/footer in one place
3. **✅ Consistent Navigation** - Automatic active state management
4. **✅ Future-Ready** - Works with static sites and Next.js
5. **✅ No Build Step** - Pure Web Components
6. **✅ Performance** - Cached HTML partials
7. **✅ Spiral Integration** - Automatic logo animation

## Migration Strategy

### Phase 1: Create Component Versions ✅
- [x] Create component system files
- [x] Create header/footer partials
- [x] Test with demo pages

### Phase 2: Gradual Migration
- [ ] Convert index.html to use components
- [ ] Convert spiral playground pages
- [ ] Convert about/governance pages

### Phase 3: Clean Up
- [ ] Remove old header/footer code from pages
- [ ] Update all internal links
- [ ] Test across all pages

### Phase 4: Cross-Project Usage
- [ ] Copy component system to recursive-channels
- [ ] Adapt for Next.js projects
- [ ] Share partials between projects

## Testing

Test pages created:
- `/index-components.html` - Demo of main header/footer
- `/pages/logo-playground-components.html` - Demo of spiral header

To test:
1. Open demo pages in browser
2. Check navigation highlighting
3. Verify spiral animations work
4. Test responsive behavior
5. Check console for loading messages

## Customization

### Custom Headers
Create new partial in `/partials/` and use:
```html
<site-header src="/partials/your-header.html"></site-header>
```

### Custom Styling
Add CSS to target components:
```css
site-header .your-custom-class {
  /* your styles */
}
```

### Navigation Data
Add `data-nav` attribute to links for active state detection:
```html
<a href="/your-page.html" data-nav>Your Page</a>
```

## Browser Support

- **Modern browsers** with Web Components support
- **Chrome 67+, Firefox 63+, Safari 10.1+**
- **Graceful fallback** with loading states
- **No polyfills required** for target browsers

---

*This component system enables efficient development and maintenance while preserving all existing functionality including spiral animations and responsive design.*