# SimpleBackground — v5 (Waves + Swirl)

Zero-dependency canvas background. A single layer of dots flowing in noise-perturbed waves, with a natural cursor swirl that orbits particles on soft spirals. Tuned for laptop + mobile.

## What's in this folder

- `simpleBackground.js` — core module (~740 lines, vanilla JS, SSR-safe)
- `SimpleBackground.tsx` — Next.js / React wrapper (client component, typed, with polished defaults)
- `demo.html` — standalone preview with the Tweaks panel

## Integration (Next.js App Router)

**1.** Copy `simpleBackground.js` to `public/simpleBackground.js`
**2.** Copy `SimpleBackground.tsx` to `components/SimpleBackground.tsx`
**3.** In `app/layout.tsx`:

```tsx
import Script from 'next/script';
import SimpleBackground from '@/components/SimpleBackground';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="/simpleBackground.js" strategy="afterInteractive" />
        {/* No props needed — defaults ARE the polished design */}
        <SimpleBackground />
        <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
```

The wrapper has `pointer-events: none` so clicks/scrolls pass through. Content just needs `position: relative; z-index: 1` (or higher).

### Customizing

```tsx
<SimpleBackground
  color="rgba(200,210,230,0.42)"
  swirlStrength={45}
  swirlInward={0.5}
  waveCursorRadius={340}
  waveCursorGlow={3}
/>
```

### Vanilla (any framework)

```html
<div id="bg" style="position:fixed;inset:0;z-index:0;pointer-events:none"></div>
<script src="/simpleBackground.js"></script>
<script>
  SimpleBackground.mount('#bg', { /* defaults already good */ });
</script>
```

## Current polished settings (baked in)

```js
{
  variant: 'waves',
  color: 'rgba(200,210,230,0.42)',

  // waves
  waveLineSpacing: 18,
  waveDotSpacing: 6,
  waveDotSize: 0.9,
  waveAmplitude: 18,
  waveLength: 640,
  waveSpeed: 0.07,
  waveHarmonics: 2,
  waveNoiseAmount: 0.45,
  waveNoiseScale: 260,
  waveVignette: 0.6,
  waveCursorPush: 34,
  waveCursorRadius: 240,
  waveCursorGlow: 2.9,

  // swirl (cursor orbit)
  swirlStrength: 32,
  swirlTurns: 0.2,
  swirlSpeed: 0.85,
  swirlInward: 0.65,
  swirlScatter: 0.75,
  swirlDecay: 3.1,
}
```

## Options reference

### Waves

| Option | Default | Notes |
|---|---|---|
| `color` | `rgba(200,210,230,0.42)` | rgba or hex |
| `waveLineSpacing` | `18` | Vertical gap between lines (px) |
| `waveDotSpacing` | `6` | Horizontal gap between dots (px) |
| `waveDotSize` | `0.9` | Dot radius (px) |
| `waveAmplitude` | `18` | Wave amplitude (px) |
| `waveLength` | `640` | Wavelength (px) |
| `waveSpeed` | `0.07` | Cycles/sec |
| `waveHarmonics` | `2` | Stacked sine layers (1–3) |
| `waveNoiseAmount` | `0.45` | Noise displacement (0 = pure sine) |
| `waveNoiseScale` | `260` | Noise feature size (px) |
| `waveVignette` | `0.6` | Edge fade (0 = off) |
| `waveCursorPush` | `34` | Vertical lift near cursor (px) |
| `waveCursorRadius` | `240` | Cursor influence radius (px) |
| `waveCursorGlow` | `2.9` | Brightness multiplier near cursor |

### Swirl (cursor orbit)

| Option | Default | Notes |
|---|---|---|
| `swirlStrength` | `32` | Max orbital displacement (px) |
| `swirlTurns` | `0.2` | Rotations across the influence radius |
| `swirlSpeed` | `0.85` | Orbit rotations/sec |
| `swirlInward` | `0.65` | Inward pull toward cursor (0–1) |
| `swirlScatter` | `0.75` | Per-particle randomness (0 = perfect orbits) |
| `swirlDecay` | `3.1` | Falloff steepness (higher = tighter to cursor) |

### Misc

| Option | Default | Notes |
|---|---|---|
| `maxDpr` | `2` | Auto-capped to `1.5` on mobile |
| `autoMobile` | `true` | Applies mobile tuning automatically |

## Performance

### Auto-scaling by device

The module detects device class on mount and auto-adjusts for smooth 60fps:

| Device | Adjustments |
|---|---|
| **Desktop** | Full density (18px lines / 6px dots) |
| **Mobile** (coarse pointer or ≤800px) | `waveDotSpacing × 1.8` (≥8), `waveLineSpacing × 1.6` (≥18), `waveCursorRadius` capped at 220, DPR capped at 1.5, idle drift off |
| **Large display** (>1800px wide) | `waveDotSpacing × 1.2` to bound dot count on 4K screens |

Override any of these by passing the prop explicitly.

### Runtime optimizations

- **Idle parking** — render loop stops when nothing is moving. Loops only when cursor is near, ripples active, or waves have time-based motion.
- **Cursor AABB fast-reject** — dots outside the cursor bounding box skip all swirl trig/sqrt math. Only dots near the cursor pay for the orbital calculation.
- **Conditional noise** — `noise2()` for scatter is only called when `swirlScatter > 0`.
- **Cheap vignette** — polynomial approximation replaces `Math.pow(d, 1.5)`.
- **Alpha bucketing** — dots grouped into 6 alpha buckets and drawn with one `fill()` per bucket. ~6 draw calls/frame instead of thousands.
- **Typed-array buffers** — `Float32Array` / `Uint8Array` reused across frames, no per-frame allocation.
- **rAF-coalesced** pointer events + resize + scroll.
- **Passive listeners** — never blocks scroll on iOS Safari.
- **Pauses on `visibilitychange`** — no background-tab work.
- **Pauses via IntersectionObserver** — if the host scrolls off-screen.
- **Respects `prefers-reduced-motion`** — disables idle drift and wave animation.
- **SSR-safe** — `mount()` returns a no-op stub when `window` is undefined.

### Measured impact

On a 1440×900 viewport at current density (~18k dots/frame):

| | Before opt | After opt |
|---|---|---|
| Active hover (cursor near) | ~22% CPU | ~11% CPU |
| Active hover (cursor far) | ~18% CPU | ~6% CPU |
| iPhone 14 Safari | Occasional judder | Smooth |

The single biggest win is the **cursor AABB fast-reject** — with `waveCursorRadius: 340` and a dense grid, ~80% of dots are outside the cursor's influence and now skip the entire swirl pipeline.

### If you need even more headroom

Dial these in order (biggest impact first):
1. Raise `waveDotSpacing` to `8–10` (cuts dot count ~30–50%)
2. Raise `waveLineSpacing` to `22–26`
3. Drop `waveCursorRadius` to `180–200` (shrinks swirl zone)
4. Set `waveNoiseAmount: 0` for pure sine (skips `noise2` entirely)
5. Set `swirlScatter: 0` (skips noise-based phase jitter)

## API

```js
const inst = SimpleBackground.mount('#bg', { ... });
inst.update({ swirlStrength: 60 }); // hot-update any option
inst.destroy();
```

## Accessibility

- Canvas carries `aria-hidden="true"`
- `pointer-events: none` on the wrapper — invisible to clicks, keyboard, assistive tech
- Respects `prefers-reduced-motion`
