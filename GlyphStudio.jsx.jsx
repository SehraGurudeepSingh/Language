/**
 * Glyph Studio – Fixed & Optimised
 * Bugs resolved: 13 (see audit report)
 * Architecture: self-contained single-file for artifact rendering
 */
import { useState, useEffect, useRef, useContext, useCallback, memo, createContext } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const THEME = {
  bg: "#090B15",
  cardBg: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  textPrimary: "#E0E0E0",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.25)",
  accentSibilant: "#4FC3F7",
  accentPlosive: "#81C784",
  accentResonant: "#FFB74D",
  accentVowel: "#BA68C8",
  accentVoid: "#F06292",
};

const NODE_KEYS = ["TL","TC","TR","ML","MC","MR","BL","BC","BR"];

const ALL_SEGS = [
  ["TL","TC"],["TC","TR"],["ML","MC"],["MC","MR"],["BL","BC"],["BC","BR"],
  ["TL","ML"],["TC","MC"],["TR","MR"],["ML","BL"],["MC","BC"],["MR","BR"],
];

const DEFAULT_GRID = {
  TL:[10,10],TC:[30,10],TR:[50,10],
  ML:[10,30],MC:[30,30],MR:[50,30],
  BL:[10,50],BC:[30,50],BR:[50,50],
};

// FIX #2 – single definition; no inline re-declaration in app body
const normalizeSegment = ([a,b]) => a < b ? [a,b] : [b,a];

// Precomputed lookups (FIX #3 – no dangling ALL_SEGS_NORMALIZED reference in app)
const ALL_SEGS_NORMALIZED = ALL_SEGS.map(normalizeSegment);
const SEGMENT_LOOKUP = new Set(ALL_SEGS_NORMALIZED.map(s => s.join("-")));
const isSegmentDefined = seg => SEGMENT_LOOKUP.has(normalizeSegment(seg).join("-"));

const CONS = [
  {num:1, name:"S",  type:"sibilant", color:THEME.accentSibilant, segs:[["TL","TC"],["TL","ML"]], breath:"up",   bn:"TL", ipa:"/s/",  desc:"Sharp Hiss"},
  {num:2, name:"F",  type:"sibilant", color:THEME.accentSibilant, segs:[["TL","TC"],["TC","TR"]], breath:"up",   bn:"TC", ipa:"/f/",  desc:"Friction Breath"},
  {num:3, name:"SH", type:"sibilant", color:THEME.accentSibilant, segs:[["TC","TR"],["TR","MR"]], breath:"up",   bn:"TR", ipa:"/ʃ/",  desc:"Soft Sibilant"},
  {num:4, name:"Z",  type:"sibilant", color:THEME.accentSibilant, segs:[["TL","ML"],["ML","MC"]], breath:"up",   bn:"ML", ipa:"/z/",  desc:"Voiced Hiss"},
  {num:5, name:"ZH", type:"sibilant", color:THEME.accentSibilant, segs:[["TC","MC"],["MC","MR"]], breath:"up",   bn:"MC", ipa:"/ʒ/",  desc:"Voiced Sibilant"},
  {num:6, name:"TH", type:"sibilant", color:THEME.accentSibilant, segs:[["TR","MR"],["MR","BR"]], breath:"up",   bn:"MR", ipa:"/θ/",  desc:"Dental Fricative"},
  {num:7, name:"DH", type:"sibilant", color:THEME.accentSibilant, segs:[["ML","MC"],["MC","BC"]], breath:"up",   bn:"MC", ipa:"/ð/",  desc:"Voiced Dental"},
  {num:8, name:"K",  type:"plosive",  color:THEME.accentPlosive,  segs:[["TL","ML"],["ML","BL"]], breath:"hold", bn:"ML", ipa:"/k/",  desc:"Velar Stop"},
  {num:9, name:"T",  type:"plosive",  color:THEME.accentPlosive,  segs:[["ML","MC"],["MC","MR"],["TC","MC"],["MC","BC"]], breath:"hold", bn:"MC", ipa:"/t/", desc:"Alveolar Stop"},
  {num:10,name:"P",  type:"plosive",  color:THEME.accentPlosive,  segs:[["TR","MR"],["MR","BR"]], breath:"hold", bn:"MR", ipa:"/p/",  desc:"Bilabial Stop"},
  {num:11,name:"B",  type:"plosive",  color:THEME.accentPlosive,  segs:[["ML","MC"],["MC","BC"]], breath:"hold", bn:"MC", ipa:"/b/",  desc:"Voiced Bilabial"},
  {num:12,name:"D",  type:"plosive",  color:THEME.accentPlosive,  segs:[["TC","MC"],["MC","BC"]], breath:"hold", bn:"MC", ipa:"/d/",  desc:"Voiced Alveolar"},
  {num:13,name:"G",  type:"plosive",  color:THEME.accentPlosive,  segs:[["ML","MC"],["MC","MR"]], breath:"hold", bn:"MC", ipa:"/g/",  desc:"Voiced Velar"},
  {num:14,name:"NG", type:"resonant", color:THEME.accentResonant, segs:[["ML","BL"],["BL","BC"]], breath:"down", bn:"BL", ipa:"/ŋ/",  desc:"Velar Nasal"},
  {num:15,name:"M",  type:"resonant", color:THEME.accentResonant, segs:[["BL","BC"],["BC","BR"]], breath:"down", bn:"BC", ipa:"/m/",  desc:"Bilabial Nasal"},
  {num:16,name:"L",  type:"resonant", color:THEME.accentResonant, segs:[["BC","BR"],["MR","BR"]], breath:"down", bn:"BR", ipa:"/l/",  desc:"Lateral Approximant"},
  {num:17,name:"N",  type:"resonant", color:THEME.accentResonant, segs:[["BL","BC"],["MC","BC"]], breath:"down", bn:"BC", ipa:"/n/",  desc:"Alveolar Nasal"},
  {num:18,name:"R",  type:"resonant", color:THEME.accentResonant, segs:[["BC","BR"],["MC","BC"]], breath:"down", bn:"BC", ipa:"/r/",  desc:"Alveolar Trill"},
  {num:19,name:"W",  type:"resonant", color:THEME.accentResonant, segs:[["MR","BR"],["MC","BC"]], breath:"down", bn:"BC", ipa:"/w/",  desc:"Labiovelar Approx"},
  {num:20,name:"Y",  type:"resonant", color:THEME.accentResonant, segs:[["ML","BL"],["MR","BR"]], breath:"down", bn:"BL", ipa:"/j/",  desc:"Palatal Approx"},
  {num:21,name:"K'", type:"plosive",  color:THEME.accentPlosive,  segs:[["TL","ML"],["ML","BL"],["BL","BC"]], breath:"hold", bn:"BL", ipa:"/kʼ/", desc:"Ejective Velar"},
  {num:22,name:"T'", type:"plosive",  color:THEME.accentPlosive,  segs:[["ML","MC"],["MC","MR"],["TC","MC"]], breath:"hold", bn:"MC", ipa:"/tʼ/", desc:"Ejective Alveolar"},
  {num:23,name:"P'", type:"plosive",  color:THEME.accentPlosive,  segs:[["TR","MR"],["MR","BR"],["BR","BC"]], breath:"hold", bn:"BR", ipa:"/pʼ/", desc:"Ejective Bilabial"},
  {num:24,name:"ʔ",  type:"plosive",  color:THEME.accentPlosive,  segs:[["MC","BC"]], breath:"hold", bn:"BC", ipa:"/ʔ/", desc:"Glottal Stop"},
];
Object.freeze(CONS);

