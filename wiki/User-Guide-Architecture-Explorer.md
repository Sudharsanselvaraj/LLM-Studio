# Architecture Explorer

## Overview

The Architecture Explorer is the static analysis mode in TokenPrint. It renders a 3D point cloud representing every tensor in the loaded model.

## Why it matters

Modern LLMs contain hundreds of tensors (e.g., Qwen 0.5B has 290). The Architecture Explorer makes this massive list comprehensible by mapping it spatially, allowing you to visually grasp the relative size of different layers and components without scrolling through a massive JSON dump.

## How TokenPrint implements it

TokenPrint fetches data from the backend via `GET /architecture` (which calls PyTorch's `named_parameters()`) or by parsing a `.gguf` file locally. It then feeds this tensor list into `THREE.Points` (a highly optimized WebGL construct). 
- **Density** is proportional to the real parameter count.
- **Depth (Z-axis)** represents the layer index.
- **Color** creates a gradient across the layers for depth perception.

## Interacting with the Explorer

1. **Hover:** Move your mouse over the point cloud. A tooltip will display the exact tensor name (e.g., `model.layers.5.self_attn.q_proj.weight`).
2. **Click:** Clicking a point pins its details to the Right Panel, showing its shape, dtype, and total parameter count.
3. **Sidebar Grid:** The Sidebar displays a 2D tile grid grouping tensors by role (e.g., Attention, MLP, Norm). Selecting a tile highlights the corresponding points in 3D space.

> **Tip**
> If you haven't loaded a model yet, the canvas will be empty. Use the Model Loader in the sidebar or drag a `.gguf` file onto the window.

## Diagram

```mermaid
flowchart LR
    Data[named_parameters] --> JSON[JSON Array]
    JSON --> Points[THREE.Points Generator]
    
    subgraph 3D Mapping
        Points --> Size[Point Density = n_params]
        Points --> Z[Z-Axis = Layer Index]
    end
    
    3D Mapping --> Canvas[WebGL Canvas]
```

## Related pages
- [Tensor Inspector](User-Guide-Tensor-Inspector)
- [Live Inference](User-Guide-Live-Inference)

## Further reading
- [Architecture Docs](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [User Guide](User-Guide) | [Home](Home) | [Live Inference](User-Guide-Live-Inference) |
