# Scientific Accuracy

## Overview

It is easy to claim "no fabricated numbers," but TokenPrint enforces this mechanically through architecture and CI/CD pipelines.

## How TokenPrint proves it

### 1. The Ban on `Math.random()`
The build script (`frontend/scripts/verify-data.sh`) mechanically greps the codebase for `Math.random()`. The only exceptions allowed (via a strict allowlist) are for purely visual layout jitter, such as scattering the points slightly inside a tensor's bounding box in the Architecture Explorer to make the cloud look volumetric instead of perfectly uniform. All data values, lengths, widths, and opacities must come from the Zustand store.

### 2. GGUF Parsing Verification
The client-side GGUF parser has been verified against raw binary dumps of Llama 3 and Qwen models. It accurately extracts the byte offsets, decompresses the Q4_K quantizations, and retrieves the exact `vocab_size` and `context_length` metadata.

### 3. PyTorch Backend Integrity
The `verify_real_data.py` script ensures that the `generate_steps` loop produces the exact same token sequence and probability distribution as a standard `model.generate()` call using the HuggingFace transformers library.

### 4. Trace Diffing
The CI/CD pipeline uses `scripts/trace_diff.py`. It records a generation trace, makes a code change, records another trace, and diffs them. If refactoring the PyTorch engine alters a floating-point probability by more than a specified tolerance, the build fails. This guarantees that visual updates don't break the underlying math.

## Related pages
- [Design Philosophy](Research-Design-Philosophy)
- [Debugging](Developer-Guide-Debugging)

## Further reading
- [Verification Docs](../docs/verification.md)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [Design Philosophy](Research-Design-Philosophy) | [Home](Home) | [Roadmap](Roadmap) |
