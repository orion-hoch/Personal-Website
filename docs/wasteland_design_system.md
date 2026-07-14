# Wasteland Terminal — Design System Reference
> Use this file as context when prompting Claude Code to build new pages or components for your Neocities site.

---

## Aesthetic Intent

Post-apocalyptic personal web. Every choice should read as **worn, analog, and barren** — not "game UI" or "sci-fi HUD". Think: a CRT monitor left running in a desert bunker. Faded ink on old paper. Signal interference. The site should feel *found*, not designed.

**Anti-patterns to avoid:**
- Round corners
- Drop shadows with blur (hard offsets only, if any)
- Sans-serif body fonts
- Centered body text
- Any bright saturated color
- Modern UI conventions (cards, modals, toasts, pill buttons)
- Responsive/mobile-friendly layouts

---

## Color Palette

```css
:root {
  --bg:          #0e0a06;   /* near-black, warm tint — never pure black */
  --panel:       #130f08;   /* slightly lighter dark for inset surfaces */
  --border:      #2a1a08;   /* thin dividers */
  --border-hi:   #4a2e10;   /* main structural borders */
  --amber:       #b87018;   /* primary accent — glowing amber */
  --amber-dim:   #5e3808;   /* dead/inactive amber */
  --amber-mid:   #7a4c10;   /* mid-state amber (links, meta) */
  --ember:       #b83808;   /* hot accent — warnings, live indicators */
  --text:        #9a8258;   /* default body text — sandy, muted */
  --text-dim:    #4a3a20;   /* labels, secondary info */
  --text-bright: #c0a268;   /* headings, dates, emphasis */
  --rust:        #722a08;   /* danger / dead elements */
  --green:       #385e28;   /* visited links */
  --green-hi:    #508840;   /* active links */
}
```

**Rules:**
- No true `#000000` or `#ffffff` anywhere
- Warm tint on every dark shade (R > B)
- Bright accents reserved for headings + interactive states only

---

## Typography

### Font Stack
```css
/* Display / headings / navigation */
font-family: 'Cinzel', serif;
/* Load: https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900 */

/* Body prose, descriptions, updates */
font-family: 'Spectral', Georgia, serif;
font-weight: 300; /* always light weight */
/* Load: https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400 */

/* Technical / data / dates / labels / nav labels */
font-family: 'Courier New', Courier, monospace;
```

### Usage Rules
| Element | Font | Weight | Notes |
|---|---|---|---|
| Site title | Cinzel | 900 | Large, spaced, with flicker animation |
| Section headings | Cinzel | 600 | `letter-spacing: 1px` |
| Navigation links | Cinzel | 400 | `letter-spacing: 1px` |
| Body paragraphs | Spectral | 300 | `line-height: 1.7` |
| Italics / quotes | Spectral italic | 300 | For status lines, featured descriptions |
| Dates, labels, metadata | Courier New | 400 | All caps, `letter-spacing: 3px` |
| Radio / signal status | Courier New | 400 | Small, `9pt` |

---

## Layout

### Fixed-Width, Two-Column (do not make responsive)
```css
.outer  { width: 1000px; margin: 0 auto; }
.layout { display: flex; align-items: flex-start; width: 960px; margin: 0 auto; }

.sidebar { width: 160px; flex-shrink: 0; padding-right: 18px; }
.main    { flex: 1; border-left: 3px solid var(--border-hi); padding-left: 28px; }
```

**Never use** `max-width`, media queries, or `%` widths on structural elements. The page overflows on small screens — that is intentional.

### Border Weights
| Context | Thickness |
|---|---|
| Main column separator | `3px solid var(--border-hi)` |
| Section dividers (`sec-div` lines) | `2px solid var(--border)` |
| Featured image boxes | `2px solid var(--border-hi)` |
| Status / blockquote left rule | `4px solid var(--amber-dim)` |
| Footer top rule | `2px solid var(--border)` |
| Sidebar `<hr>` dividers | `2px solid var(--border)` |
| Site header bottom | `3px solid var(--border-hi)` |

---

## Atmosphere Layers

Stack these as `position: fixed` overlays in this order (bottom to top):

```
1. #bloom      — radial amber glow near header area
2. #burnlines  — horizontal scanlines (repeating-linear-gradient)
3. #vignette   — radial dark crush on edges
4. #grating    — fine pixel mesh (H + V lines)
5. #grain      — canvas dither (updated via JS)
6. #dust       — floating mote particles (CSS animation)
```

All layers: `pointer-events: none`, appropriate `z-index`.

### 1. Bloom
```css
#bloom {
  background: radial-gradient(
    ellipse 60% 40% at 50% 20%,
    rgba(160,80,10,0.05) 0%, transparent 70%
  );
}
```

