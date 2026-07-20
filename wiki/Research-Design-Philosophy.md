# Design Philosophy

## Overview

The core design philosophy of TokenPrint is **Scientific Honesty**. It is an instrument, not an illustration.

## 1. Real Data Over Decorative Simulation

If a 3D block glows, it is because the real PyTorch `layer_stats` activation magnitude was high for that specific layer on that specific token. If TokenPrint cannot get the data for a feature, it omits the visual entirely. It never calls `Math.random()` to simulate "AI thinking."

## 2. Architecture-Faithful Visuals

A diagram of a transformer with LayerNorm and standard MLPs is technically a lie if the loaded model is Llama. TokenPrint dynamically alters its geometry and formulas based on the model's actual configuration. If the model has 14 heads, you see 14 blades. If the user loads a 32-head model, they see 32 blades.

## 3. Explainability for Beginners, Depth for Researchers

TokenPrint aims for a "low floor, high ceiling." 
- **Low Floor:** A beginner can run the Walkthrough, read the simple chapter text, and watch the camera glide through the basic concepts of Embeddings and Attention.
- **High Ceiling:** An engineer can hit `F10` for Dev Mode, pause the generation, open the Tensor Inspector, and view the raw `float16` weights of the `gate_proj` matrix.

## 4. Fast Local Workflows

Data privacy is critical. Users must be able to drag-and-drop a confidential, fine-tuned GGUF model into the browser without fear of it being uploaded to a cloud server. TokenPrint's GGUF parser runs 100% locally in the browser memory.

## Related pages
- [Scientific Accuracy](Research-Scientific-Accuracy)
- [Code Style](Developer-Guide-Code-Style)

## Further reading
- [Design Review Docs](../docs/design-review.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Existing Visualization Tools](Research-Existing-Visualization-Tools) | [Home](Home) | [Scientific Accuracy](Research-Scientific-Accuracy) |
