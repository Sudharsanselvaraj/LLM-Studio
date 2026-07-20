# Multi-Head Attention

## Overview

Multi-Head Attention (MHA) is the heart of the transformer. It is the mechanism that allows tokens to look at all previous tokens and decide which ones are relevant to the current context.

## Why it matters

Attention is how the model understands grammar, resolves pronouns (e.g., knowing "it" refers to "the dog"), and pulls facts from earlier in the prompt. "Multi-Head" means the model performs this operation multiple times in parallel, allowing different heads to specialize (e.g., one head looks for verbs, another for proper nouns).

## How TokenPrint implements it

TokenPrint takes MHA very seriously:
1. **Geometry:** The Attention block in the 3D stack is built out of distinct "blades." 
2. **Data-Driven Count:** If the model has 14 Query heads, there will be exactly 14 blades.
3. **GQA (Grouped Query Attention):** Modern models group query heads to share KV heads for memory efficiency. TokenPrint clusters the 3D blades according to the real `num_kv_heads` ratio.
4. **Walkthrough Mode:** The Attention chapter in the Walkthrough pulls the real, un-tempered `[layer][head][from][to]` attention probability tensor from the backend and renders physical bezier curves connecting tokens in 3D space, with thickness proportional to the attention weight.

## Diagram

```mermaid
flowchart TD
    Input --> LinearQ[Linear: Queries]
    Input --> LinearK[Linear: Keys]
    Input --> LinearV[Linear: Values]
    
    LinearQ --> Dot[Dot Product]
    LinearK --> Dot
    
    Dot --> Scale[Scale 1/sqrt(d)]
    Scale --> Mask[Causal Mask]
    Mask --> Softmax[Softmax]
    
    Softmax --> MultV[Multiply by Values]
    LinearV --> MultV
    
    MultV --> Concat[Concat Heads]
    Concat --> Out[Linear: Output]
```

## Related pages
- [KV Cache](Transformer-Concepts-KV-Cache)
- [Residual Connections](Transformer-Concepts-Residual-Connections)

## Further reading
- [Visual Mapping](../docs/visual-mapping.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [RoPE](Transformer-Concepts-RoPE) | [Home](Home) | [KV Cache](Transformer-Concepts-KV-Cache) |
