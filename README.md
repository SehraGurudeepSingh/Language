# Language - Modular Glyph Grid System

A clean, scalable React application for designing, visualizing, and animating custom writing system glyphs using an interactive grid-based editor.

## Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher

### Installation

```bash
# Navigate to project directory
cd Language

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` with hot module reload enabled.

### Build for Production

```bash
npm run build
```

Output: `dist/` directory ready for deployment.

---

## Architecture Overview

This project follows a **layered modular architecture** with clear separation of concerns:

```
src/
├── components/        # React UI components (6 modules)
├── context/          # Global state management (GridContext)
├── hooks/            # Custom React hooks (3 utilities)
├── utils/            # Pure utility functions (6 domain modules)
├── constants/        # Application constants (5 thematic modules)
├── types/            # TypeScript definitions (optional)
└── App.jsx           # Main app entry point
```

### Core Design Principles

1. **Single Responsibility**: Each file has one clear purpose
2. **Separation of Concerns**: UI, Logic, Data, and State are cleanly layered
3. **Barrel Exports**: Clean import paths via index.js files in each module
4. **No Circular Dependencies**: Imports flow downward (components → hooks → utils → constants)
5. **Pure Functions**: Utilities are side-effect-free and independently testable
6. **Performance**: O(1) lookups via precomputed maps, frozen constants for immutability

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Folder Structure

### Components (`src/components/`)

6 React components, each in its own subdirectory with barrel export:

| Component          | Purpose                                                      | Lines |
| ------------------ | ------------------------------------------------------------ | ----- |
| **GridEditor**     | Master grid control with segment toggling and numeric inputs | ~150  |
| **GlyphSVG**       | Core SVG renderer for glyph visualization                    | ~120  |
| **GlyphEditor**    | Interactive glyph designer with type/breath/node controls    | ~150  |
| **WordDisplay**    | Renders words in vertical or spiral layouts                  | ~150  |
| **AnimatedGlyph**  | Breath-synchronized stroke animation                         | ~50   |
| **KeyboardLayout** | Visual keyboard display with glyph previews                  | ~50   |

**Example import:**

```javascript
import { GridEditor, GlyphSVG } from "./src/components";
```

### Context (`src/context/`)

Global state management via React Context API:

- **GridContext**: Provides `{ grid, setGrid, activeSegs, setActiveSegs }` to all components
- Used by GridEditor, GlyphSVG, and GlyphEditor components

**Example usage:**

```javascript
const { grid, activeSegs } = useContext(GridContext);
```

### Hooks (`src/hooks/`)

3 custom hooks for common patterns:

| Hook                   | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| **useGlyphValidation** | Validates all glyphs on component mount, returns validation results               |
| **useOpenType**        | Loads OpenType.js library from CDN, returns { loaded, error }                     |
| **useGlyphEvolution**  | State wrapper around glyph evolution, returns { glyphs, setGlyphs, evolveGlyphs } |

**Example usage:**

```javascript
const { glyphs, evolveGlyphs } = useGlyphEvolution();
```

### Utilities (`src/utils/`)

6 domain-specific utility modules with pure functions:

| Module              | Key Functions                                                                | Purpose                                 |
| ------------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **glyphValidation** | `validateGlyph`, `validateAllGlyph`, `findDuplicateGlyphs`, `isValidSegment` | Glyph integrity checking                |
| **glyphGenome**     | `encodeGenome`, `decodeGenome`                                               | 32-bit glyph encoding/decoding          |
| **pathBuilding**    | `buildPath`, `getStrokeOrder`                                                | SVG generation and animation sequencing |
| **glyphEvolution**  | `isConnected`, `generateRandomGlyph`, `evolveGlyphs`                         | Generative design logic                 |
| **helpers**         | `spiralPositions`, `semanticToGlyphs`                                        | Layout and coordinate mapping           |
| **segments**        | `normalizeSegment`, `SEGMENT_LOOKUP`, `isSegmentDefined`                     | Segment validation and lookup           |

**Example usage:**

```javascript
import { validateAllGlyph, buildPath } from "./src/utils";
```

### Constants (`src/constants/`)

5 thematic constant modules defining the application data model:

| Module        | Content                                                           | Purpose                        |
| ------------- | ----------------------------------------------------------------- | ------------------------------ |
| **theme**     | THEME object (11 properties)                                      | Color scheme and styling       |
| **grid**      | NODE_KEYS, ALL_SEGS, DEFAULT_GRID                                 | Grid configuration             |
| **glyphs**    | CONS array (24 glyphs), BY_NUM, BY_NAME maps                      | Glyph definitions and lookups  |
| **phonetics** | PHONETIC_CORES, SUBSETS, VARIANTS, COGNITIVE_AXES, LATIN_TO_GLYPH | Phonetic data and IPA mappings |
| **genome**    | GENOME_BITS, EDGE_TYPES                                           | Glyph genome structure         |

**Key features:**

- All lookup maps use `Object.freeze()` for immutability
- `LATIN_TO_GLYPH` extended with 30+ IPA mappings
- `BY_NAME` and `BY_NUM` enable O(1) glyph access
- `SEGMENT_LOOKUP` Set enables O(1) segment validation

**Example usage:**

```javascript
import { CONS, BY_NAME, THEME } from "./src/constants";
```

---

## Data Model

### Glyph Structure

