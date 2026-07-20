# Existing Visualization Tools

## Overview

TokenPrint sits in a unique space between educational animations and hardcore engineering dashboards. Here is how it compares to the existing ecosystem.

## 1. Educational Visualizers (e.g., LLM Visualization by Brendan Bycroft)
*Brendan Bycroft's brilliant 3D visualizer is the spiritual predecessor to TokenPrint.*
- **Their Approach:** Hardcodes a tiny toy model (like a 10k parameter GPT-2). Shows a highly curated, deterministic fly-through. Excellent for first-time learners.
- **TokenPrint's Approach:** Connects to a live PyTorch backend running real 0.5B+ parameter models (Qwen, Llama). Supports arbitrary user prompts. Supports GGUF parsing. Sacrifices some introductory simplicity for absolute scientific truth.

## 2. Graph Inspectors (e.g., Netron)
- **Their Approach:** Parses ONNX or GGUF files and renders a massive 2D flowchart of the computation graph (MatMul $\rightarrow$ Add $\rightarrow$ Softmax).
- **TokenPrint's Approach:** Translates that flat graph into an architecture-aware 3D stack. Netron tells you *what* the math is; TokenPrint shows you *how* the data moves through it during generation.

## 3. Training Dashboards (e.g., TensorBoard, Weights & Biases)
- **Their Approach:** Plots loss curves, learning rates, and gradient histograms over time.
- **TokenPrint's Approach:** Focused purely on Inference and Mechanistic Interpretability, not training dynamics.

## 4. Feature Extraction (e.g., TransformerLens)
- **Their Approach:** A Python library for hacking into PyTorch forward passes to extract activations.
- **TokenPrint's Approach:** A visual interface that *uses* techniques similar to TransformerLens on the backend, but makes the results accessible via a 60fps 3D interface rather than a Jupyter Notebook plot.

## Related pages
- [Design Philosophy](Research-Design-Philosophy)
- [Scientific Accuracy](Research-Scientific-Accuracy)

## Further reading
- [Roadmap](../ROADMAP.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Related Papers](Research-Related-Papers) | [Home](Home) | [Design Philosophy](Research-Design-Philosophy) |
