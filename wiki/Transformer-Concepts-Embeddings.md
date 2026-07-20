# Embeddings

## Overview

The Embedding layer acts as a massive dictionary. It takes the integer Token IDs produced by the Tokenizer and looks up a corresponding high-dimensional vector (an array of floating-point numbers) for each token.

## Why it matters

Integers alone are meaningless to a neural network because they imply arbitrary magnitude (e.g., ID 1000 is not "twice as much" as ID 500). Vectors, however, represent points in high-dimensional space. The model learns to position words with similar meanings close together in this space.

## How TokenPrint implements it

The Embedding matrix is a massive tensor with shape `[vocab_size, hidden_size]`. For Qwen 0.5B, this is `[151936, 896]`.

In TokenPrint:
1. **Architecture Explorer:** The Embedding tensor is rendered as a distinct cluster in the point cloud.
2. **Generation/Walkthrough:** The Embedding layer is rendered as the wide base of the `TransformerStack`. Its width is proportional to $log_2(vocab\_size)$, and its depth is proportional to $hidden\_size$.
3. **Walkthrough Chapter:** The Embedding chapter uses Principal Component Analysis (PCA) to compress the real 896-dimensional vectors into 3D space (`x, y, z`). It renders the vectors as physical points in the canvas, showing how the prompt's words are distributed geometrically based on the real model's learned weights.

## Diagram

```mermaid
flowchart TD
    ID[Token ID: 785] --> Lookup{Embedding Matrix}
    Lookup --> Vector["[0.12, -0.45, 0.89, ... 896 values]"]
    
    subgraph Matrix Shape
        V[Rows: Vocab Size]
        H[Cols: Hidden Size]
    end
    
    Lookup -.-> Matrix Shape
```

## Related pages
- [Tokenization](Transformer-Concepts-Tokenization)
- [Positional Encoding](Transformer-Concepts-Positional-Encoding)

## Further reading
- [Visual Mapping](../docs/visual-mapping.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Tokenization](Transformer-Concepts-Tokenization) | [Home](Home) | [Positional Encoding](Transformer-Concepts-Positional-Encoding) |
