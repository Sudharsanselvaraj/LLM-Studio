# Tensor Format

## Overview

PyTorch operates on multi-dimensional tensors (e.g., shape `[24, 14, 5, 5]`). JSON only understands nested arrays. TokenPrint requires a specific serialization strategy to move massive mathematical structures over the network without melting the browser.

## The Attention Matrix

The most complex tensor sent over the wire is the Attention probabilities.
A typical shape is `[num_layers, num_heads, sequence_length, sequence_length]`.

For a 24-layer model with 14 heads and a 10-token prompt, this is $24 \times 14 \times 10 \times 10 = 33,600$ floats.

### Optimization Strategy

In `backend/app/schemas.py`, TokenPrint applies aggressive formatting to this specific tensor before JSON serialization:

1. **Truncation:** Every float is rounded to 3 decimal places (`0.145623` $\rightarrow$ `0.146`).
2. **Sparsity Enforcement:** Because Softmax creates many tiny values, any value below `0.01` (1%) is explicitly set to `0.0`.
3. **Array Flattening:** Instead of a complex dictionary, it is sent as a raw 4D nested list.

This reduces a 5MB payload to under 200KB, allowing near-instant parsing by the frontend `WalkthroughScene`.

## The Hidden States (PCA)

Sending the raw hidden states (`[25_layers, seq_length, 896_hidden_size]`) would be massive.

Instead, TokenPrint applies Principal Component Analysis (PCA) directly in the PyTorch backend (`reduce.py`).
1. It fits PCA on the final layer's hidden states to find the 3 most significant dimensions of variance.
2. It projects all 896-dimensional vectors from every layer into those 3 dimensions.
3. The API only transmits arrays of `[x, y, z]` floats.

## Related pages
- [Data Models](API-Reference-Data-Models)

## Further reading
- [Architecture Docs](../docs/architecture.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Data Models](API-Reference-Data-Models) | [Home](Home) | [Research](Research) |
