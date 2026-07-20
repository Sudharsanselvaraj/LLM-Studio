# TokenPrint documentation

TokenPrint is a browser-based 3D **visual debugger** for language-model internals. Every
value it shows comes from real parsed model files or a real forward pass —
nothing is illustrative or hardcoded.

## Contents

- [**Architecture**](architecture.md) — how the backend, frontend and the four
  modes fit together, how data flows, and the docked-shell layout.
- [**API reference**](api.md) — the backend HTTP + WebSocket endpoints, including
  trace record/replay, stepped debug, and ablation.
- [**Design review & roadmap**](design-review.md) — the full design/engineering
  audit and the phased plan, with current status.
- [**Visual mapping**](visual-mapping.md) — the explicit contract between real
  model properties and rendered geometry, colour, and motion.
- [**GGUF format**](gguf-format.md) — what the client-side GGUF parser reads and
  how it maps to the UI.
- [**Development**](development.md) — setup, running, and where things live.
- [**Contribution ideas**](contributing-ideas.md) — concrete openings by
  difficulty, with files to touch and how to verify.
- [**Deployment**](deployment.md) — hosting the frontend and backend (and why the
  backend can't be serverless).
- [**Verification**](verification.md) — how the "the data is real" claim is
  proven, with concrete numbers.

## The four modes

| Mode | What it shows | Data source |
| ---- | ------------- | ----------- |
| **Architecture** | A 3D point cloud of a model's real tensors, a 2D tile grid, topology view, model info pane, tensor list, and a two-GGUF quantization diff with real dequantized value histograms. | The live model (`GET /architecture`) **or** a drag-and-dropped `.gguf` parsed client-side. |
| **Generation** | An autoplaying real greedy generation walked layer-by-layer over data-driven block geometry (GQA blades, SwiGLU prongs, RMSNorm collars, residual branch/merge nodes, RoPE helix, spatial KV cache), with follow-mode camera, speed/skip controls, a real pre-fill/decode KV readout, formulas, weight previews, a top-k skyline, and the prediction game. | `WS /ws/generate` (real forward pass + op catalog + phase). |
| **Walkthrough** | A chaptered, auto-advancing explanation, gated on real data, where every number is read from a real forward pass — including the logit lens and multilingual tokenization presets. | `POST /analyze` (real attention + geometry + logit lens). |
| **Debugger** | A tiled engineer dashboard: breakpoints, flame graph, anomaly sentinels, watch expressions, layer table, head grid, ablation with before→after diff, induction-head lab, trace replay/branching, console REPL, raw export. | `/debug/*`, `/ablate/analyze`, and recorded traces. |

## Guiding principle

> Every visualized number — parameter counts, tensor shapes, attention weights,
> logits, layer activations — is derived from real parsed model data or a real
> forward pass. If real data can't cleanly support a visual, the visual is
> adjusted or labeled, never faked.

This is enforced by the build, not by discipline: `npm run build` runs
`frontend/scripts/verify-data.sh`, which fails on `Math.random` anywhere in
application code. See [verification.md](verification.md) for why that guard
exists and where the guarantee still has known gaps.
