# Glyph Studio Debug Guide

## Browser Console Commands

Open DevTools (F12) and paste these into the Console tab:

---

## 1. Validation Report
```js
window._GLYPH_DEBUG.allValidationResults.map((r, i) => 
  ({glyph: i, valid: r.valid, errors: r.errors.length})
)
```

---

## 2. Get a Specific Glyph
```js
// By name
window._GLYPH_DEBUG.BY_NAME['S']

// By number
window._GLYPH_DEBUG.BY_NUM[1]

// All sibilants
window._GLYPH_DEBUG.CONS.filter(g => g.type === 'sibilant')
```

---

## 3. Validate a Single Glyph
```js
const glyph = window._GLYPH_DEBUG.BY_NAME['S'];
window._GLYPH_DEBUG.validateGlyph(glyph)
```

Output:
```
{
  valid: true,
  errors: []
}
```

---

## 4. Find Duplicates
```js
window._GLYPH_DEBUG.duplicates
```

If empty: `[]` (no duplicates found ✓)

---

## 5. Check Glyph Segments
```js
const s = window._GLYPH_DEBUG.BY_NAME['S'];
console.table(s.segs)
```

---

## 6. Get Glyph Metadata
```js
const s = window._GLYPH_DEBUG.BY_NAME['S'];
console.log({
  name: s.name,
  type: s.type,
  breath: s.breath,
  bn: s.bn,
  segCount: s.segs.length,
  ipa: s.ipa,
  desc: s.desc
})
```

---

## 7. List All Glyph Names
```js
window._GLYPH_DEBUG.CONS.map(g => g.name)
```

---

## 8. Validate All Again (if modified)
```js
const result = window._GLYPH_DEBUG.validateGlyph(
  window._GLYPH_DEBUG.BY_NAME['S']
);
console.log(`Valid: ${result.valid}`, result.errors)
```

---

## 9. Find Glyphs of Type
```js
// Find all plosives
window._GLYPH_DEBUG.CONS.filter(g => g.type === 'plosive')
  .map(g => g.name)

// Count by type
const byType = {};
window._GLYPH_DEBUG.CONS.forEach(g => {
  byType[g.type] = (byType[g.type] || 0) + 1;
});
console.table(byType)
```

Output:
```
plosive:   9
resonant:  8
sibilant:  7
```

---

## 10. Check Specific Segment Validity
```js
// Inside App.jsx, the isValidSegment() function is available
// But it's not exposed to window. To use it from console:

// Alternative: check if segment is in ALL_SEGS
const seg = ["ML", "BL"];
const ALL_SEGS_STR = [
  "TL-TC", "TC-TR", "ML-MC", "MC-MR", "BL-BC", "BC-BR",
  "TL-ML", "TC-MC", "TR-MR", "ML-BL", "MC-BC", "MR-BR"
];
const segStr = [seg[0], seg[1]].sort().join("-");
console.log(`Is valid: ${ALL_SEGS_STR.includes(segStr)}`)
```

---

## 11. Export All Data
```js
const exportData = {
  glyphs: window._GLYPH_DEBUG.CONS,
  byName: window._GLYPH_DEBUG.BY_NAME,
  byNum: window._GLYPH_DEBUG.BY_NUM,
  validation: window._GLYPH_DEBUG.allValidationResults,
  duplicates: window._GLYPH_DEBUG.duplicates,
};
copy(JSON.stringify(exportData, null, 2))
// Then paste in file or another app
```

---

## 12. Real-Time Monitor (if needed)
```js
// Create a periodic health check
setInterval(() => {
  const invalid = window._GLYPH_DEBUG.allValidationResults
    .filter(r => !r.valid);
  if (invalid.length > 0) {
    console.warn('⚠ Found invalid glyphs:', invalid);
  } else {
    console.log('✓ All glyphs valid');
  }
}, 5000); // Check every 5 seconds
```

---

## Tips

- Use `console.table()` to view array data nicely
- Use `copy()` to copy to clipboard (Chrome/Firefox)
- Use `JSON.stringify(data, null, 2)` to pretty-print objects
- All lookups are case-sensitive: `BY_NAME['S']` ✓ but not `BY_NAME['s']`

---

Generated: 2026-03-12
