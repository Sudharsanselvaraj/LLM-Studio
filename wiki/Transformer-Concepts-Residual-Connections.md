# Residual Connections

## Overview

Residual Connections (or Skip Connections) are the central highways through a neural network. Instead of forcing data to pass *through* every layer, the data passes *alongside* the layers, and each layer simply adds its contribution ($\Delta$) to the stream.

## Why it matters

Without Residual Connections, deep networks suffer from vanishing gradients and cannot be trained. Conceptually, they mean a transformer isn't a sequential pipeline where data is mutated beyond recognition at each step; rather, it's an evolving collection of features that are gradually refined.

## How TokenPrint implements it

TokenPrint's `TransformerStack` geometry is built entirely around this concept.
- The Residual Stream is rendered as a continuous, thick vertical spine going from the Embedding layer straight up to the Unembedding layer.
- Attention and MLP blocks are not rendered as inline pipes. They are rendered as **branches** that read a normalized copy of the stream, perform their computation, and add their output back to the spine at highly visible "Merge Nodes" (represented as geometric rings or brackets).

## Diagram

```mermaid
flowchart TD
    In[Input] --> Stream[Residual Stream]
    
    Stream --> Norm[LayerNorm]
    Norm --> Sub[Sub-layer: Attention or MLP]
    Sub --> Add[+]
    
    Stream --> Add
    Add --> StreamNext[Residual Stream (Next Block)]
```

## Related pages
- [Feed Forward Network](Transformer-Concepts-Feed-Forward-Network)
- [Multi-Head Attention](Transformer-Concepts-Multi-Head-Attention)

## Further reading
- [Visual Mapping](../docs/visual-mapping.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Feed Forward Network](Transformer-Concepts-Feed-Forward-Network) | [Home](Home) | [Logits](Transformer-Concepts-Logits) |
