# LayerNorm (and RMSNorm)

## Overview

Normalization keeps the numbers flowing through the transformer stable. Without it, the massive matrix multiplications would cause the values to either explode toward infinity or vanish toward zero.

## Why it matters

If the values inside the model become too large, the gradients used during training become unstable. During inference, extreme values can break the Softmax function, leading to garbage text generation. LayerNorm ensures the activations always have a reasonable mean and variance.

## How TokenPrint implements it

TokenPrint supports both standard LayerNorm and the more modern RMSNorm.

1. **Geometry:** In the `TransformerStack`, normalization is represented as a **waist** or collar on the Residual Stream. Because normalization scales the *magnitude* of the vectors but doesn't change their *dimensionality*, the physical width of the 3D block stays the same (e.g., 896 $\rightarrow$ 896), but the block pinches inward.
2. **Architecture Detection:** 
   - If `gpt2` is loaded, TokenPrint shows LayerNorm (which centers the mean and scales the variance).
   - If `llama` or `qwen2` is loaded, TokenPrint shows RMSNorm (Root Mean Square Normalization), which skips the mean-centering step for faster computation.
3. **HUD Formulas:** The Right Panel updates to display the exact mathematical formulation, including the $\epsilon$ (epsilon) constant used to prevent division by zero.

## Diagram

```mermaid
flowchart LR
    Input[Unnormalized Vector X] --> Mean[Calculate Mean]
    Input --> Var[Calculate Variance]
    
    Mean --> Norm[Normalize: X - Mean / sqrt(Var + eps)]
    Var --> Norm
    
    Norm --> Scale[Scale by Gamma]
    Scale --> Shift[Shift by Beta]
    
    Shift --> Output[Normalized Vector]
    
    subgraph RMSNorm Shortcut
        Input -.-> |Skip Mean| RMS[Calculate RMS]
        RMS -.-> |Scale by Gamma only| Output
    end
```

## Related pages
- [Residual Connections](Transformer-Concepts-Residual-Connections)
- [Supported Models](Supported-Models)

## Further reading
- [Visual Mapping](../docs/visual-mapping.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [KV Cache](Transformer-Concepts-KV-Cache) | [Home](Home) | [Feed Forward Network](Transformer-Concepts-Feed-Forward-Network) |
