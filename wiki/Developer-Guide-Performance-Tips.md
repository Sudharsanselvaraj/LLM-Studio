# Performance Tips

## Overview

TokenPrint pushes the limits of what browsers can render by displaying millions of data points and complex geometries at 60fps. If you are adding features, you must write highly optimized code.

## Why it matters

If the frame rate drops below 30fps, the cinematic camera glides become jarring, and the sense of observing a fluid mathematical process is ruined.

## How TokenPrint implements it

### 1. Avoid React Re-renders
Never put high-frequency data (like camera coordinates or the current millisecond timestamp) in a `useState` hook at the top of the tree. Use Zustand (`useStore.getState()`) and read it directly inside R3F `useFrame` loops.

### 2. Use Instancing
If you need to render 100 identical shapes (like attention blades), do not map over an array and return 100 `<mesh>` components. Use `<instancedMesh>` and update a `THREE.InstancedBufferAttribute`. This reduces 100 draw calls to 1.

### 3. Dispose of Geometry
When users switch from Architecture Explorer to Live Inference, the massive `TensorCloud` must be destroyed. Three.js does not automatically garbage collect WebGL buffers. You must explicitly call `.dispose()` on unused `BufferGeometry` and `Material` objects to prevent memory leaks.

### 4. Optimize the Payload
The `WS /ws/generate` backend endpoint must not send the full vocabulary probability distribution ($151k$ floats). It must sort and truncate to `top_k` (e.g., 10 floats) before sending the JSON frame.

## Diagram

```mermaid
flowchart TD
    subgraph Bad Practice
        State[React useState(cameraPos)] --> Render[Trigger App Re-render]
        Render --> Slow[FPS Drops]
    end
    
    subgraph Good Practice
        Zustand[Zustand Store] --> useFrame[R3F useFrame loop]
        useFrame --> Mutate[Directly mutate mesh.position]
        Mutate --> Fast[60 FPS]
    end
```

## Related pages
- [Renderer](Architecture-Renderer)
- [Event System](Architecture-Event-System)

## Further reading
- [Three.js Optimization Guidelines](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Debugging](Developer-Guide-Debugging) | [Home](Home) | [API Reference](API-Reference) |
