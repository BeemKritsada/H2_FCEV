# Application architecture

The current source app is intentionally a small foundation placeholder. The directories below establish ownership boundaries for later work; they do not imply that presentation features are already implemented.

## Main directories

- src/app/ — application entry-level composition and startup.
- src/components/layout/ — reusable page and presentation layout.
- src/components/navigation/ — future presentation navigation controls.
- src/components/presentation/ — reusable presentation-level elements.
- src/components/ui/ — small shared interface controls.
- src/scenes/ — future scene-specific content, separated into opening, overview, technology, applications, and closing areas.
- src/three/ — reusable 3D camera, lighting, material, and object utilities.
- src/animations/ — reusable GSAP timelines and transitions.
- src/content/en/ and src/content/th/ — locale-specific text kept separate from presentation components.
- src/i18n/ — i18next setup and language configuration.
- src/hooks/, src/types/, and src/utils/ — shared React hooks, domain types, and general utilities.
- src/styles/ — global style rules; component styles can live alongside their components.
- public/models/, public/textures/, public/audio/, and public/fonts/ — future static assets, including GLTF/GLB models.
- offline-app/ — reserved for a future Windows offline wrapper; Electron is not installed.
- scripts/ — project maintenance and future packaging scripts.
- docs/ — architecture, technology, and deployment notes.

## Planned interaction

src/main.tsx loads the i18n initialization and mounts src/app/App.tsx. The app uses react-i18next; translation keys are resolved from src/content/en/ and src/content/th/, so presentation text can remain outside component logic.

Later, the app shell can compose shared layout and navigation components with a selected scene from src/scenes/. Scenes can use reusable 3D elements from src/three/ and animation timelines from src/animations/. Static 3D and media assets will be served from public/. This flow is planned; no scenes, navigation, 3D objects, or animation timelines exist yet.