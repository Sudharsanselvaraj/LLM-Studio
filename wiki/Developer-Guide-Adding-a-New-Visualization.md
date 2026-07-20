# Adding a New Visualization

## Overview

This guide explains the workflow for introducing a new 3D geometric representation into the TokenPrint `TransformerStack`.

## Why it matters

If a new architectural feature (like Mixture of Experts) is added to the backend, the frontend must render it. Adding geometry requires plumbing data from the JSON payload all the way into WebGL.

## How TokenPrint implements it

Let's assume you want to visualize a "Router" node for a Mixture of Experts (MoE) model.

### 1. Update the Data Schema
If the router probabilities need to be visualized, update the backend's `schemas.py` and the frontend's TypeScript interfaces to include the new data in the `layer_stats` or `meta` payload.

### 2. Create the R3F Component
Create a new file in `frontend/components/scenes/` (e.g., `RouterNode.tsx`).
Use Three.js primitives (like `CylinderGeometry`) or create custom buffer geometry.

```tsx
export function RouterNode({ expertCount, activeExperts }) {
  // Use sceneColors.ts for materials
  // Render the geometry
}
```

### 3. Integrate into TransformerStack
Open `TransformerStack.tsx`. Find the layer rendering loop. Insert your `<RouterNode />` before the `<MlpBlock />`.

### 4. Tie it to the Playback Engine
If the Router is a distinct operation in the execution trace, ensure the backend `model.py` adds it to the `op_catalog`.
Update the R3F component to highlight or emit light when `store.activeOp` matches the router's index.

## Diagram

```mermaid
flowchart TD
    Data[Backend Schema Update] --> TS[Frontend TS Interface]
    
    subgraph R3F Development
        TS --> Comp[Create RouterNode.tsx]
        Comp --> Geo[Define Three.js Geometry]
        Comp --> Mat[Map to sceneColors.ts]
    end
    
    R3F Development --> Stack[Insert into TransformerStack.tsx]
    Stack --> Playback[Tie emission to activeOp]
```

## Related pages
- [Geometry](Visualization-System-Geometry)
- [Color Mapping](Visualization-System-Color-Mapping)

## Further reading
- [Visual Mapping](../docs/visual-mapping.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Code Style](Developer-Guide-Code-Style) | [Home](Home) | [Adding a New Model](Developer-Guide-Adding-a-New-Model) |