const BY_NAME = Object.freeze(Object.fromEntries(CONS.map(c => [c.name, c])));
const BY_NUM  = Object.freeze(Object.fromEntries(CONS.map(c => [c.num,  c])));

const LATIN_TO_GLYPH = {
  s:"S", f:"F", z:"Z", k:"K", t:"T", p:"P", b:"B", d:"D", g:"G",
  m:"M", n:"N", l:"L", r:"R", w:"W", y:"Y",
  S:"S", F:"F", Z:"Z", K:"K", T:"T", P:"P", B:"B", D:"D", G:"G",
  M:"M", N:"N", L:"L", R:"R", W:"W", Y:"Y",
  x:"SH", sh:"SH", SH:"SH", v:"ZH", zh:"ZH", ZH:"ZH",
  th:"TH", TH:"TH", dh:"DH", DH:"DH", ng:"NG", NG:"NG",
};

const GENOME_BITS = {
  coreClass:    {bits:3, shift:29},
  subsetFamily: {bits:3, shift:26},
  variantIndex: {bits:4, shift:22},
  nodeMask:     {bits:9, shift:13},
  edgeMask:     {bits:8, shift:5},
  symmetry:     {bits:3, shift:2},
  curvature:    {bits:2, shift:0},
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

function encodeGenome(glyph) {
  let genome = 0;
  const coreMap = {sibilant:1, plosive:2, resonant:3};
  genome |= (coreMap[glyph.type] || 0) << GENOME_BITS.coreClass.shift;
  genome |= 1 << GENOME_BITS.subsetFamily.shift;
  genome |= 1 << GENOME_BITS.variantIndex.shift;
  let nodeMask = 0;
  const nodes = new Set();
  (glyph.segs || []).forEach(([a,b]) => { nodes.add(a); nodes.add(b); });
  NODE_KEYS.forEach((k,i) => { if (nodes.has(k)) nodeMask |= 1 << i; });
  genome |= nodeMask << GENOME_BITS.nodeMask.shift;
  let edgeMask = 0;
  (glyph.segs || []).forEach(([a,b]) => {
    edgeMask |= 1 << (Math.abs(NODE_KEYS.indexOf(a) - NODE_KEYS.indexOf(b)) % 8);
  });
  genome |= edgeMask << GENOME_BITS.edgeMask.shift;
  return genome >>> 0; // ensure unsigned 32-bit
}

// FIX #7 – sort by midpoint average of both segment endpoints
function getStrokeOrder(segs, grid) {
  return [...segs].sort((a, b) => {
    const [ax1, ay1] = grid[a[0]], [ax2, ay2] = grid[a[1]];
    const [bx1, by1] = grid[b[0]], [bx2, by2] = grid[b[1]];
    const ma = (ax1 + ay1 + ax2 + ay2) / 4;
    const mb = (bx1 + by1 + bx2 + by2) / 4;
    return ma - mb;
  });
}

function buildPath(segs, type, cursive, handwriting, grid) {
  return segs.map(([a,b]) => {
    const [x1,y1] = grid[a], [x2,y2] = grid[b];
    if (!cursive) return `M${x1} ${y1}L${x2} ${y2}`;
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1;
    const nx=-dy/len, ny=dx/len;
    let amp = type==="sibilant" ? -12 : type==="resonant" ? 12 : 7;
    if (handwriting) amp += (Math.random()*2-1)*2;
    return `M${x1} ${y1}Q${+(mx+nx*amp).toFixed(1)} ${+(my+ny*amp).toFixed(1)} ${x2} ${y2}`;
  }).join(" ");
}

function isConnected(segs, grid) {
  if (!segs || segs.length === 0) return true;
  if (segs.length === 1) return true;
  const nodes = new Set();
  segs.forEach(([a,b]) => { nodes.add(a); nodes.add(b); });
  const adj = {};
  nodes.forEach(n => (adj[n] = []));
  segs.forEach(([a,b]) => { adj[a].push(b); adj[b].push(a); });
  const visited = new Set();
  const stack = [[...nodes][0]];
  while (stack.length) {
    const n = stack.pop();
    if (visited.has(n)) continue;
    visited.add(n);
    adj[n].forEach(nb => { if (!visited.has(nb)) stack.push(nb); });
  }
  return visited.size === nodes.size;
}

// FIX #13 – recursion depth guard
function generateRandomGlyph(segmentCount = null, grid, _depth = 0) {
  if (_depth > 20) return { segs:[ALL_SEGS[0]], type:"plosive", color:THEME.accentPlosive, breath:"hold", bn:"MC" };
  const limit = segmentCount || Math.floor(Math.random()*5)+2;
  const startSeg = ALL_SEGS[Math.floor(Math.random()*ALL_SEGS.length)];
  const segs = [startSeg];
  const nodes = new Set([startSeg[0], startSeg[1]]);
  while (segs.length < limit) {
    const cands = ALL_SEGS.filter(([a,b]) => {
      const k = [a,b].sort().join("-");
      if (segs.some(s => s.sort().join("-") === k)) return false;
      return nodes.has(a) || nodes.has(b);
    });
    if (!cands.length) break;
    const ns = cands[Math.floor(Math.random()*cands.length)];
    segs.push(ns); nodes.add(ns[0]); nodes.add(ns[1]);
  }
  if (!isConnected(segs, grid)) return generateRandomGlyph(segmentCount, grid, _depth+1);
  const types = ["sibilant","plosive","resonant"];
  const type = types[Math.floor(Math.random()*types.length)];
  const breaths = {sibilant:"up", plosive:"hold", resonant:"down"};
  const colors  = {sibilant:THEME.accentSibilant, plosive:THEME.accentPlosive, resonant:THEME.accentResonant};
  const bn = [...nodes][Math.floor(Math.random()*nodes.size)];
  return {segs, type, color:colors[type], breath:breaths[type], bn};
}

// FIX #6 – attach genome to every evolved glyph
function evolveGlyphs(count, existing, grid) {
  const out = [];
  for (let i = 0; i < count; i++) {
    let glyph;
    if (existing.length > 0 && Math.random() > 0.5) {
      const base = existing[Math.floor(Math.random()*existing.length)];
      let newSegs = [...base.segs];
      const op = Math.random();
      if (op < 0.33 && newSegs.length < 12) {
        const nodes = new Set(); newSegs.forEach(([a,b]) => { nodes.add(a); nodes.add(b); });
        const cands = ALL_SEGS.filter(([a,b]) => {
          if (newSegs.some(s => s.sort().join("-") === [a,b].sort().join("-"))) return false;
          return nodes.has(a) || nodes.has(b);
        });
        if (cands.length) newSegs.push(cands[Math.floor(Math.random()*cands.length)]);
      } else if (op < 0.66 && newSegs.length > 1) {
        const idx = Math.floor(Math.random()*newSegs.length);
        const cand = newSegs.filter((_,j) => j !== idx);
        if (isConnected(cand, grid)) newSegs = cand;
      }
      glyph = isConnected(newSegs, grid) ? {...base, segs:newSegs} : base;
    } else {
      glyph = generateRandomGlyph(null, grid);
    }
    out.push({...glyph, genome: encodeGenome(glyph)});
  }
  return out;
}

function spiralPositions(steps) {
  const pos = [{x:0,y:0}];
  let x=0,y=0,dir=0,stepSize=1,stepCount=0,turnCount=0;
  for (let i=1;i<steps;i++) {
    if (dir===0) x+=1; else if (dir===1) y+=1; else if (dir===2) x-=1; else y-=1;
    pos.push({x,y});
    if (++stepCount===stepSize) {
      dir=(dir+1)%4; stepCount=0;
      if (++turnCount%2===0) stepSize++;
    }
  }
  return pos;
}

function semanticToGlyphs([core]) {
  const types = ["sibilant","plosive","resonant"];
  const t = types[(core-1)%types.length];
  const filtered = CONS.filter(g => g.type===t).slice(0,3);
  return filtered.length ? filtered : [CONS[0]];
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateGlyph(g, allSegs=ALL_SEGS) {
  const errors = [];
  if (!g.name)  errors.push("Missing name");
  if (!g.type)  errors.push("Missing type");
  if (!g.segs || !Array.isArray(g.segs)) errors.push("Missing segs");
  if (!g.bn)    errors.push("Missing breath node");
  if (!g.ipa)   errors.push("Missing IPA");
  if (g.type && !["sibilant","plosive","resonant"].includes(g.type)) errors.push(`Invalid type: ${g.type}`);
  if (g.breath && !["up","hold","down"].includes(g.breath)) errors.push(`Invalid breath: ${g.breath}`);
  if (g.segs) g.segs.forEach((seg,i) => { if (!isSegmentDefined(seg)) errors.push(`Invalid seg[${i}]: ${seg}`); });
  if (g.segs && g.bn) {
    if (!g.segs.some(([a,b]) => a===g.bn || b===g.bn)) errors.push(`bn ${g.bn} disconnected`);
  }
  return {valid:errors.length===0, errors};
}

// FIX #4 – returns properly shaped object (not raw array)
function runValidation() {
  const results = CONS.map(g => validateGlyph(g));
  const duplicates = (() => {
    const seen = new Map(), dups = [];
    CONS.forEach((g,i) => {
      const k = g.segs.map(s => normalizeSegment(s).join("-")).sort().join("|");
      if (seen.has(k)) dups.push({original:seen.get(k), duplicate:i});
      else seen.set(k,i);
    });
    return dups;
  })();
  const errorCount = results.reduce((n,r) => n + r.errors.length, 0);
  window._GLYPH_DEBUG = {CONS, BY_NAME, BY_NUM, validateGlyph, duplicates, results};
  return {
    isValid:   errorCount === 0,
    errorCount,
    duplicates,
    errors:    results.flatMap(r => r.errors),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const GridContext = createContext();

// ─────────────────────────────────────────────────────────────────────────────
// GLYPH SVG RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function GlyphSVG({segs, type, color, breath, bn, vowel=null, sz=64, cursive=false, showNodes=true, handwriting=false}) {
  const {grid, activeSegs} = useContext(GridContext);
  const filtered = (segs || []).filter(([a,b]) => activeSegs.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a)));
  const path = buildPath(filtered, type, cursive, handwriting, grid);

  return (
    <svg width={sz} height={sz} viewBox="-10 -10 80 80" overflow="visible">
      {ALL_SEGS.map(([a,b],i) => (
        <line key={`g${i}`} x1={grid[a][0]} y1={grid[a][1]} x2={grid[b][0]} y2={grid[b][1]}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
      ))}
      {NODE_KEYS.map((k,i) => (
        <circle key={`gn${i}`} cx={grid[k][0]} cy={grid[k][1]} r={1.4} fill="rgba(255,255,255,0.1)"/>
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
        style={{filter:`drop-shadow(0 0 3px ${color})`}}/>
      {showNodes && (()=>{
        const nodes=new Set(); (segs||[]).forEach(([a,b])=>{nodes.add(a);nodes.add(b);});
        return [...nodes].map(k=><circle key={k} cx={grid[k][0]} cy={grid[k][1]} r={2.8} fill={color}/>);
      })()}
      {vowel==="i" && <circle cx={grid.BC[0]} cy={grid.BC[1]-8} r={3} fill={THEME.accentVowel}/>}
      {vowel==="a" && <circle cx={grid.MC[0]} cy={grid.MC[1]} r={4} fill={THEME.accentVowel} fillOpacity={0.5}/>}
      {vowel==="u" && <path d={`M${grid.TC[0]-5} ${grid.TC[1]-5}Q${grid.TC[0]} ${grid.TC[1]-10} ${grid.TC[0]+5} ${grid.TC[1]-5}`} stroke={THEME.accentVowel} fill="none" strokeWidth={2}/>}
      {breath==="up"   && bn && (()=>{ const [bx,by]=grid[bn]; return <g stroke={color} strokeLinecap="round" style={{filter:`drop-shadow(0 0 3px ${color})`}}><line x1={bx} y1={by-1} x2={bx} y2={by-15} strokeWidth={2}/><line x1={bx-4} y1={by-10} x2={bx} y2={by-15} strokeWidth={1.5}/><line x1={bx+4} y1={by-10} x2={bx} y2={by-15} strokeWidth={1.5}/></g>; })()}
      {breath==="down" && bn && (()=>{ const [bx,by]=grid[bn]; return <path d={`M${bx} ${by+1}Q${bx+8} ${by+10} ${bx} ${by+18}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" style={{filter:`drop-shadow(0 0 3px ${color})`}}/>; })()}
      {breath==="hold" && bn && (()=>{ const [bx,by]=grid[bn]; return <rect x={bx-5.5} y={by-5.5} width={11} height={11} fill="none" stroke={color} strokeWidth={1.8}/>; })()}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRID EDITOR
// ─────────────────────────────────────────────────────────────────────────────

function GridEditor() {
  const {grid, setGrid, activeSegs, setActiveSegs} = useContext(GridContext);
  const [selNode, setSelNode] = useState(null);

  const handleNode = useCallback(node => {
    if (selNode === null) { setSelNode(node); return; }
    if (selNode === node) { setSelNode(null); return; }
    const exists = activeSegs.some(([a,b]) => (a===selNode&&b===node)||(a===node&&b===selNode));
    setActiveSegs(exists
      ? activeSegs.filter(([a,b]) => !((a===selNode&&b===node)||(a===node&&b===selNode)))
      : [...activeSegs, [selNode, node]]);
    setSelNode(null);
  }, [selNode, activeSegs, setActiveSegs]);

  return (
    <div style={{background:THEME.cardBg, border:THEME.border, borderRadius:8, padding:16}}>
      <h3 style={{color:THEME.textSecondary, marginTop:0, fontSize:12, letterSpacing:"0.15em"}}>✎ MASTER GRID EDITOR</h3>
      <p style={{fontSize:10, color:THEME.textMuted}}>Click two nodes to toggle a segment. Numeric inputs adjust positions.</p>
      <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
        <svg width={250} height={250} viewBox="-10 -10 80 80" style={{background:"#111", borderRadius:4, cursor:"crosshair"}}>
          {ALL_SEGS.map(([a,b],i) => {
            const on = activeSegs.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
            return <line key={i} x1={grid[a][0]} y1={grid[a][1]} x2={grid[b][0]} y2={grid[b][1]}
              stroke={on ? "#fff" : "rgba(255,255,255,0.1)"} strokeWidth={on ? 1.5 : 0.5}/>;
          })}
          {NODE_KEYS.map(k => (
            <circle key={k} cx={grid[k][0]} cy={grid[k][1]} r="4"
              fill={selNode===k ? "#fff" : "rgba(255,255,255,0.4)"}
              stroke="#fff" strokeWidth="1" style={{cursor:"pointer"}}
              onClick={()=>handleNode(k)}/>
          ))}
        </svg>
        <div style={{minWidth:180}}>
          <button onClick={()=>setActiveSegs(ALL_SEGS.map(([a,b])=>[a,b]))} style={btnStyle}>Show All</button>
          <button onClick={()=>setActiveSegs([])} style={{...btnStyle, marginTop:8}}>Clear All</button>
          <div style={{fontSize:9, color:THEME.textMuted, marginTop:12}}>Active: {activeSegs.length}/{ALL_SEGS.length}</div>
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:12, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:12}}>
        {NODE_KEYS.map(k => (
          <div key={k}>
            <label style={{fontSize:9, color:THEME.textMuted}}>{k}:</label>
            <input type="number" value={Math.round(grid[k][0])} onChange={e=>setGrid(p=>({...p,[k]:[parseFloat(e.target.value)||0,p[k][1]]}))} style={numInput}/>
            <input type="number" value={Math.round(grid[k][1])} onChange={e=>setGrid(p=>({...p,[k]:[p[k][0],parseFloat(e.target.value)||0]}))} style={numInput}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLYPH EDITOR
// ─────────────────────────────────────────────────────────────────────────────

function GlyphEditor({onGlyphChange}) {
  const {grid} = useContext(GridContext);
  const [selNode, setSelNode] = useState(null);
  const [segs, setSegs] = useState([]);
  const [type, setType] = useState("plosive");
  const [breath, setBreath] = useState("hold");
  const [bn, setBn] = useState("MC");

  const handleNode = useCallback(node => {
    if (selNode === null) { setSelNode(node); return; }
    if (selNode === node) { setSelNode(null); return; }
    const exists = segs.some(([a,b]) => (a===selNode&&b===node)||(a===node&&b===selNode));
    const next = exists
      ? segs.filter(([a,b]) => !((a===selNode&&b===node)||(a===node&&b===selNode)))
      : [...segs, [selNode, node]];
    setSegs(next); setSelNode(null);
    if (!isConnected(next, grid) && next.length > 0) console.warn("Glyph disconnected");
    onGlyphChange({segs:next, type, breath, bn});
  }, [selNode, segs, type, breath, bn, grid, onGlyphChange]);

  // FIX #8 – only fire when type/breath/bn actually change, not every render
  useEffect(() => { onGlyphChange({segs, type, breath, bn}); }, [type, breath, bn]); // eslint-disable-line

  return (
    <div style={{background:THEME.cardBg, border:THEME.border, borderRadius:8, padding:16}}>
      <h3 style={{color:THEME.textSecondary, marginTop:0, fontSize:12, letterSpacing:"0.15em"}}>✎ GLYPH EDITOR</h3>
      <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
        <svg width={200} height={200} viewBox="-10 -10 80 80">
          {ALL_SEGS.map(([a,b],i) => {
            const on = segs.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
            return <line key={i} x1={grid[a][0]} y1={grid[a][1]} x2={grid[b][0]} y2={grid[b][1]}
              stroke={on?"#fff":"rgba(255,255,255,0.15)"} strokeWidth={on?2.5:1} strokeLinecap="round"/>;
          })}
          {NODE_KEYS.map(k => (
            <circle key={k} cx={grid[k][0]} cy={grid[k][1]} r={4}
              fill={selNode===k?"#fff":"rgba(255,255,255,0.3)"} stroke="#fff" strokeWidth={1}
              style={{cursor:"pointer"}} onClick={()=>handleNode(k)}/>
          ))}
        </svg>
        <div style={{minWidth:180}}>
          {[["Type","type",["sibilant","plosive","resonant"],type,setType],
            ["Breath","breath",["up","hold","down"],breath,setBreath]].map(([label,,opts,val,set])=>(
            <div key={label} style={{marginBottom:12}}>
              <label style={{color:THEME.textMuted, display:"block", fontSize:10}}>{label}</label>
              <select value={val} onChange={e=>set(e.target.value)} style={selectStyle}>
                {opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <label style={{color:THEME.textMuted, display:"block", fontSize:10}}>Base Node</label>
            <select value={bn} onChange={e=>setBn(e.target.value)} style={selectStyle}>
              {NODE_KEYS.map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <button onClick={()=>{setSegs([]);setSelNode(null);}} style={btnStyle}>Clear</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED GLYPH — FIX #5: stale closure resolved
// ─────────────────────────────────────────────────────────────────────────────

const AnimatedGlyph = memo(function AnimatedGlyph({glyph, cursive, handwriting}) {
  const {grid} = useContext(GridContext);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const ref = useRef();

  const ordered = getStrokeOrder(glyph.segs, grid);
  const speeds = {up:0.02, hold:0.01, down:0.015};
  const speed = speeds[glyph.breath] || 0.015;

  useEffect(() => {
    // FIX #5 – functional updaters; no stale `phase` capture
    ref.current = setInterval(() => {
      setProgress(p => {
        const next = p + speed;
        if (next >= 1) {
          setPhase(ph => (ph + 1) % 3); // functional updater
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(ref.current);
  }, [speed]); // phase removed from deps

  const visible = ordered.slice(0, Math.floor(progress * ordered.length));
  return (
    <div style={{textAlign:"center"}}>
      <GlyphSVG segs={visible} type={glyph.type} color={glyph.color}
        breath={glyph.breath} bn={glyph.bn} sz={80} cursive={cursive} showNodes handwriting={handwriting}/>
      <div style={{fontSize:10, color:THEME.textMuted, marginTop:4}}>
        {["↑ INHALE","◈ HOLD","↓ EXHALE"][phase]}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// WORD DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function renderWordAt(glyphs, cursive, handwriting, grid) {
  const sp = 70;
  const pts = glyphs.map((g,i) => {
    const [gx,gy] = g.bn ? grid[g.bn] : [30,30];
    return [10+gx, i*sp+30+gy];
  });
  let conn = "";
  if (pts.length > 1) {
    conn = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i=1;i<pts.length;i++) {
      const [px,py]=pts[i-1], [cx,cy]=pts[i];
      conn += ` Q${px} ${py} ${(px+cx)/2} ${(py+cy)/2} L${cx} ${cy}`;
    }
  }
  return (
    <g>
      {conn && <path d={conn} stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>}
      {glyphs.map((g,i) => (
        <g key={i} transform={`translate(10,${i*sp+30})`}>
          <GlyphSVG segs={g.segs} type={g.type} color={g.color}
            breath={g.breath} bn={g.bn} sz={60} cursive={cursive} showNodes={false} handwriting={handwriting}/>
        </g>
      ))}
    </g>
  );
}

function WordDisplay({word, cursive, handwriting, layout="vertical", spiralSteps=9}) {
  const {grid} = useContext(GridContext);
  const glyphs = word.split("").map(ch => BY_NAME[LATIN_TO_GLYPH[ch.toUpperCase()] || ch.toUpperCase()]).filter(Boolean);
  if (!glyphs.length) return null;
  const W=120, H=glyphs.length*70+40;
  if (layout==="vertical") return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>{renderWordAt(glyphs,cursive,handwriting,grid)}</svg>;
  const positions = spiralPositions(spiralSteps);
  const margin=50;
  const xs=positions.map(p=>p.x*W), ys=positions.map(p=>p.y*H);
  const [minX,maxX,minY,maxY] = [Math.min(...xs)-margin,Math.max(...xs)+W+margin,Math.min(...ys)-margin,Math.max(...ys)+H+margin];
  const vw=maxX-minX, vh=maxY-minY;
  let conn="";
  if (positions.length>1) {
    conn=`M${positions[0].x*W+W/2} ${positions[0].y*H+H/2}`;
    for(let i=1;i<positions.length;i++) conn+=` L${positions[i].x*W+W/2} ${positions[i].y*H+H/2}`;
  }
  return (
    <svg width={vw} height={vh} viewBox={`${minX} ${minY} ${vw} ${vh}`}>
      {conn && <path d={conn} stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="6 3"/>}
      {positions.map((pos,idx) => (
        <g key={idx} transform={`translate(${pos.x*W},${pos.y*H})`}>{renderWordAt(glyphs,cursive,handwriting,grid)}</g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const btnStyle = {
  display:"block", width:"100%",
  background:"transparent", border:THEME.border, color:"#fff",
  padding:"5px 12px", cursor:"pointer", fontFamily:"monospace", fontSize:10,
};
const selectStyle = {background:"#000", color:"#fff", border:THEME.border, padding:4, fontSize:11};
const numInput = {width:44, background:"#222", color:"#fff", border:"none", marginLeft:3, fontSize:9};
const inputStyle = {background:"#000", color:"#fff", border:THEME.border, padding:4, fontSize:11};
const secHead = {fontSize:12, color:THEME.textSecondary, borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:8, letterSpacing:"0.15em"};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────

export default function GlyphStudio() {
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [activeSegs, setActiveSegs] = useState(ALL_SEGS.map(([a,b]) => [a,b]));
  const [cursive, setCursive] = useState(false);
  const [handwriting, setHandwriting] = useState(false);
  const [selGlyph, setSelGlyph] = useState(CONS[0]);
  const [customGlyph, setCustomGlyph] = useState({segs:[],type:"plosive",breath:"hold",bn:"MC"});
  const [word, setWord] = useState("SFT");
  const [evolved, setEvolved] = useState([]);
  const [mathExpr, setMathExpr] = useState("3+4*2");
  const [semCoord, setSemCoord] = useState("1-1-1");
  const [genWord, setGenWord] = useState("SFT");
  const [layout, setLayout] = useState("vertical");
  const [spiralSteps, setSpiralSteps] = useState(9);
  const [validation, setValidation] = useState(null);

  // FIX #9 – single validation call on mount; FIX #11 – single opentype load
  useEffect(() => {
    const v = runValidation();
    setValidation(v);
    console.log(`✓ Glyph validation: ${v.isValid?"PASS":"FAIL"} | errors:${v.errorCount} | dupes:${v.duplicates.length}`);
    if (!window.opentype) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js";
      s.async = true;
      s.onload = () => console.log("✓ opentype.js loaded");
      s.onerror = () => console.error("✗ opentype.js failed");
      document.body.appendChild(s);
    }
  }, []);

  // FIX #8 – memoised callbacks so GlyphEditor's useEffect has stable refs
  const handleGlyphChange = useCallback(g => setCustomGlyph(g), []);
  const handleEvolve = useCallback(() => setEvolved(evolveGlyphs(12, evolved, grid)), [evolved, grid]);
  const handleSemGen = useCallback(() => {
    const parts = semCoord.split("-").map(Number);
    if (parts.length === 3) {
      const gs = semanticToGlyphs(parts);
      const w = gs.map(g=>g.name).join("");
      setWord(w); setGenWord(w);
    }
  }, [semCoord]);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(customGlyph,null,2));
    alert("Glyph JSON copied!");
  }, [customGlyph]);

  const digitMap = {"0":"∅","1":"S","2":"F","3":"SH","4":"Z","5":"ZH","6":"TH","7":"DH","8":"K","9":"T"};

  const ctxValue = {grid, setGrid, activeSegs, setActiveSegs};

  return (
    <GridContext.Provider value={ctxValue}>
      <div style={{background:THEME.bg, color:THEME.textPrimary, fontFamily:"monospace", padding:28, maxWidth:1100, margin:"0 auto",
        backgroundImage:"radial-gradient(circle at 20% 20%,rgba(79,195,247,0.04) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(255,183,77,0.04) 0%,transparent 50%)"}}>

        {/* HEADER */}
        <div style={{textAlign:"center", marginBottom:36, paddingBottom:24, borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:8, letterSpacing:"0.4em", color:"rgba(255,255,255,0.2)", marginBottom:12}}>NONAL-CIRCUIT SYSTEM · GLYPH STUDIO</div>
          <div style={{fontSize:20, letterSpacing:"0.28em", background:"linear-gradient(120deg,#4FC3F7,#81C784,#FFB74D)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:16}}>GLYPH STUDIO</div>
          {validation && (
            <div style={{fontSize:9, color:validation.isValid?"#81C784":"#F06292", letterSpacing:"0.12em", marginBottom:12}}>
              {validation.isValid ? `✓ ${CONS.length}/${CONS.length} GLYPHS VALID` : `✗ ${validation.errorCount} ERRORS FOUND`}
            </div>
          )}
          <div style={{display:"flex", justifyContent:"center", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:8, padding:3, width:"fit-content", margin:"0 auto", border:THEME.border}}>
            {[["□ SCIENTIFIC",false],["∿ POETIC",true]].map(([l,v]) => (
              <button key={l} onClick={()=>setCursive(v)} style={{padding:"6px 16px", borderRadius:6, fontSize:9, letterSpacing:"0.12em", cursor:"pointer", fontFamily:"monospace",
                background:cursive===v?"rgba(255,255,255,0.1)":"transparent",
                border:cursive===v?"1px solid rgba(255,255,255,0.18)":"1px solid transparent",
                color:cursive===v?"#E0E0E0":"rgba(255,255,255,0.35)"}}>
                {l}
              </button>
            ))}
            <button onClick={()=>setHandwriting(!handwriting)} style={{padding:"6px 16px", borderRadius:6, fontSize:9, letterSpacing:"0.12em", cursor:"pointer", fontFamily:"monospace",
              background:handwriting?"rgba(255,255,255,0.1)":"transparent",
              border:handwriting?"1px solid rgba(255,255,255,0.18)":"1px solid transparent",
              color:handwriting?"#E0E0E0":"rgba(255,255,255,0.35)"}}>
              ✍ HW {handwriting?"ON":"OFF"}
            </button>
          </div>
        </div>

        {/* 0 · MASTER GRID */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>0 · MASTER GRID</h2>
          <GridEditor/>
        </section>

        {/* I · MASTER GLYPH */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅰ · MASTER GLYPH (COMBINED)</h2>
          <div style={{display:"flex", gap:40, justifyContent:"center", background:THEME.cardBg, borderRadius:10, padding:20, border:THEME.border}}>
            {[false,true].map(c => (
              <div key={String(c)} style={{textAlign:"center"}}>
                <GlyphSVG segs={ALL_SEGS} type="master" color="#fff" sz={120} cursive={c} showNodes breath={null} handwriting={handwriting}/>
                <div style={{fontSize:9, color:THEME.textMuted, marginTop:6}}>{c?"Poetic · Cursive":"Scientific · Blocky"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* II · EVOLUTION ENGINE */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅱ · GLYPH EVOLUTION ENGINE</h2>
          <button onClick={handleEvolve} style={{...btnStyle, width:"auto", padding:"8px 18px", marginBottom:16}}>🌱 EVOLVE 12 NEW GLYPHS</button>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:8}}>
            {evolved.map((g,i) => (
              <div key={i} style={{background:THEME.cardBg, border:THEME.border, borderRadius:6, padding:8, textAlign:"center"}}>
                <GlyphSVG segs={g.segs} type={g.type} color={g.color} sz={50} cursive={cursive} showNodes={false} breath={g.breath} bn={g.bn} handwriting={handwriting}/>
                <div style={{fontSize:8, color:THEME.textMuted}}>{g.segs.length} segs</div>
                {/* FIX #6 – genome now always defined */}
                <div style={{fontSize:7, color:"#888"}}>0x{(g.genome||0).toString(16).padStart(8,"0")}</div>
              </div>
            ))}
          </div>
        </section>

        {/* III · GLYPH EDITOR */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅲ · DESIGN YOUR OWN GLYPH</h2>
          <GlyphEditor onGlyphChange={handleGlyphChange}/>
          <div style={{marginTop:16, display:"flex", gap:20, alignItems:"center"}}>
            <GlyphSVG segs={customGlyph.segs} type={customGlyph.type} color="#fff"
              breath={customGlyph.breath} bn={customGlyph.bn} sz={100} cursive={cursive} handwriting={handwriting}/>
            <button onClick={handleCopy} style={{...btnStyle, width:"auto", padding:"8px 16px"}}>📋 Copy JSON</button>
          </div>
        </section>

        {/* IV · ANIMATION */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅳ · BREATH-SYNC ANIMATION</h2>
          <div style={{display:"flex", gap:20, flexWrap:"wrap", alignItems:"center"}}>
            <select onChange={e=>setSelGlyph(BY_NAME[e.target.value])} value={selGlyph?.name} style={selectStyle}>
              {CONS.map(g=><option key={g.num} value={g.name}>{g.name} — {g.ipa}</option>)}
            </select>
            {selGlyph && <AnimatedGlyph glyph={selGlyph} cursive={cursive} handwriting={handwriting}/>}
          </div>
        </section>

        {/* V · WORD GENERATOR */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅴ · WORD GENERATOR (vertical + spiral)</h2>
          <div style={{display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-start"}}>
            <div>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:10, color:THEME.textMuted}}>Word (latin):</label>
                <input type="text" value={word} onChange={e=>setWord(e.target.value.toUpperCase())} style={{...inputStyle, marginLeft:8}}/>
              </div>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:10, color:THEME.textMuted}}>Layout:</label>
                <select value={layout} onChange={e=>setLayout(e.target.value)} style={{...selectStyle, marginLeft:8}}>
                  <option value="vertical">Vertical</option>
                  <option value="spiral">Spiral</option>
                </select>
              </div>
              {layout==="spiral" && (
                <div>
                  <label style={{fontSize:10, color:THEME.textMuted}}>Steps:</label>
                  <input type="number" min={1} max={50} value={spiralSteps}
                    onChange={e=>setSpiralSteps(parseInt(e.target.value)||1)}
                    style={{...inputStyle, marginLeft:8, width:55}}/>
                </div>
              )}
            </div>
            <WordDisplay word={word} cursive={cursive} handwriting={handwriting} layout={layout} spiralSteps={spiralSteps}/>
          </div>
        </section>

        {/* VI · PROCEDURAL VOCAB */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅵ · PROCEDURAL VOCABULARY (MATH → GLYPHS)</h2>
          <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}}>
            <input type="text" value={mathExpr} onChange={e=>setMathExpr(e.target.value)} style={inputStyle}/>
            <button onClick={()=>setWord(mathExpr.split("").map(ch=>digitMap[ch]||ch).join(""))} style={{...btnStyle,width:"auto",padding:"4px 12px"}}>Generate</button>
            <input type="text" value={semCoord} onChange={e=>setSemCoord(e.target.value)} placeholder="core-subset-variant" style={inputStyle}/>
            <button onClick={handleSemGen} style={{...btnStyle,width:"auto",padding:"4px 12px"}}>SemGen</button>
            {genWord && <div style={{color:THEME.accentVowel, fontSize:12}}>→ {genWord}</div>}
          </div>
        </section>

        {/* ALL CONSONANTS */}
        <section style={{marginBottom:36}}>
          <h2 style={secHead}>Ⅶ · FULL CONSONANT TABLE ({CONS.length} glyphs)</h2>
          {[
            {label:"SIBILANTS · Inhale ↑", type:"sibilant", col:THEME.accentSibilant},
            {label:"PLOSIVES · Hold ◈",   type:"plosive",  col:THEME.accentPlosive},
            {label:"RESONANTS · Exhale ↓",type:"resonant", col:THEME.accentResonant},
          ].map(({label,type,col}) => (
            <div key={type} style={{marginBottom:16}}>
              <div style={{fontSize:8, color:col, letterSpacing:"0.2em", marginBottom:8}}>{label}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {CONS.filter(g=>g.type===type).map(g => (
                  <div key={g.num} style={{textAlign:"center", padding:"10px 8px", background:THEME.cardBg, border:THEME.border, borderTop:`2px solid ${col}40`, borderRadius:8, minWidth:72}}>
                    <GlyphSVG segs={g.segs} type={g.type} color={col} sz={52} cursive={cursive} breath={g.breath} bn={g.bn} handwriting={handwriting}/>
                    <div style={{fontSize:11, color:col, marginTop:4}}>{g.name}</div>
                    <div style={{fontSize:8, color:"rgba(255,255,255,0.35)"}}>{g.ipa}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20, fontSize:8, color:"rgba(255,255,255,0.15)", letterSpacing:"0.2em"}}>
          NONAL-CIRCUIT SYSTEM · {CONS.length} GLYPHS · EDITABLE MASTER GRID · ALL GLYPHS UPDATE LIVE
        </footer>
      </div>
    </GridContext.Provider>
  );
}
