"use client";

import { useState, useCallback } from "react";
import { fetchArchitecture } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function CheckpointLoader() {
  const setArch = useStore((s) => s.setArch);
  const [modelId, setModelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const id = modelId.trim();
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const arch = await fetchArchitecture(id);
      setArch(arch);
    } catch (e: any) {
      setError(e.message ?? "Failed to load checkpoint");
    } finally {
      setLoading(false);
    }
  }, [modelId, setArch]);

  return (
    <div className="side-section">
      <div className="side-title">Load Checkpoint</div>
      <div className="side-note">
        Enter a HuggingFace model ID to inspect its architecture metadata (no weights loaded — instant).
      </div>
      <div className="cp-row">
        <input
          className="cp-input"
          type="text"
          placeholder="HF model ID (e.g. Qwen/Qwen2.5-0.5B)"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button
          className="cp-btn"
          onClick={load}
          disabled={loading || !modelId.trim()}
        >
          {loading ? "…" : "Load"}
        </button>
      </div>
      {error && <div className="error">⚠ {error}</div>}
      <div className="cp-hint">
        Loads config metadata from HuggingFace (no weights).
      </div>
    </div>
  );
}
