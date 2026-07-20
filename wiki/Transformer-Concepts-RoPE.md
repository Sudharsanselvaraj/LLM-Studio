# RoPE (Rotary Positional Embedding)

## Overview

RoPE (Rotary Positional Embedding) is the modern standard for injecting positional information into transformers. Instead of adding a vector at the beginning, RoPE mathematically rotates the Query and Key vectors inside the Attention mechanism based on their position in the sequence.

## Why it matters

RoPE provides better extrapolation for long contexts compared to absolute positional embeddings. It allows the model to care about the *relative* distance between two words rather than their absolute position in the document. 

## How TokenPrint implements it

RoPE is heavily featured in TokenPrint when exploring Llama or Qwen models.
1. **Geometric Representation:** In the 3D `TransformerStack`, the RoPE operation is visualized as a helical/rotary twist applied to the Query and Key branches right before they enter the Attention blades.
2. **HUD Formulas:** The Right Panel updates to show the complex rotary multiplication formulas:
   $$q_m = f_q(x_m, m) = (W_q x_m) e^{im\theta}$$
3. **Scientific Accuracy:** The formulas dynamically read the real `rope_theta` value from the model metadata (e.g., `1000000.0` for Qwen 2.5) and display it in the HUD.

## Diagram

```mermaid
flowchart TD
    Q[Query Vector] --> Rotate[Apply Rotation Matrix R_m]
    K[Key Vector] --> RotateK[Apply Rotation Matrix R_n]
    
    Rotate --> Dot[Dot Product (Attention Score)]
    RotateK --> Dot
    
    subgraph RoPE Property
        Dot -.->|Depends only on relative distance| M_N[m - n]
    end
```

## Related pages
- [Positional Encoding](Transformer-Concepts-Positional-Encoding)
- [Multi-Head Attention](Transformer-Concepts-Multi-Head-Attention)

## Further reading
- [RoPE Paper (Su et al.)](Research-Related-Papers)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Positional Encoding](Transformer-Concepts-Positional-Encoding) | [Home](Home) | [Multi-Head Attention](Transformer-Concepts-Multi-Head-Attention) |
