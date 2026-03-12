# Theme System Documentation

## Overview

The application now includes a **production-ready light/dark mode system** with:

- **Color palette** based on 30-70-90 golden ratio formula
- **Typography system** with 3-tier font hierarchy (Montserrat, Space Mono, Merriweather)
- **Decoration grid** for ornamental elements and glyphs
- **CSS custom properties** for dynamic theming
- **Context API** for global theme state management

---

## Architecture

### Color System: 30-70-90 Golden Ratio Formula

The theme uses a harmonic color progression based on the golden ratio (φ = 1.618):

```
30% - Primary Color (dominant)
  ↓ (× 1.618 golden ratio step)
70% - Secondary Color (complementary)
  ↓ (× 1.618 golden ratio step)
90% - Accent Color (highlights)
```

#### Light Mode Palette

- **Primary (30%):** Light Grey (#F5F5F5 → #8A8A8A)
- **Secondary (70%):** Medium Grey (#D1D1D1 → 1.618× darker)
- **Accent (90%):** Dark Grey (#8A8A8A → highlights)
- **Accent Blue:** #2E5266 → #4A7BA7 → #7DA3C1 (golden ratio progression)

#### Dark Mode Palette

- **Primary (30%):** Very Dark Grey/Near Black (#0D0E14 → #2A2D3A)
- **Secondary (70%):** Dark Grey (#2A2D3A → 1.618× lighter)
- **Accent (90%):** Medium Grey (#6B7280 → highlights)
- **Accent Blue:** #60A5FA → #93C5FD → #BFDBFE (golden ratio progression)

### Typography System

Three-tier font hierarchy optimized for readability and visual hierarchy:

#### 1. **Montserrat** (Primary UI Font)

- **Category:** Geometric sans-serif
- **Usage:** Buttons, labels, headers, UI text
- **Weights:** 100, 300, 400, 500, 600, 700, 900
- **Character:** Modern, clean, geometric
- **Pairing:** Primary font for all interface elements

#### 2. **Space Mono** (Logo/Decorative Font)

- **Category:** Geometric monospace
- **Usage:** Logo, headings (h1), decorative accents
- **Weights:** 400, 700
- **Character:** Tech-forward, geometric, distinctive
- **Pairing:** Creates visual interest for branding

#### 3. **Merriweather** (Body/Serif Font)

- **Category:** Humanist serif
- **Usage:** Body text, descriptions, long-form content
- **Weights:** 300, 400, 700
- **Character:** Warm, readable, human
- **Pairing:** Complements Montserrat for legibility

### Font Scale

Based on 1.125 ratio (geometric progression):

```
xs:   12px   (0.75rem)
sm:   14px   (0.875rem)
base: 16px   (1rem)       ← Body text baseline
lg:   18px   (1.125rem)
xl:   20px   (1.25rem)
2xl:  24px   (1.5rem)
3xl:  30px   (1.875rem)
4xl:  36px   (2.25rem)
5xl:  45px   (2.813rem)
6xl:  54px   (3.375rem)
7xl:  67px   (4.219rem)   ← Logo/hero scale
```

---

## Decoration Grid System

### Purpose

Overlays a free-form grid on top of the main 3×3 glyph grid for:

- Visual ornaments and flourishes
- Ligature support for combined forms
- Geometric patterns
- Decorative elements

### Configuration

```javascript
DECORATION_GRID = {
  subdivisions: 4, // Each cell = 4×4 sub-grid
  spacing: 8, // Pixels between points
  offset: 4, // Offset from cell origin
  opacity: 0.15, // Light mode opacity
  opacity_dark: 0.25, // Dark mode opacity
  minSize: 6, // Min decoration size
  maxSize: 24, // Max decoration size
};
```

### Decoration Elements

#### Corners

- `bracket_tl`, `bracket_tr`, `bracket_bl`, `bracket_br` - Ornamental brackets
- `circle_corner` - Circular corner accents

#### Dividers

- `line_h`, `line_v` - Solid lines
- `line_dash_h`, `line_dash_v` - Dashed lines
- `dots` - Dot trails

#### Shapes

- `circle`, `circle_filled` - Circular forms
- `square`, `square_filled` - Rectangular forms
- `diamond` - Diamond shape
- `triangle`, `star`, `hexagon` - Geometric forms

#### Ligatures

- `curve_soft` - Soft curve connectors
- `curve_wave` - Wave patterns
- `curve_sharp` - Sharp curves
- `swirl` - Ornamental swirls

#### Ornaments

- `flourish_h`, `flourish_v` - Horizontal/vertical flourishes
- `crosshatch` - Crosshatch patterns
- `grid_dots` - Grid point patterns

### Preset Patterns

```javascript
DECORATION_PATTERNS = {
  minimal: { density: 0.1, complexity: 1 },
  elegant: { density: 0.3, complexity: 2 }, // Default
  modern: { density: 0.25, complexity: 2 },
  ornate: { density: 0.5, complexity: 3 },
  technical: { density: 0.4, complexity: 2 },
};
```

### Glyph Compatibility

Decorations can be integrated with glyphs via:

```javascript
GLYPH_DECORATION_MAPS = {
  segment_end_styles: {
    plain: "line",
    dot: "circle",
    square: "square_filled",
    diamond: "diamond",
  },
  corner_styles: {
    sharp: "none",
    rounded: "circle_corner",
    bracketed: "bracket_tl",
    decorated: "star",
  },
  ligature_styles: {
    smooth: "curve_soft",
    wave: "curve_wave",
    sharp: "curve_sharp",
    ornamental: "swirl",
  },
};
```

---

## File Structure

### New Files Created

```
src/
├── constants/
│   ├── colors.js               # Color palettes (light/dark)
│   ├── typography.js           # Font families, scales, weights
│   ├── decorations.js          # Decoration grid system
│   ├── themeSystem.js          # Theme objects & utilities
│   └── index.js                # Updated barrel export
│
├── context/
│   ├── ThemeContext.jsx        # Theme context provider
│   └── index.js                # Updated barrel export
│
├── hooks/
│   ├── useTheme.js             # Theme hook
│   └── index.js                # Updated barrel export
│
├── components/
│   ├── ThemeToggle/
│   │   ├── ThemeToggle.jsx    # Light/dark toggle button
│   │   └── index.js
│   └── index.js                # Updated barrel export
│
└── styles/
    └── global.css              # Global styles, CSS variables, fonts
```

---

## Usage Guide

### 1. Using ThemeProvider

Wrap your app with `ThemeProvider`:

```jsx
import { ThemeProvider } from "./src/context";
import App from "./App";

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

### 2. Using useTheme Hook

Access theme in components:

```jsx
import { useTheme } from "./src/hooks";

export default function MyComponent() {
  const { theme, isDark, themeObject, toggleTheme } = useTheme();

  return (
    <div
      style={{
        background: themeObject.colors.surface.primary,
        color: themeObject.colors.text.primary,
      }}
    >
      <h1>Current theme: {theme}</h1>
      <button onClick={toggleTheme}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
```

### 3. Using CSS Variables

In CSS or styled components:

```css
.button {
  background-color: var(--color-interactive-default);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  transition: all var(--transition-fast);
}

.button:hover {
  background-color: var(--color-interactive-hover);
  box-shadow: var(--shadow-md);
}

[data-theme="dark"] .button {
  /* Dark mode specific styles (if needed) */
}
```

### 4. Using Theme Object

For complex styling:

```jsx
import { LIGHT_THEME, DARK_THEME } from "./src/constants";

const theme = isDark ? DARK_THEME : LIGHT_THEME;

const styles = {
  container: {
    background: theme.colors.surface.primary,
    color: theme.colors.text.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
    transition: theme.transitions.normal,
  },
};
```

### 5. Using Decorations

```jsx
import { DECORATION_PATTERNS, DECORATION_ELEMENTS } from "./src/constants";

const pattern = DECORATION_PATTERNS.elegant; // Balanced decorations
const elements = DECORATION_ELEMENTS; // All available elements

// Use elements for SVG rendering or React components
```

---

## CSS Variables Reference

### Colors

**Surface:**

```css
--color-surface-primary
--color-surface-secondary
--color-surface-tertiary
--color-surface-hover
--color-surface-active
```

**Interactive:**

```css
--color-interactive-default
--color-interactive-hover
--color-interactive-active
--color-interactive-disabled
```

**Text:**

```css
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-disabled
--color-text-inverse
```

**Borders:**

```css
--color-border-primary
--color-border-secondary
--color-border-light
```

**Semantic:**

```css
--color-semantic-sibilant    /* Blue */
--color-semantic-plosive     /* Green */
--color-semantic-resonant    /* Orange */
--color-semantic-vowel       /* Purple */
--color-semantic-void        /* Rose */
```

**State:**

```css
--color-state-success
--color-state-warning
--color-state-error
--color-state-info
```

### Layout

**Spacing:**

```css
--spacing-xs      /* 8px */
--spacing-sm      /* 16px */
--spacing-md      /* 24px */
--spacing-lg      /* 32px */
--spacing-xl      /* 48px */
--spacing-xxl     /* 64px */
```

**Border Radius:**

```css
--radius-none
--radius-sm
--radius-base
--radius-md
--radius-lg
--radius-xl
--radius-full
```

**Shadows:**

```css
--shadow-none
--shadow-sm
--shadow-base
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl
```

### Typography

**Fonts:**

```css
--font-primary    /* Montserrat */
--font-serif      /* Merriweather */
--font-mono       /* Courier New */
```

**Transitions:**

```css
--transition-fast      /* 150ms */
--transition-normal    /* 250ms */
--transition-slow      /* 350ms */
```

---

## Theme Persistence

Themes are automatically persisted to localStorage:

```javascript
// Automatically saved on theme change
useTheme().switchTheme("dark");

// Restored on app reload
const systemTheme = getSystemTheme(); // Checks localStorage first
```

---

## Customization

### Adding Custom Colors

Edit `src/constants/colors.js`:

```javascript
export const LIGHT_COLORS = {
  // ... existing colors
  custom_color: "#ABC123",
};

export const DARK_COLORS = {
  // ... existing colors
  custom_color: "#DEF456",
};
```

### Adding Custom Fonts

Edit `src/constants/typography.js`:

```javascript
export const FONTS = {
  // ... existing fonts
  custom: "'CustomFont', sans-serif",
};
```

### Extending Theme Objects

Edit `src/constants/themeSystem.js`:

```javascript
export const LIGHT_THEME = {
  // ... existing properties
  custom: {
    property: "value",
  },
};
```

---

## Performance Considerations

1. **CSS Variables** - Set once on root, inherited by all elements
2. **Frozen Constants** - All theme objects are immutable
3. **Lazy Loading** - Fonts load via Google Fonts API
4. **Minimal Repaints** - Theme change triggers single DOM update
5. **System Preference Detection** - Respects `prefers-color-scheme` media query

---

## Browser Support

- **Chrome/Edge:** ✓ Full support
- **Firefox:** ✓ Full support
- **Safari:** ✓ Full support (CSS variables + Media queries)
- **IE 11:** ✗ Not supported (CSS variables)

---

## Best Practices

1. **Use CSS Variables** for performance-critical styling
2. **Use Theme Objects** for complex logic and multiple properties
3. **Use useTheme Hook** in React components for reactive updates
4. **Minimize Direct Color** references - use semantic color names
5. **Test Both Modes** - ensure readability in light and dark
6. **Follow Font Scale** - stick to predefined sizes for consistency
7. **Respect Spacing Scale** - use `--spacing-*` variables for alignment

---

## Future Enhancements

- [ ] Custom theme creation UI
- [ ] Color scheme generator
- [ ] Accessibility contrast checker
- [ ] Animation preferences (`prefers-reduced-motion`)
- [ ] High contrast mode support
- [ ] System theme sync with OS settings
- [ ] Theme export/import functionality
