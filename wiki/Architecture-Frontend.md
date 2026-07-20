# Frontend

## Overview

The TokenPrint Frontend is a modern web application built with Next.js (App Router), TypeScript, and React Three Fiber (R3F).

## Why it matters

To render millions of points or thousands of geometric meshes at 60fps, standard React DOM rendering is insufficient. The frontend architecture must bridge the declarative ease of React with the raw performance of WebGL.

## How TokenPrint implements it

The `frontend/` directory is structured to isolate heavy computations from the main React render thread.

- **`app/`**: Contains the Next.js routing and the main `page.tsx` which mounts the `AppShell`.
- **`components/ui/`**: Standard React components (panels, buttons, sliders) built with Tailwind CSS.
- **`components/scenes/`**: R3F components that interface directly with Three.js.
- **`lib/`**: Pure TypeScript logic (no React dependencies). Contains the `formulas.ts`, `sceneColors.ts`, and the client-side `gguf/` parser.

### Avoid React Render Thrashing
To prevent the 60fps `useFrame` loop from re-rendering the entire UI, state that updates frequently (like the camera position or the current timestamp) is stored in a headless Zustand store (`lib/store.ts`). R3F components read directly from this store without triggering React state updates.

## Diagram

```mermaid
flowchart TD
    Next[Next.js AppRouter] --> AppShell[AppShell Layout]
    
    AppShell --> DOM[React DOM UI]
    AppShell --> R3F[React Three Fiber Canvas]
    
    subgraph State Management
        Zustand[Zustand Store]
    end
    
    Zustand -.->|State reads| DOM
    Zustand -.->|High-frequency reads| R3F
    
    subgraph Library Logic
        GGUF[GGUF Parser]
        Math[KaTeX Formulas]
    end
    
    Library Logic --> DOM
    Library Logic --> R3F
```

## Related pages
- [Event System](Architecture-Event-System)
- [Visualization System](Visualization-System)

## Further reading
- [Frontend Architecture Docs](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Overall Architecture](Architecture-Overall-Architecture) | [Home](Home) | [Backend](Architecture-Backend) |
