# Renderer

## Overview

The Renderer is the sub-system responsible for translating the React component hierarchy into WebGL draw calls using Three.js and React Three Fiber.

## Why it matters

WebGL is a low-level API. Three.js simplifies it, but rendering thousands of objects naively will still crash a browser. The Renderer must employ optimizations like Geometry Instancing and custom Shaders to maintain 60fps.

## How TokenPrint implements it

TokenPrint employs several specific rendering strategies:

### 1. `THREE.Points`
For the Architecture Explorer, TokenPrint uses a single `Points` mesh with a custom `ShaderMaterial`. This allows it to render hundreds of thousands of vertices in a single draw call, rather than mounting thousands of individual React `<mesh>` components.

### 2. Instanced Meshes
For the Attention Blades in the `TransformerStack`, TokenPrint uses `<instancedMesh>`. If a model has 32 query heads, TokenPrint doesn't create 32 separate cylinder geometries; it creates one geometry and instances it 32 times with different rotation matrices.

### 3. Context Loss Recovery
Browsers routinely drop WebGL contexts if the GPU is stressed. The Renderer includes a `SceneLoader` wrapper that listens for the `webglcontextlost` event and displays a clean fallback UI rather than a white screen of death.

## Diagram

```mermaid
flowchart TD
    React[React Tree] --> R3F[React Three Fiber]
    
    subgraph Renderer Optimizations
        R3F --> Points[THREE.Points<br/>1 Draw Call / 1M vertices]
        R3F --> Instance[InstancedMesh<br/>1 Draw Call / N Blades]
        R3F --> Basic[Standard Meshes<br/>Funnels, Waists]
    end
    
    Renderer Optimizations --> WebGL[Browser WebGL API]
    WebGL --> GPU[GPU execution]
```

## Related pages
- [Scene Graph](Visualization-System-Scene-Graph)
- [Geometry](Visualization-System-Geometry)

## Further reading
- [Frontend Architecture](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Data Pipeline](Architecture-Data-Pipeline) | [Home](Home) | [Event System](Architecture-Event-System) |
