# Glyph Studio – Enterprise Architecture

## Overview

This document describes the clean, scalable folder structure for the Glyph Studio React application.

---

## Folder Structure

```
src/
├── components/              # React UI Components
│   ├── GlyphSVG/           # Core glyph rendering
│   │   ├── GlyphSVG.jsx
│   │   ├── GlyphSVG.module.css
│   │   └── index.js
│   ├── GridEditor/         # Master grid editor
│   │   ├── GridEditor.jsx
│   │   ├── GridEditor.module.css
│   │   └── index.js
│   ├── GlyphEditor/        # Interactive glyph designer
│   │   ├── GlyphEditor.jsx
│   │   ├── GlyphEditor.module.css
│   │   └── index.js
│   ├── WordDisplay/        # Word rendering (vertical/spiral)
│   │   ├── WordDisplay.jsx
│   │   ├── WordDisplay.module.css
│   │   └── index.js
│   ├── AnimatedGlyph/      # Breath-sync stroke animation
│   │   ├── AnimatedGlyph.jsx
│   │   ├── AnimatedGlyph.module.css
│   │   └── index.js
│   ├── EvolutionEngine/    # Procedural glyph evolution
│   │   ├── EvolutionEngine.jsx
│   │   ├── EvolutionEngine.module.css
│   │   └── index.js
│   ├── CognitiveMap/       # Semantic coordinate → word generator
│   │   ├── CognitiveMap.jsx
│   │   ├── CognitiveMap.module.css
│   │   ├── FractalWordDisplay.jsx
│   │   └── index.js
│   ├── FontExporter/       # TTF font download
│   │   ├── FontExporter.jsx
│   │   ├── FontExporter.module.css
│   │   └── index.js
│   ├── KeyboardLayout/     # Visual keyboard with glyphs
│   │   ├── KeyboardLayout.jsx
│   │   ├── KeyboardLayout.module.css
│   │   └── index.js
│   └── index.js            # Barrel export
│
├── context/                # React Context (State Management)
│   ├── GridContext.jsx     # Master grid + active segments
│   └── index.js
│
├── hooks/                  # Custom React Hooks
│   ├── useGlyphValidation.js   # Glyph validation
│   ├── useOpenType.js          # OpenType.js loader
│   ├── useGlyphEvolution.js    # Evolution logic
│   └── index.js
│
├── utils/                  # Pure Utility Functions
│   ├── glyphValidation.js  # validateGlyph, validateAllGlyphs, etc.
│   ├── glyphGenome.js      # encodeGenome, decodeGenome
│   ├── pathBuilding.js     # buildPath, getStrokeOrder
│   ├── glyphEvolution.js   # isConnected, evolveGlyphs
│   ├── helpers.js          # spiralPositions, semanticToGlyphs
│   ├── segments.js         # Segment normalization & lookup
│   ├── fontExport.js       # downloadTTF (to be extracted)
│   └── index.js
│
├── constants/              # Application Constants
│   ├── theme.js            # Color scheme & styling
│   ├── grid.js             # Grid configuration, NODE_KEYS, ALL_SEGS
│   ├── glyphs.js           # CONS array, BY_NUM, BY_NAME
│   ├── phonetics.js        # PHONETIC_CORES, SUBSETS, VARIANTS
│   ├── genome.js           # GENOME_BITS, EDGE_TYPES
│   └── index.js
│
├── types/                  # TypeScript/JSDoc Type Definitions
│   ├── glyph.d.ts
│   ├── grid.d.ts
│   └── index.d.ts
│
├── App.jsx                 # Main app component (refactored)
├── main.jsx                # Vite entry point
└── [other config files]    # package.json, vite.config.js, etc.
```

---

## Design Principles

### 1. **Single Responsibility**

Each file/module has one clear purpose:

- Components handle UI rendering
- Utils handle business logic
- Constants define data
- Hooks manage side effects

### 2. **Separation of Concerns**

- **Presentation** (Components): React JSX, event handlers, styling
- **State Management** (Context + Hooks): Grid state, active segments
- **Business Logic** (Utils): Validation, evolution, genome encoding
- **Configuration** (Constants): Theme, phonetics, grid setup

### 3. **Barrel Exports**

Each directory has an `index.js`:

```js
// Bad:
import { GlyphSVG } from "../../components/GlyphSVG/GlyphSVG";

// Good:
import { GlyphSVG } from "../../components";
```

### 4. **Minimal Dependencies**

- Components import from context + utils + constants
- Utils are pure (no React dependencies)
- Constants have no dependencies
- Hooks import from context + utils

### 5. **Testability**

Pure utility functions are easy to test:

```js
import { validateGlyph } from "../utils";

test("validateGlyph detects missing fields", () => {
  const result = validateGlyph({ name: "S" });
  expect(result.valid).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});
```

---

## File Responsibilities

### Constants