### 2. Burn Lines (Scanlines)
```css
#burnlines {
  background: repeating-linear-gradient(
    180deg,
    transparent 0px, transparent 2px,
    rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 3px
  );
}
```

### 3. Vignette
```css
#vignette {
  background: radial-gradient(
    ellipse 80% 70% at 50% 45%,
    transparent 40%,
    rgba(4,2,0,0.6) 75%,
    rgba(2,1,0,0.92) 100%
  );
}
```

### 4. Grating (Phosphor Mesh)
```css
#grating {
  background-image:
    repeating-linear-gradient(0deg,
      rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px,
      transparent 1px, transparent 4px),
    repeating-linear-gradient(90deg,
      rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px,
      transparent 1px, transparent 4px);
}
```
Adjust opacity of the `rgba` values to make the mesh heavier or lighter.

### 5. Dither Grain Canvas (JS)
Drawn at 1/3 viewport resolution, scaled up with `image-rendering: pixelated` for coarse pixel dither. Uses a **Bayer 4×4 ordered dither matrix** for warm amber-tinted specks + rare dead pixels.

```js
const bayer = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];

function drawGrain() {
  const scale = 3; // increase for coarser grain
  const w = Math.ceil(window.innerWidth  / scale);
  const h = Math.ceil(window.innerHeight / scale);
  canvas.width = w; canvas.height = h;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';

  const id  = ctx.createImageData(w, h);
  const d   = id.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i      = (y * w + x) * 4;
      const noise  = Math.random();
      const thresh = bayer[y % 4][x % 4] / 16;

      if (noise > thresh + 0.52) {
        // warm amber speck
        const b = Math.floor(Math.random() * 38);
        d[i]=b+18; d[i+1]=Math.floor(b*0.55); d[i+2]=Math.floor(b*0.15);
        d[i+3] = Math.floor(Math.random() * 70 + 20);
      } else if (Math.random() > 0.998) {
        // dead pixel
        d[i]=d[i+1]=d[i+2]=0; d[i+3]=120;
      }
    }
  }
  ctx.putImageData(id, 0, 0);
}

// Irregular update schedule (not a fixed interval — feels more organic)
(function schedule() {
  setTimeout(() => { drawGrain(); schedule(); }, 60 + Math.random() * 80);
})();
```

Canvas CSS:
```css
#grain {
  mix-blend-mode: screen;
  opacity: 0.55;
  image-rendering: pixelated;
}
```

### 6. Dust Motes (JS + CSS)
```css
.dust-mote {
  position: fixed;
  width: 2px; height: 2px;
  background: var(--amber-dim);
  pointer-events: none;
  image-rendering: pixelated;
  animation: drift var(--dur) linear var(--delay) infinite;
}

@keyframes drift {
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
}
```

```js
for (let i = 0; i < 28; i++) {
  const m = document.createElement('div');
  m.className = 'dust-mote';
  m.style.cssText = `
    left: ${Math.random() * window.innerWidth}px;
    top:  ${Math.random() * window.innerHeight}px;
    width: ${Math.random() > 0.7 ? 3 : 2}px;
    height: ${Math.random() > 0.7 ? 3 : 2}px;
    --dx: ${(Math.random() - 0.4) * 120}px;  /* slight rightward wind */
    --dy: ${(Math.random() - 0.7) * 80}px;   /* mostly upward */
    --dur: ${6 + Math.random() * 14}s;
    --delay: ${Math.random() * -20}s;
    opacity: ${0.2 + Math.random() * 0.5};
  `;
  document.body.appendChild(m);
}
```

---

## Header — Flickering Neon Sign

Each letter in the title gets one of four states:

| Class | Color | Behavior |
|---|---|---|
| `.L-on`  | `var(--amber)` + glow | Always lit |
| `.L-flk` | `var(--amber)` + glow | `flicker` animation |
| `.L-dim` | `var(--amber-mid)`, no glow | `dim-pulse` animation |
| `.L-off` | `#181008` | Dark, dead — no shadow |

```css
.L-on  { color: var(--amber); text-shadow: 0 0 14px var(--amber-dim), 0 0 32px rgba(140,70,8,0.22); }
.L-flk { color: var(--amber); text-shadow: 0 0 14px var(--amber-dim); animation: flicker 5s infinite; }
.L-dim { color: var(--amber-mid); animation: dim-pulse 7s infinite; }
.L-off { color: #181008; }

@keyframes flicker {
  0%,100% { opacity: 1; }
  5%      { opacity: 0.25; }
  6%      { opacity: 1; }
  21%     { opacity: 0.6; }
  22%     { opacity: 1; }
  51%     { opacity: 0.1; }
  52%     { opacity: 1; }
}

@keyframes dim-pulse {
  0%,100% { opacity: 0.5; }
  50%     { opacity: 0.3; }
}
```

