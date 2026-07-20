# Materials

## Overview

In 3D graphics, Materials define how light interacts with Geometry to produce color, reflections, and glow. TokenPrint uses materials to encode activation strength and operation types.

## Why it matters

While Geometry shows you the *structure* of the model, Materials show you the *activity*. Highlighting an active block during Live Inference is the primary way TokenPrint directs user attention to the current mathematical operation.

## How TokenPrint implements it

TokenPrint relies primarily on `MeshStandardMaterial` for lit objects and `MeshBasicMaterial` (or `emission` properties) for objects that glow.

### Activation Magnitude Mapping

During a Live Inference trace, the backend streams `layer_stats`, which are mean absolute values of the activations at each layer.
1. The frontend receives an array of 25 values (one per layer).
2. It normalizes these values relative to the maximum activation in that step.
3. It updates the `emissiveIntensity` of the Material for that specific block.

A bright block means the activation tensor for that layer had a high magnitude; a dim block means the signal was weak.

### Point Cloud Materials

The `TensorCloud` uses a custom `ShaderMaterial` to handle depth-coloring efficiently on the GPU, avoiding the need to compute vertex colors for millions of points in Javascript.

## Diagram

```mermaid
flowchart TD
    Stats[Streamed layer_stats] --> Norm[Normalize [0, 1]]
    Norm --> Store[Zustand Store]
    Store --> R3F[React: update material]
    
    R3F --> Mat[MeshStandardMaterial]
    Mat --> Color[color = op_color]
    Mat --> Glow[emissiveIntensity = Normalized Stat]
```

## Related pages
- [Color Mapping](Visualization-System-Color-Mapping)
- [Animation System](Visualization-System-Animation-System)

## Further reading
- [Frontend Code: sceneColors.ts](https://github.com/Sudharsanselvaraj/Token-Print/blob/main/frontend/lib/sceneColors.ts)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Geometry](Visualization-System-Geometry) | [Home](Home) | [Animation System](Visualization-System-Animation-System) |
