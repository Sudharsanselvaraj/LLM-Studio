# Overall Architecture

## Overview

TokenPrint's overall system design follows a strict boundary between the server computing the math and the client rendering the pixels.

## Why it matters

Clear ownership at the boundaries improves reliability and simplifies debugging. If a number is wrong in the UI, you know to check the backend API response. If the number is correct in the API response but wrong in the UI, you know to check the frontend parser.

## How TokenPrint implements it

TokenPrint defines typed interfaces and explicit flow contracts across the overall architecture boundary. 

### The Core Contract
> **The backend serves JSON and never renders; the frontend renders and never fabricates numbers.**

The frontend (`frontend/`) uses a docked shell (CSS grid) avoiding floating overlays.
The backend (`backend/`) uses a headless FastAPI app holding a PyTorch model in memory.

## Diagram

```mermaid
flowchart TD
    subgraph Browser Context
        UI[AppShell: CSS Grid]
        UI --> Top[TopBar]
        UI --> Side[Sidebar]
        UI --> Canvas[R3F Canvas]
        UI --> Right[Right Panel]
        UI --> Bot[Bottom Bar]
        
        State[lib/store.ts: Zustand] -.-> UI
    end
    
    subgraph Network Boundary
        WS[WebSocket /ws/generate]
        REST[REST /architecture]
    end
    
    Browser Context <--> Network Boundary
    
    subgraph OS Context
        Network Boundary <--> API[main.py: FastAPI]
        API <--> Engine[model.py: PyTorch]
        Engine <--> Checkpoint[Qwen2.5 Weights]
    end
```

## Related pages
- [Frontend](Architecture-Frontend)
- [Backend](Architecture-Backend)

## Further reading
- [Project Architecture](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Architecture](Architecture) | [Home](Home) | [Frontend](Architecture-Frontend) |
