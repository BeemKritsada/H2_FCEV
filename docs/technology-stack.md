# Technology stack

This document records the selected foundation. The packages are installed; most are reserved for later implementation.

| Technology | Responsibility |
| --- | --- |
| React and React DOM | Build the presentation interface from reusable components and mount it in the browser. |
| TypeScript | Add static types and strict checks to application code and build configuration. |
| Vite | Provide the local development server and produce the static production bundle in dist/. |
| Three.js | Supply WebGL 3D rendering, materials, cameras, lighting, and model loading. GLTF/GLB is the planned model format. |
| React Three Fiber | Express Three.js scenes as React components when 3D scenes are introduced. |
| Drei | Provide established helpers for React Three Fiber to avoid rebuilding common scene utilities. |
| GSAP and ScrollTrigger | Coordinate future timelines and scroll-driven transitions. ScrollTrigger is included with GSAP and can be registered when needed. |
| i18next and react-i18next | Keep Thai and English strings in locale resources and make them available to React components through translation keys. |
| lucide-react | Provide tree-shakeable React icon components when interface icons are needed. |
| CSS | Use a small global stylesheet for reset and typography, with styles scoped to components as the interface grows. |

## Typography and assets

The initial font stack prefers Noto Sans Thai and common Thai-capable system fonts, then falls back to system UI fonts. No font files or third-party assets are downloaded in this phase. Future licensed fonts and static media can be placed under public/fonts/, public/models/, public/textures/, and public/audio/.

## Not included

Electron, a UI framework, backend services, analytics, authentication, databases, and cloud services are not part of this phase. The website build does not rely on Electron.