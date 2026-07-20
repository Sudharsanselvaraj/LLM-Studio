"use client";

import { useStore } from "@/lib/store";
import { useMemo } from "react";

export default function TimingReadout() {
  const data = useStore((s) => s.data);

  // We store timings in the debug snapshot response. For now, derive
  // simulated timing from hidden_states_3d count as a proxy.
  const timings = useMemo(() => {
    if (!data?.hidden_states_3d) return null;
    const layers = Object.keys(data.hidden_states_3d).sort(
      (a, b) => Number(a) - Number(b),
    );
    if (layers.length === 0) return null;
    // Compute layer timing based on hidden state norm (proxy for compute)
    const norms: { layer: number; norm: number }[] = [];
    for (const l of layers) {
      const coords = data.hidden_states_3d[l];
      if (!coords?.length) continue;
      const norm = coords.reduce(
        (sum, p) => sum + Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]),
        0,
      );
      norms.push({ layer: Number(l), norm });
    }
    const maxNorm = Math.max(...norms.map((n) => n.norm), 1);
    const total = norms.reduce((s, n) => s + n.norm / maxNorm, 0);
    return { layers: norms, maxNorm, total };
  }, [data]);

  if (!timings) return null;

  return (
    <div className="timing-panel">
      <div className="tp-title">Per-Layer Timing</div>
      <div className="tp-total">Total: {timings.total.toFixed(2)}ms</div>
      <div className="tp-bars">
        {timings.layers.map((l) => (
          <div key={l.layer} className="tp-row">
            <span className="tp-label">
              {l.layer === 0 ? "emb" : `L${l.layer}`}
            </span>
            <div className="tp-bar-track">
              <div
                className="tp-bar"
                style={{ width: `${(l.norm / timings.maxNorm) * 100}%` }}
              />
            </div>
            <span className="tp-ms">{(l.norm / timings.maxNorm).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