```javascript
{
  name: "A",                              // Glyph identifier
  type: "consonant" | "vowel" | "modifier",
  segs: [[x1,y1], [x2,y2], ...],        // Line segments (validated)
  breath: "plain" | "aspirated" | "ejective",
  nodes: [1, 5, 9],                      // Grid node indices (validated)
  IPA: "ɑ"                               // Phonetic representation
}
```

### Grid Model

```javascript
{
  cols: 3,                               // Column count
  rows: 3,                               // Row count
  nodeSpacing: 50,                       // Pixels between nodes
  nodes: [                               // Master glyph data
    { id: 1, x: 0, y: 0 },
    // ... 9 total nodes
  ]
}
```

### Genome Structure

32-bit encoding:

- Bits 0-2: Segment type (8 edge types)
- Bits 3-5: Breath type (plain/aspirated/ejective)
- Bits 6-31: Segment pair indices (26 bits for up to 64 segments)

---

## Development Workflow

### Hot Module Reload

The dev server automatically reloads when you save files. No manual refresh needed.

### Browser DevTools

1. Open `http://localhost:5173`
2. Press F12 to open DevTools
3. **Console**: Shows validation results on app startup (24/24 glyphs validated, 0 errors)
4. **React DevTools**: Inspect component hierarchy and props

### Common Tasks

**Add a new component:**

```bash
mkdir src/components/MyComponent
# Create MyComponent.jsx
# Create index.js with barrel export
```

**Add a new utility:**

```bash
# Create src/utils/myUtility.js
# Export from src/utils/index.js
```

**Add a new constant module:**

```bash
# Create src/constants/myConstants.js
# Export from src/constants/index.js
```

---

## Validation System

The app performs comprehensive glyph validation on startup:

**Checks performed:**

1. ✓ Glyph name defined and non-empty
2. ✓ Glyph type valid (consonant/vowel/modifier)
3. ✓ Segments array present and non-empty
4. ✓ Breath type valid (plain/aspirated/ejective)
5. ✓ Nodes array references valid grid indices
6. ✓ All nodes are connected (graph connectivity)

**Duplicate detection:** Checks for duplicate glyphs using `glyphKey` hash.

View results in browser console:

```
✓ All 24 glyphs validated
✓ 0 errors, 0 duplicates
✓ Modular architecture complete
```

---

## Performance Optimizations

- **O(1) glyph lookups**: `BY_NAME` and `BY_NUM` maps enable constant-time access
- **O(1) segment validation**: `SEGMENT_LOOKUP` Set for membership checking
- **Frozen constants**: `Object.freeze()` prevents accidental mutations
- **Precomputed lookups**: Segment normalization uses `ALL_SEGS_NORMALIZED` array
- **Memoization**: React hooks prevent unnecessary re-renders

---

## Troubleshooting

### App won't start

- Verify Node.js version: `node --version` (requires 16.x+)
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check terminal for error messages

### Port 5173 already in use

```bash
# Find and kill process using port 5173
# Windows: Open Task Manager → End node.exe process
# Or use: npx kill-port 5173
```

### Glyph not rendering

- Check browser console for validation errors
- Verify glyph segments are properly defined in constants
- Ensure breath type is one of: "plain", "aspirated", "ejective"

### HMR not working

- Refresh browser manually (Ctrl+R / Cmd+R)
- Restart dev server: `npm run dev`
- Check that no other process is using port 5173

---

## Project Statistics

- **Total files**: 14 (6 components, 6 utilities, 5 constants, 1 context, 3 hooks, App.jsx)
- **Total lines of code**: ~2,000 (original monolithic: 2,807)
- **Components**: 6 extracted React modules
- **Utilities**: 6 pure function modules
- **Constants**: 5 thematic modules
- **Glyphs**: 24 validated consonants
- **Segments**: 12 grid segments
- **Grid nodes**: 9 (3x3)
- **Build size**: ~150KB (production bundle)

---

## Technologies

- **React** 19.x - UI framework
- **Vite** 7.3.1 - Build tool and dev server
- **OpenType.js** - Font and glyph manipulation (loaded from CDN)
- **SVG** - Vector graphics rendering

---

## File Reference

| File                                                       | Purpose                             |
| ---------------------------------------------------------- | ----------------------------------- |
| [src/App.jsx](src/App.jsx)                                 | Main app entry point (145 lines)    |
| [src/components/index.js](src/components)                  | Component barrel export             |
| [src/utils/index.js](src/utils)                            | Utility barrel export               |
| [src/constants/index.js](src/constants)                    | Constants barrel export             |
| [src/hooks/index.js](src/hooks)                            | Hooks barrel export                 |
| [src/context/GridContext.jsx](src/context/GridContext.jsx) | Global state context                |
| [ARCHITECTURE.md](ARCHITECTURE.md)                         | Detailed architecture documentation |
| [package.json](package.json)                               | Dependencies and scripts            |
| [vite.config.js](vite.config.js)                           | Vite configuration                  |

---

## Next Steps

1. **Explore components** - Open `src/components/*/` directories to understand UI layer
2. **Review architecture** - Read [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design decisions
3. **Try the editor** - Run `npm run dev` and interact with GridEditor
4. **Extend functionality** - Follow the modular patterns to add new features

---

## License

[Add your license here]

---

## Support

For questions or issues:

1. Check browser console (F12) for validation errors
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for design patterns
3. Examine existing components/utils for implementation examples
