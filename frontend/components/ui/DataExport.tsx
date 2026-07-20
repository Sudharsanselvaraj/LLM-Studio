"use client";

import { useStore } from "@/lib/store";
import { useCallback } from "react";

export default function DataExport() {
  const data = useStore((s) => s.data);

  const downloadJson = useCallback(
    (field: string, obj: unknown) => {
      const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuroscope-${field}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [],
  );

  if (!data) return null;

  return (
    <div className="data-export">
      <div className="dex-title">Export</div>
      <div className="dex-buttons">
        <button
          className="dex-btn"
          onClick={() =>
            downloadJson("attention", {
              tokens: data.tokens.map((t) => t.text),
              attention: data.attention,
            })
          }
        >
          Attention
        </button>
        <button
          className="dex-btn"
          onClick={() => downloadJson("embeddings", data.embeddings_3d)}
        >
          Embeddings
        </button>
        <button
          className="dex-btn"
          onClick={() => downloadJson("hidden-states", data.hidden_states_3d)}
        >
          Hidden States
        </button>
        <button
          className="dex-btn"
          onClick={() => downloadJson("logit-lens", data.logit_lens)}
        >
          Logit Lens
        </button>
      </div>
    </div>
  );
}
