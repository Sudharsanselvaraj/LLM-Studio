# Interaction Model

## Overview

The Interaction Model defines how 2D mouse movements on the screen (clicks, hovers) are translated into actions within the 3D data structures, like selecting a tensor or highlighting an operation.

## Why it matters

Translating a mouse click into a 3D coordinate is mathematically complex (Raycasting). Doing it efficiently ensures the UI feels responsive even when hovering over a point cloud with millions of vertices.

## How TokenPrint implements it

TokenPrint heavily utilizes Three.js Raycasting.

### Point Cloud Picking
In the Architecture Explorer, the user hovers over a single `THREE.Points` mesh.
1. The mouse coordinates are projected via a Raycaster into the 3D scene.
2. The Raycaster intersects with the point cloud buffer.
3. It returns the `index` of the intersected vertex.
4. Because the point cloud array is mapped 1:1 with the `TensorInfo` array, TokenPrint instantly retrieves the tensor metadata (name, shape, params) associated with that index.
5. This metadata is dispatched to the Zustand store, triggering the Right Panel to update.

### Bounding Volume Hierarchies (BVH)
To ensure that raycasting against massive geometry remains performant at 60fps, TokenPrint relies on optimized intersection libraries (like `three-mesh-bvh` if necessary) to quickly discard non-intersecting geometry.

## Diagram

```mermaid
flowchart TD
    Mouse[Mouse Move X,Y] --> Ray[Raycaster Project]
    Ray --> Intersect[Intersect THREE.Points]
    
    Intersect --> Index[Vertex Index: 4520]
    Index --> Lookup[Lookup TensorList[4520]]
    Lookup --> Store[Zustand: setHoveredTensor()]
    Store --> UI[Update Tooltip UI]
```

## Related pages
- [Tensor Inspector](User-Guide-Tensor-Inspector)
- [Scene Graph](Visualization-System-Scene-Graph)

## Further reading
- [Frontend Architecture](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Camera System](Visualization-System-Camera-System) | [Home](Home) | [Architecture](Architecture) |
