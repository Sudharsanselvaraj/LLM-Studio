# Logits

## Overview

After the final layer of the transformer, the Unembedding matrix projects the 896-dimensional hidden state back into a 151,936-dimensional vector (one slot for every possible token in the vocabulary). These raw, unnormalized scores are called **Logits**.

## Why it matters

Logits are the model's raw opinions before they are forced into probabilities. A logit can be any number (e.g., -45.2, 0.1, or 18.5). While logits cannot be directly interpreted as percentages, their relative differences determine the final token probabilities.

## How TokenPrint implements it

TokenPrint provides access to Logits primarily through the **Logit Lens** and the Debugger's Ablation tools.

1. **Logit Lens Panel:** This permanent HUD element shows what the model *would* predict if you took the intermediate hidden state at Layer $L$, applied a final RMSNorm, and multiplied it by the Unembedding matrix. It displays both the Logit score and the Softmax probability.
2. **Ablation Diff:** When using the Debugger to zero-out an attention head, TokenPrint shows the Before/After delta of the raw Logit values, allowing researchers to see exactly how much a specific head contributed to a specific token's score.

## Diagram

```mermaid
flowchart LR
    Final[Final Hidden State: 896] --> Unembed[Unembedding Matrix]
    
    subgraph Logits Vector
        Unembed --> T1["Token A: -12.4"]
        Unembed --> T2["Token B: 18.2"]
        Unembed --> T3["Token C: 17.9"]
    end
    
    Logits Vector --> Softmax[To Softmax]
```

## Related pages
- [Softmax](Transformer-Concepts-Softmax)
- [Embeddings](Transformer-Concepts-Embeddings)

## Further reading
- [API Reference - Data Models](API-Reference-Data-Models)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Residual Connections](Transformer-Concepts-Residual-Connections) | [Home](Home) | [Softmax](Transformer-Concepts-Softmax) |
