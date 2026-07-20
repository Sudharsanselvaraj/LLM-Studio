"use client";

import { useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";

/**
 * ComparePanel: histogram comparison of dequantized tensor values from two
 * GGUF files.  Shows overlaid histograms of the selected tensor from both files
 * with a quantization-error readout, plus a ranked "hot spots" list.
 */
export default function ComparePanel() {
  const arch = useStore((s) => s.arch);
  const compareArch = useStore((s) => s.compareArch);
  const compareFile = useStore((s) => s.compareFile);
  const loadCompareGguf = useStore((s) => s.loadCompareGguf);
  const clearCompare = useStore((s) => s.clearCompare);
  const selectedTensor = useStore((s) => s.selectedTensor);
  const setSelectedTensor = useStore((s) => s.setSelectedTensor);
  const dequantA = useStore((s) => s.dequantA);
  const dequantB = useStore((s) => s.dequantB);
  const dequantLoading = useStore((s) => s.dequantLoading);
  const quantErrorMetric = useStore((s) => s.quantErrorMetric);
  const compareLoading = useStore((s) => s.compareLoading);
  const compareError = useStore((s) => s.compareError);
  const hotSpots = useStore((s) => s.hotSpots);
  const hotSpotsLoading = useStore((s) => s.hotSpotsLoading);
  const computeHotSpots = useStore((s) => s.computeHotSpots);

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback(
    (f?: File | null) => {
      if (f) loadCompareGguf(f);
    },
    [loadCompareGguf],
  );

  // Auto-compute hot spots when both files are loaded.
  useEffect(() => {
    const s = useStore.getState();
    if (s.arch && s.archFile && s.compareArch && s.compareFile) {
      computeHotSpots();
    }
  }, [compareArch, compareFile, computeHotSpots]);

  // Draw histograms whenever dequant data changes.
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!dequantA || !dequantB) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const bins = 50;

    // Compute histograms
    const allValues = [...dequantA, ...dequantB];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    const binWidth = range / bins;

    const histA = new Array(bins).fill(0);
    const histB = new Array(bins).fill(0);

    for (const v of dequantA) {
      const i = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      histA[i]++;
    }
    for (const v of dequantB) {
      const i = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      histB[i]++;
    }

    const maxCount = Math.max(...histA, ...histB, 1);

    ctx.clearRect(0, 0, w, h);

    // Draw bars (File A = blue, File B = red, overlaid semi-transparent).
    const barW = w / bins;
    for (let i = 0; i < bins; i++) {
      const x = i * barW;
      // File B (red) drawn first so it's behind.
      const hB = (histB[i] / maxCount) * (h - 20);
      ctx.fillStyle = "rgba(239, 68, 68, 0.5)";
      ctx.fillRect(x, h - 10 - hB, barW, hB);
      // File A (blue) drawn on top.
      const hA = (histA[i] / maxCount) * (h - 20);
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
      ctx.fillRect(x, h - 10 - hA, barW, hA);
    }

    // Axis labels
    ctx.fillStyle = "#888";
    ctx.font = "10px monospace";
    ctx.fillText(min.toFixed(2), 2, h - 2);
    ctx.fillText(max.toFixed(2), w - 60, h - 2);
  }, [dequantA, dequantB]);

  if (!arch || !arch.tensors.length) return null;
  if (arch.source !== "gguf") return null;

  return (
    <div className="side-section">
      <div className="side-title">
        Compare Quantization
        {compareFile && (
          <button
            className="chip-btn"
            onClick={() => { clearCompare(); }}
            style={{ float: "right", fontSize: "0.7rem" }}
            title="Clear comparison"
          >
            ✕
          </button>
        )}
      </div>

      {!compareFile && (
        <>
          <div
            className="dropzone"
            onClick={() => fileRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".gguf"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="drop-icon">⇄</div>
            <div className="drop-text">
              {compareLoading ? (
                "parsing…"
              ) : (
                <>
                  Drop second <b>.gguf</b> to compare
                  <br />
                  (same model, different quant)
                </>
              )}
            </div>
          </div>
          {compareError && <div className="error">⚠ {compareError}</div>}
        </>
      )}

      {compareFile && compareArch && (
        <div className="drop-note">
          second file: {compareArch.metadata.quantization ?? "unknown"} (
          {compareArch.metadata.name})
        </div>
      )}

      {/* Histogram panel */}
      {compareFile && selectedTensor && dequantLoading && (
        <div className="drop-note">dequantizing…</div>
      )}

      {compareFile && dequantA && dequantB && !dequantLoading && (
        <>
          <canvas
            ref={canvasRef}
            width={260}
            height={120}
            style={{
              width: "100%",
              height: "120px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.2)",
              marginTop: "6px",
            }}
          />
          <div className="histogram-legend">
            <span style={{ color: "rgba(59,130,246,1)" }}>■</span>{" "}
            {arch?.metadata.quantization ?? "file 1"}
            {"  "}
            <span style={{ color: "rgba(239,68,68,1)" }}>■</span>{" "}
            {compareArch?.metadata.quantization ?? "file 2"}
          </div>
          {quantErrorMetric && (
            <div className="drop-note" style={{ marginTop: "4px" }}>
              {quantErrorMetric.name}:{" "}
              <strong>{quantErrorMetric.value.toFixed(6)}</strong>
            </div>
          )}
        </>
      )}

      {compareFile && selectedTensor && !dequantA && !dequantLoading && (
        <div className="drop-note">
          Tensor not found in second file or types differ.
        </div>
      )}

      {/* Hot-spot ranking */}
      {compareFile && (
        <>
          <div className="side-subtitle" style={{ marginTop: "10px" }}>
            Hot Spots
          </div>
          {hotSpotsLoading ? (
            <div className="drop-note">ranking tensors…</div>
          ) : hotSpots.length > 0 ? (
            <div className="hotspot-list">
              {hotSpots.map((hs) => (
                <div
                  key={hs.name}
                  className={`hotspot-item${hs.name === selectedTensor ? " active" : ""}`}
                  onClick={() => setSelectedTensor(hs.name)}
                >
                  <span className="hotspot-rank">#{hs.rank}</span>
                  <span className="hotspot-name">{shortName(hs.name)}</span>
                  <span className="hotspot-score">{hs.score.toFixed(6)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="drop-note">Select a tensor to see comparison.</div>
          )}
        </>
      )}
    </div>
  );
}

function shortName(name: string): string {
  // Trim common prefixes for display
  return name.replace(/^model\.layers\.\d+\./, "L….");
}
