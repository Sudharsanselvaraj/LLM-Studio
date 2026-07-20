"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";

interface DeltaEntry {
  name: string;
  score: number;
  rank: number;
}

export default function LoraDeltaViz() {
  const arch = useStore((s) => s.arch);
  const compareArch = useStore((s) => s.compareArch);
  const hotSpots = useStore((s) => s.hotSpots);
  const hotSpotsLoading = useStore((s) => s.hotSpotsLoading);
  const computeHotSpots = useStore((s) => s.computeHotSpots);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  const entries: DeltaEntry[] = useMemo(() => {
    return [...hotSpots].map((h) => ({ name: h.name, score: h.score, rank: h.rank }));
  }, [hotSpots]);

  if (!arch || !compareArch) {
    return (
      <div className="lora-delta">
        <div className="ld-title">LoRA Delta</div>
        <div className="ld-empty">Load two GGUF files to compare base vs merged weights.</div>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) =>
    sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name)
  );
  const maxScore = sorted.length > 0 ? Math.max(...sorted.map((e) => e.score), 0.0001) : 1;

  if (entries.length === 0 && !hotSpotsLoading) {
    return (
      <div className="lora-delta">
        <div className="ld-title">LoRA Delta</div>
        <div className="ld-desc">
          Mean absolute difference per element between corresponding tensors in the two GGUFs.
        </div>
        <button className="ld-compute-btn" onClick={computeHotSpots}>
          Compute deltas
        </button>
        <div className="ld-hint">
          Samples 1024 elements per tensor and ranks by absolute difference.
        </div>
      </div>
    );
  }

  return (
    <div className="lora-delta">
      <div className="ld-title">LoRA Delta</div>
      <div className="ld-desc">
        Real mean-absolute-difference per element between corresponding tensors in the two loaded GGUFs.
        Tensors with the largest deltas are where the weights changed most.
      </div>

      <div className="ld-toolbar">
        <button
          className={"ld-sort" + (sortBy === "score" ? " active" : "")}
          onClick={() => setSortBy("score")}
        >
          Sort by delta
        </button>
        <button
          className={"ld-sort" + (sortBy === "name" ? " active" : "")}
          onClick={() => setSortBy("name")}
        >
          Sort by name
        </button>
        {hotSpotsLoading && <span className="ld-loading">Computing…</span>}
        {!hotSpotsLoading && (
          <button className="ld-recompute-btn" onClick={computeHotSpots}>
            Recompute
          </button>
        )}
      </div>

      <div className="ld-list">
        {sorted.slice(0, 20).map((e) => (
          <div key={e.name} className="ld-row" title={`Rank #${e.rank}`}>
            <div className="ld-name">{e.name.slice(0, 40)}{e.name.length > 40 ? "…" : ""}</div>
            <div className="ld-bar-track">
              <div className="ld-bar" style={{ width: `${(e.score / maxScore) * 100}%` }} />
            </div>
            <span className="ld-val">{e.score.toExponential(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
