# AalsiCoders — Cinematic Portfolio Website

A scroll-controlled cinematic video experience that transitions seamlessly into an interactive 3D headquarters portfolio.

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React Three Fiber** + **@react-three/drei** + **@react-three/postprocessing**
- **Three.js** — fully procedural 3D room (no GLTF files needed)
- **GSAP** — camera animations, scroll timeline
- **Zustand** — global state
- **Tailwind CSS** — UI panels and overlays
- **TypeScript** — strict, zero errors

---

## Project Structure

```
aalsicoders/
├── app/
│   ├── page.tsx              ← Root page — orchestrates all phases
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── cinematic/
│   │   ├── LoadingScreen.tsx  ← Animated loader with progress bar
│   │   ├── ScrollVideo.tsx    ← Scroll-scrubbed video engine (Part 1)
│   │   └── TransitionBridge.tsx ← Black flash cross-fade to 3D
│   ├── room/
│   │   ├── Room.tsx           ← R3F Canvas wrapper
│   │   ├── Suspense3D.tsx     ← All 3D scene contents
│   │   ├── CameraRig.tsx      ← Camera lerp + OrbitControls
│   │   ├── ProceduralRoom.tsx ← Walls, floor, desk, lighting, particles
│   │   ├── Characters.tsx     ← 3 anime characters (procedural meshes)
│   │   ├── InteractiveObject.tsx ← Hover glow + click zoom wrapper
│   │   ├── ObjectMeshes.tsx   ← 7 procedural object geometries
│   │   └── ContentPanel.tsx   ← Glass HTML panel (right side)
│   └── ui/
│       ├── CustomCursor.tsx   ← Lagging ring cursor
│       └── RoomHUD.tsx        ← Top bar, legend, hints, back button
├── hooks/
│   ├── useScrollVideo.ts      ← Reusable RAF scroll hook
│   └── useKeyboardShortcuts.ts ← ESC closes panel, SPACE skips (dev)
├── store/
│   └── useAppStore.ts         ← Zustand: phase, focusedObject, cursor
├── lib/
│   └── objectData.ts          ← All 7 objects: positions, colors, content
└── public/
    └── assets/
        └── video/             ← DROP YOUR VIDEO HERE
```

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Dev shortcut:** Press `SPACE` or click the blue button (top-right) to skip the cinematic and go straight to the 3D room.

---

## Adding Your Cinematic Video

Drop your video files into `/public/assets/video/`:

```
public/assets/video/
├── cinematic.mp4     ← Primary (H.264, 1920×1080)
└── cinematic.webm    ← Fallback (VP9, smaller size)
```

**Video requirements:**
- **No audio track** (video is scroll-scrubbed, not played)
- **24fps** recommended
- **60–90 seconds** total runtime
- **H.264 + WebM** for cross-browser support
- Final frame should be **inside the HQ interior** (matches 3D room entry angle)

**Scene timestamps** (configure in `ScrollVideo.tsx` → `SCENES` array):
| Time | Scene |
|------|-------|
| 0–22% | Helicopter Approach |
| 22–48% | Team Jump |
| 48–72% | Landing |
| 72–100% | Entering HQ |

---

## Customizing Content

All portfolio content lives in one file: **`lib/objectData.ts`**

Each of the 7 interactive objects has:
- `position` — 3D position in the room
- `camPosition` — where camera moves when clicked
- `color` / `glowColor` — accent colors
- `content` — title, subtitle, body, items, tags, links

Edit the `OBJECTS` constant to update all your team info, projects, skills, etc.

---

## Customizing 3D Room

- **Characters** → `components/room/Characters.tsx` — adjust positions, names, colors
- **Room geometry** → `components/room/ProceduralRoom.tsx` — walls, desk, lighting
- **Object meshes** → `components/room/ObjectMeshes.tsx` — shapes for each object
- **Post-processing** → `components/room/Suspense3D.tsx` — bloom, vignette, aberration

---

## Deploy to Vercel

```bash
npm run build
vercel deploy
```

**For the video:** Host it on Cloudflare R2 or Bunny CDN and update the `<source src>` in `ScrollVideo.tsx`. Large video files (~50–200MB) should not be in `/public` in production.

```tsx
// ScrollVideo.tsx — update these paths:
<source src="https://cdn.aalsicoders.in/cinematic.webm" type="video/webm" />
<source src="https://cdn.aalsicoders.in/cinematic.mp4"  type="video/mp4"  />
```

---

## Phase Flow

```
loading → cinematic (scroll video) → transition (cross-fade) → room (3D interactive)
```

State managed in `store/useAppStore.ts`. Every component reads `phase` and renders conditionally.

---

## Performance Notes

- All Three.js code is `dynamic` imported with `ssr: false` — zero server-side Three.js
- 3D room starts loading in background when video hits 60% scroll
- Particle count: 80 (tunable in `ProceduralRoom.tsx`)
- DPR capped at 1.5 — adjust `dpr={[1, 1.5]}` on Canvas for quality/perf tradeoff
- Post-processing (Bloom + Vignette + ChromaticAberration) only activates in room phase
