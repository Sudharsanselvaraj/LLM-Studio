"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";

export default function ResidualContributions() {
  const data = useStore((s) => s.data);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const contributions = useMemo(() => {
    if (!data?.hidden_states_3d) return null;

    // hidden_states_3d has keys "0" (embedding) through "N" (after layer N-1).
    // The difference in PCA space between consecutive layers approximates the
    // contribution of that layer to the residual stream.
    const layerKeys = Object.keys(data.hidden_states_3d).sort(
      (a, b) => Number(a) - Number(b)
    );
    if (layerKeys.length < 2) return null;

    const nLayers = layerKeys.length - 1; // contribution = diff between consecutive layers
    const nTokens = data.hidden_states_3d[layerKeys[0]].length;

    const perLayer: { total: number; contributions: number[] }[] = [];

    for (let l = 0; l < nLayers; l++) {
      const prev = data.hidden_states_3d[layerKeys[l]];
      const curr = data.hidden_states_3d[layerKeys[l + 1]];
      if (!prev || !curr) continue;

      const diffs: number[] = [];
      for (let t = 0; t < Math.min(prev.length, curr.length); t++) {
        const dx = curr[t][0] - prev[t][0];
        const dy = curr[t][1] - prev[t][1];
        const dz = curr[t][2] - prev[t][2];
        diffs.push(Math.sqrt(dx * dx + dy * dy + dz * dz));
      }

      const sum = diffs.reduce((a, b) => a + b, 0);
      perLayer.push({
        total: sum / diffs.length,
        contributions: diffs,
      });
    }

    if (perLayer.length === 0) return null;
    const maxVal = Math.max(...perLayer.map((p) => p.total), 0.0001);
    return { layers: perLayer, maxVal, nTokens };
  }, [data]);

  if (!contributions) {
    return (
      <div className="residual-contrib">
        <div className="rc-title">Residual Contribution</div>
        <div className="rc-empty">
          Run an analysis first. Uses real hidden-state PCA projections to measure each layer's contribution to the residual stream.
        </div>
      </div>
    );
  }

  return (
    <div className="residual-contrib">
      <div className="rc-title">Residual Contribution</div>
      <div className="rc-desc">
        Per-layer residual stream change magnitude (mean PCA-space distance between consecutive hidden states). Higher bars = larger update to the residual.
      </div>
      <div className="rc-chart">
        {contributions.layers.map((layer, l) => {
          const h = (layer.total / contributions.maxVal) * 100;
          const isActive = l === activeLayer;
          return (
            <div
              key={l}
              className={"rc-bar-col" + (isActive ? " active" : "")}
              onMouseEnter={() => setActiveLayer(l)}
              onMouseLeave={() => setActiveLayer(null)}
            >
              <div className="rc-bar-stack" style={{ height: `${Math.max(h, 2)}%` }}>
                <div
                  className="rc-bar rc-bar-total"
                  style={{ height: "100%" }}
                  title={`L${l}: ${layer.total.toExponential(3)}`}
                />
              </div>
              <span className="rc-label">{l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
