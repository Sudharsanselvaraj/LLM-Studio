# Development

## Prerequisites

- Python 3.11+
- Node 18+
- A machine that can run a small HF model locally (Apple Silicon / MPS, CUDA, or
  CPU). ~1 GB free for the model download.

## Run both servers

```bash
# 1) backend
cd backend
python3 -m venv .venv                 # --system-site-packages to reuse a system torch
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --app-dir . --port 8000 --reload

# 2) frontend (new terminal)
cd frontend
npm install
npm run dev                           # http://localhost:3000
```

Open http://localhost:3000 and pick a mode from the top bar.

### Environment variables

| Var | Default | Purpose |
| --- | --- | --- |
| `NEUROSCOPE_MODEL` | `Qwen/Qwen2.5-0.5B-Instruct` | model id to load |
| `NEUROSCOPE_DEVICE` | auto (`mps`→`cpu`) | force compute device |
| `NEUROSCOPE_MAX_TOKENS` | `40` | `/analyze` token cap |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | backend URL for the frontend |

> `USE_TF=0` / `USE_FLAX=0` are set in `app/model.py` so a broken system
> TensorFlow can't crash `transformers` on import.

## Where things live

```
backend/app/model.py     ModelEngine: analyze(), generate_steps(), _op_catalog(), architecture()
backend/app/main.py      FastAPI endpoints (REST + WebSocket)
backend/app/reduce.py    PCA projection
backend/scripts/         real-data verification scripts

frontend/lib/store.ts        Zustand store (mode, explorer, generation, walkthrough)
frontend/lib/gguf/           client-side GGUF parser + ggml type table
frontend/lib/formulas.ts     architecture-aware KaTeX formula sets
frontend/lib/pointcloud.ts   tensor list → THREE.Points cloud
frontend/lib/playback.ts     op→layer mapping, layer anchors, KV phaseInfo
frontend/components/AppShell.tsx        top bar + sidebar + canvas + right panel
frontend/components/PlaybackEngine.tsx  single autoplay ticker (generation + walkthrough)
frontend/components/SceneLoader.tsx     WebGL boundary + context-loss recovery
frontend/components/scenes/        TensorCloud, GenerationScene, WalkthroughScene,
                                   TransformerStack (data-driven block geometry)
frontend/components/ui/            all 2D panels

tools/                    headed-Chrome verification & screenshot scripts
docs/                     this documentation
```

## Build & type-check

```bash
cd frontend && npm run build          # type-checks the whole tree; must pass
```

## Verifying against real data

See [verification.md](verification.md). In short:

```bash
backend/.venv/bin/python backend/scripts/verify_real_data.py    # attention is real
backend/.venv/bin/python backend/scripts/verify_geometry.py     # PCA geometry is real
backend/.venv/bin/python backend/scripts/verify_trace.py        # op catalog is real
```

Frontend visuals are captured with a **headed** Chrome window (headless WebGL
screenshots are unreliable) via the `tools/*.mjs` scripts, which use
`puppeteer-core` against the system Chrome.

## Notes on the model

Any small HF causal LM with an accessible module tree works. The op catalog in
`_op_catalog()` walks Qwen2's module layout (`embed_tokens`, per-layer
`input_layernorm` / `self_attn.{q,k,v,o}_proj` / `post_attention_layernorm` /
`mlp.{gate,up,down}_proj`, final `norm`, `lm_head`); adapting to another family
means adjusting that walk and adding a formula set in `lib/formulas.ts`.

## Scripts

**Frontend** (`cd frontend`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server on :3000 |
| `npm run build` | Runs `verify-data` **then** `next build` (static export → `out/`) |
| `npm run verify-data` | Fails if `Math.random` appears in `components/`, `lib/`, `app/` — see [verification.md](verification.md) |
| `npx tsc --noEmit` | Typecheck |

**Backend verification** (`cd backend`)

| Script | Checks |
| --- | --- |
| `scripts/verify_real_data.py` | Attention + PCA match an independent forward pass |
| `scripts/verify_geometry.py` | Embedding geometry is real and deterministic |
| `scripts/verify_trace.py` | Op catalog ordering and per-op parameter counts |
| `scripts/verify_generation.py` | Streamed generation frames |

**Trace tooling** (repo root)

| Script | Use |
| --- | --- |
| `scripts/trace_client.py --prompt "…" --output trace.json` | Capture a trace headlessly (CI, batch runs) |
| `scripts/trace_diff.py baseline.json head.json --tolerance 0.05 --fail-on-diff` | Regression gate — non-zero exit when the forward pass drifts |
| `scripts/generate-demo-trace.py` | Regenerate the bundled demo trace in `frontend/public/demo/` |

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / pause |
| `F10` | Step one op |
| `F11` | Step one layer |
| `J` / `K` | Previous / next token |
| `B` | Toggle breakpoint at the current op |

## Adding a panel

Panels are plain components under `components/ui/`. Engineer-facing ones should
be gated on `devMode` from the store, or registered in `DebuggerPane` to appear
in the Debugger-mode dashboard. Two rules:

1. **Every number must trace to real model data.** If a value isn't available
   yet, omit it and say so in the UI — do not fill the gap with a plausible
   placeholder. The build guard blocks `Math.random`, but it cannot catch a real
   number under a misleading label.
2. **The panel title must match what is computed.** If it shows a logit-lens
   trajectory, don't call it activation patching.
