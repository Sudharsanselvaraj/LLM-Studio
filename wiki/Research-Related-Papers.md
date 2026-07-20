# Related Papers

## Overview

TokenPrint's architecture and visualizations are based on several foundational papers in the deep learning space.

## Foundational Architecture

- **Attention Is All You Need** (Vaswani et al., 2017)
  - The seminal paper introducing the Transformer, Multi-Head Attention, and the foundational encoder-decoder structure.
  - *TokenPrint Relevance:* The basis for the entire `TransformerStack` scene.
- **Llama: Open and Efficient Foundation Language Models** (Touvron et al., 2023)
  - Details the structural shifts from GPT-2 to modern open weights (RMSNorm, SwiGLU, RoPE).
  - *TokenPrint Relevance:* Guided the `detectArch("llama")` geometric rules.

## Core Mechanisms

- **RoPE (Rotary Position Embedding)** (Su et al., 2021)
  - Replaces additive position encodings with a rotation matrix applied to Q and K.
  - *TokenPrint Relevance:* Visualized directly in the 3D scene as a helical twist applied before the attention blades.
- **GLU Variants Improve Transformer** (Shazeer, 2020)
  - Introduces SwiGLU and GeGLU, proving them superior to standard GELU MLPs.
  - *TokenPrint Relevance:* Dictates the split "gate" and "up" prongs in TokenPrint's MLP funnel geometry.
- **GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints** (Ainslie et al., 2023)
  - Introduces Grouped Query Attention.
  - *TokenPrint Relevance:* TokenPrint clusters Q blades around shared KV blades when `num_kv_heads < num_heads`.

## Mechanistic Interpretability

- **A Mathematical Framework for Transformer Circuits** (Elhage et al., Anthropic, 2021)
  - Treats attention heads as independent read/write circuits.
  - *TokenPrint Relevance:* Inspired the "Residual Stream as a central spine" geometric approach, where attention blocks are branches adding $\Delta$, rather than sequential pipes.

## Related pages
- [Existing Visualization Tools](Research-Existing-Visualization-Tools)
- [Design Philosophy](Research-Design-Philosophy)

## Further reading
- [Project README](../README.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Research](Research) | [Home](Home) | [Existing Visualization Tools](Research-Existing-Visualization-Tools) |