| File           | Exports                                           | Purpose                         |
| -------------- | ------------------------------------------------- | ------------------------------- |
| `theme.js`     | THEME                                             | Color palette, visual constants |
| `grid.js`      | NODE_KEYS, ALL_SEGS, DEFAULT_GRID                 | Grid layout                     |
| `glyphs.js`    | CONS, BY_NUM, BY_NAME                             | 24 consonant glyphs             |
| `phonetics.js` | PHONETIC_CORES, SUBSETS, VARIANTS, LATIN_TO_GLYPH | Language structure              |
| `genome.js`    | GENOME_BITS, EDGE_TYPES                           | Glyph encoding                  |

### Utils

| File                 | Key Exports                                           | Purpose                      |
| -------------------- | ----------------------------------------------------- | ---------------------------- |
| `glyphValidation.js` | validateGlyph, validateAllGlyphs, findDuplicateGlyphs | Data integrity               |
| `glyphGenome.js`     | encodeGenome, decodeGenome                            | Compact glyph representation |
| `pathBuilding.js`    | buildPath, getStrokeOrder                             | SVG path generation          |
| `glyphEvolution.js`  | evolveGlyphs, generateRandomGlyph, isConnected        | Procedural generation        |
| `helpers.js`         | spiralPositions, semanticToGlyphs                     | Layout + semantic mapping    |
| `segments.js`        | normalizeSegment, SEGMENT_LOOKUP                      | Fast segment validation      |

### Context

| File              | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `GridContext.jsx` | Provides grid state + active segments to all components |

### Hooks

| File                    | Purpose                      | Usage                                           |
| ----------------------- | ---------------------------- | ----------------------------------------------- |
| `useGlyphValidation.js` | Validate glyphs on mount     | `const validation = useGlyphValidation()`       |
| `useOpenType.js`        | Load OpenType.js library     | `useOpenType()`                                 |
| `useGlyphEvolution.js`  | Manage glyph evolution state | `const [evolved, evolve] = useGlyphEvolution()` |

### Components

Each component folder has:

- `ComponentName.jsx` – React component
- `ComponentName.module.css` – Scoped styles (optional)
- `index.js` – Clean export

---

## Data Flow

```
User Input
    ↓
Component (UI Layer)
    ↓
Hooks (Side Effects, State)
    ↓
Context (Global State)
    ↓
Utils (Business Logic)
    ↓
Constants (Reference Data)
```

### Example: Master Grid Editor

```
GridEditor Component
    ↓ [reads from]
GridContext (grid, setGrid, activeSegs, setActiveSegs)
    ↓ [uses]
glyphValidation.validateGlyph()
    ↓ [reads from]
Constants (NODE_KEYS, ALL_SEGS, THEME)
    ↓ [renders]
GlyphSVG (uses context + props)
```

---

## Import Patterns

### Good Imports ✓

```jsx
// From barrel exports
import { GlyphSVG, GridEditor } from "../components";
import { CONS, THEME } from "../constants";
import { validateGlyph, evolveGlyphs } from "../utils";
import { useGlyphValidation } from "../hooks";
import { GridContext } from "../context";

// Direct for rarely-used items
import { isConnected } from "../utils/glyphEvolution";
```

### Bad Imports ✗

```jsx
// Avoid deep paths
import GlyphSVG from "../../../components/GlyphSVG/GlyphSVG";

// Avoid importing from utils in constants
import { CONS } from "../constants/glyphs"; // OK
import { validateGlyph } from "../utils/glyphValidation"; // OK
// but NOT: import { CONS } from '../utils'; // breaks layering

// Don't import components in utils
// Utils must be pure, no React dependencies
```

---

## Migration Checklist

- [ ] Extract all constants to `src/constants/*`
- [ ] Create `src/context/GridContext.jsx`
- [ ] Extract pure utils to `src/utils/*`
- [ ] Create custom hooks in `src/hooks/*`
- [ ] Extract component JSX to `src/components/*/Component.jsx`
- [ ] Create barrel exports (`index.js`) for each directory
- [ ] Update `App.jsx` with new imports
- [ ] Update `main.jsx` if needed
- [ ] Test app in browser (F12 console)
- [ ] Verify no console errors
- [ ] Commit to git

---

## Scalability Benefits

✓ Easy to add new components (just create folder + JSX + index.js)  
✓ Easy to add new utils (utilities don't depend on UI)  
✓ Easy to test (pure functions in utils)  
✓ Easy to share code (barrel exports)  
✓ Easy to onboard new developers (clear structure)  
✓ Easy to refactor (change implementation, not APIs)  
✓ Easy to optimize (split code by route)

---

## Next Steps

1. **Create components** – Extract each major UI piece
2. **Extract hooks** – useGlyphValidation, useOpenType, etc.
3. **Create barrel exports** – Clean imports throughout
4. **Add CSS Modules** – Optional: `Component.module.css`
5. **Add tests** – Jest + React Testing Library
6. **Add TypeScript** – Optional: `.d.ts` files or migrate to `.tsx`

---

Generated: 2026-03-12
Architecture: Enterprise-Grade React Application