**Heat shimmer** on the sign (SVG filter):
```html
<svg style="position:absolute;width:0;height:0">
  <defs>
    <filter id="heat">
      <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="2" seed="2" result="noise">
        <animate attributeName="baseFrequency"
          values="0.015 0.08;0.016 0.082;0.015 0.08"
          dur="4s" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```
Apply with `filter: url(#heat)` on the sign wrapper.

---

## Components

### Section Divider
```html
<div class="sec-div">dispatch log</div>
```
```css
.sec-div {
  display: flex; align-items: center; gap: 10px;
  color: var(--text-dim);
  font-family: 'Courier New', monospace;
  font-size: 8pt; letter-spacing: 3px; text-transform: uppercase;
  margin: 24px 0 14px;
}
.sec-div::after { content: ''; flex: 1; border-top: 2px solid var(--border); }
```

### Status / Blockquote Line
```html
<div class="status-line">italic note or current status here</div>
```
```css
.status-line {
  font-family: 'Spectral', serif;
  font-style: italic; font-weight: 300;
  color: var(--amber-mid);
  border-left: 4px solid var(--amber-dim);
  padding-left: 12px;
  line-height: 1.6;
}
```

### Update Log Entry
```html
<div class="upd-entry">
  <span class="upd-date"><span class="tag-new">new</span>20260404</span>
  <span class="upd-text">description with optional <a href="#">link</a></span>
</div>
```
```css
.upd-entry { display: flex; gap: 16px; margin-bottom: 10px; line-height: 1.6; }
.upd-date  { font-family: 'Courier New', monospace; color: var(--text-bright);
             font-weight: 600; white-space: nowrap; min-width: 76px; font-size: 8.5pt; }
.upd-text  { font-family: 'Spectral', serif; font-weight: 300; color: var(--text); }
.tag-new   { background: var(--rust); color: #d09070; font-size: 7pt;
             padding: 0 3px; letter-spacing: 1px; animation: blink 1.5s linear infinite; }
```

### Image Box (only boxes with images inside)
```css
.feat-img {
  background: var(--panel);
  border: 2px solid var(--border-hi);
  image-rendering: pixelated;
}
```
**Rule:** boxes/borders only wrap images. Plain text, links, and lists are never in a border box.

### Blinking Element
```css
.some-element { animation: blink 2s linear infinite; }

@keyframes blink {
  55% { opacity: 0.35; }
}
```
Use for: live indicator, guestbook link, "new" tags. Not for regular text.

### Navigation (sidebar)
```css
.nav-block a {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 10.5pt;
  color: var(--amber);
  padding: 2px 0;
  line-height: 1.5;
  letter-spacing: 1px;
  text-decoration: none;
}
.nav-block a.active::before { content: "▶ "; font-size: 8px; }
```

### 88×31 Image Buttons
These are **image slots** — when deployed, replace placeholder divs with `<img>` tags. Sidebar only, not in main content.
```css
.btn88 {
  width: 88px; height: 31px;
  background: var(--panel);
  border: 2px solid var(--border-hi);
  display: block;
}
```

---

## Animations Reference

| Name | Duration | Used For |
|---|---|---|
| `flicker` | 5s | Header letters marked `.L-flk` |
| `dim-pulse` | 7s | Header letters marked `.L-dim` |
| `blink` | 1.5–2.2s | Live status, guestbook, new tags |
| `drift` | 6–20s random | Dust motes |
| Grain canvas | 60–140ms random | Dither layer |
| SVG heat shimmer | 4s | Header sign `feTurbulence` |

---

## What Not To Do

- **No `border-radius`** on any structural element
- **No box-shadow with blur** — if used, `5px 5px color` hard offset only
- **No sans-serif** fonts anywhere in prose
- **No `max-width` or media queries** — fixed 1000px, overflow allowed
- **No border boxes around text** — borders only on image containers
- **No bright/saturated colors** — if it feels neon or vivid, desaturate it
- **No modern UI patterns** — no cards, modals, FABs, pill buttons, toast notifications
- **No CSS resets** — let browser defaults bleed through slightly

---

## Prompting Tips for Claude Code

When asking Claude Code to build a new page or component, paste this file as context and specify:

- **Which section of this doc** the new thing should follow (e.g. "use the atmosphere layers from this doc")
- **Font assignments** for any new text elements
- **Whether the element contains an image** (only then does it get a border box)
- The **line thickness rules** from the Border Weights table
- That it should be **fixed-width, non-responsive**

Example prompt:
> "Using the design system in this file, build a /gamelog page. It should have the same two-column layout, atmosphere layers, and typography. Each log entry has a game title (Cinzel), a platform + date line (Courier New), and a review paragraph (Spectral 300 italic). Image thumbnail on the left if present — border 2px solid var(--border-hi), no border on the text."
