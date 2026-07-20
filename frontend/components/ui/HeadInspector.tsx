"use client";

import { useStore } from "@/lib/store";
import { useMemo } from "react";

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export default function HeadInspector() {
  const data = useStore((s) => s.data);
  const selectedLayer = useStore((s) => s.selectedLayer);
  const selectedHead = useStore((s) => s.selectedHead);

  const headData = useMemo(() => {
    if (!data?.attention?.length) return null;
    const attn = data.attention;
    const L = attn.length;
    const H = attn[0]?.length ?? 0;
    const T = attn[0]?.[0]?.length ?? 0;

    // Compute fingerprints: average attention pattern per head (across from-tokens)
    const fingerprints: number[][] = [];
    for (let h = 0; h < H; h++) {
      const avg: number[] = new Array(T).fill(0);
      for (let f = 0; f < T; f++) {
        for (let t = 0; t < T; t++) {
          avg[t] += attn[0][h][f][t];
        }
      }
      for (let t = 0; t < T; t++) avg[t] /= T;
      fingerprints.push(avg);
    }

    // Similarity matrix between heads (layer 0)
    const sim: number[][] = [];
    for (let a = 0; a < H; a++) {
      sim[a] = [];
      for (let b = 0; b < H; b++) {
        sim[a][b] = cosineSim(fingerprints[a], fingerprints[b]);
      }
    }

    return { attn, L, H, T, fingerprints, sim };
  }, [data]);

  if (!headData) return null;
  const { attn, H, T, sim, fingerprints } = headData;
  const layer = attn[selectedLayer] ?? attn[0];
  const head = layer[selectedHead] ?? layer[0];

  return (
    <div className="head-inspector">
      <div className="hi-title">Attention Head Inspector</div>
      <div className="hi-meta">
        Layer {selectedLayer} · Head {selectedHead}
      </div>

      {/* Per-head heatmap for the selected head */}
      <div className="hi-heatmap">
        {head.slice(0, 16).map((row, fi) =>
          row.slice(0, 16).map((w, ti) => (
            <div
              key={`${fi}-${ti}`}
              className="hi-cell"
              style={{
                background: `oklch(${50 + w * 40}% 0.06 250)`,
                opacity: 0.3 + w * 0.7,
              }}
              title={`[${fi}→${ti}] ${(w * 100).toFixed(1)}%`}
            />
          )),
        )}
      </div>

      {/* Fingerprint: avg attention-to pattern for each head (layer 0) */}
      <div className="hi-section-label">Head fingerprints (layer 0)</div>
      <div className="hi-fingerprints">
        {fingerprints.map((fp, h) => (
          <div key={h} className={`hi-fp-row${h === selectedHead ? " active" : ""}`}>
            <span className="hi-fp-label">H{h}</span>
            <div className="hi-fp-bars">
              {fp.map((v, t) => (
                <div
                  key={t}
                  className="hi-fp-bar"
                  style={{ height: `${Math.max(2, v * 100)}%` }}
                  title={`H${h}→pos${t}: ${(v * 100).toFixed(1)}%`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Similarity matrix between heads */}
      <div className="hi-section-label">Head similarity matrix</div>
      <div className="hi-sim-grid" style={{ "--h": H } as React.CSSProperties}>
        {sim.map((row, a) =>
          row.map((v, b) => (
            <div
              key={`${a}-${b}`}
              className="hi-sim-cell"
              style={{
                background: `oklch(${80 - Math.abs(v) * 50}% ${Math.abs(v) * 0.15} ${v > 0 ? 140 : 0})`,
              }}
              title={`H${a}↔H${b}: ${v.toFixed(3)}`}
            />
          )),
        )}
      </div>
    </div>
  );
}
