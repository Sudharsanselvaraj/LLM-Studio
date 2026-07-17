"""Phase C check: the operation catalog is real and correctly ordered."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.model import ModelEngine  # noqa: E402


def main() -> int:
    eng = ModelEngine()
    cat = eng._op_catalog()
    print(f"total ops: {len(cat)}")

    ok = True
    assert cat[0]["op_key"] == "embedding", "first op must be embedding"

    layer0 = [o["op_key"] for o in cat if o["layer"] == 0]
    expect = [
        "norm", "attn.q", "attn.k", "attn.v", "attention",
        "attn.o", "norm", "mlp.gate", "mlp.up", "mlp.down",
    ]
    print("layer-0 op order:", layer0)
    if layer0 != expect:
        ok = False
        print("  !! layer-0 order mismatch")

    # per-op param counts match the real modules
    q = next(o for o in cat if o["op_key"] == "attn.q" and o["layer"] == 0)
    qmod = eng.model.model.layers[0].self_attn.q_proj
    real_q = sum(p.numel() for p in qmod.parameters())
    print(f"q_proj L0: op={q['param_count']:,} module={real_q:,} "
          f"in={q['in_dim']} out={q['out_dim']} bias={q['bias_dim']}")
    if q["param_count"] != real_q:
        ok = False

    # attention compute ops carry no params
    if not all(o["param_count"] == 0 for o in cat if o["op_key"] == "attention"):
        ok = False
        print("  !! attention op has nonzero params")

    # cumulative is monotonic
    cums = [o["cumulative_params"] for o in cat]
    if not all(cums[i] <= cums[i + 1] for i in range(len(cums) - 1)):
        ok = False
        print("  !! cumulative not monotonic")

    # weight preview is a bounded real slice
    if not (len(q["weight_preview"]) <= 8 and len(q["weight_preview"][0]) <= 8):
        ok = False

    print(f"final op: {cat[-1]['label']} · cumulative params used: {cums[-1]:,}")
    print("\n" + ("PASS: op catalog is real, ordered, and bounded." if ok else "FAIL."))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
