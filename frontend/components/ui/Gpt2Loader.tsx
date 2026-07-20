"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function Gpt2Loader() {
  const loadGgufFile = useStore((s) => s.loadGgufFile);
  const arch = useStore((s) => s.arch);
  const archLoading = useStore((s) => s.archLoading);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await loadGgufFile(file);
  };

  const isGpt2 = arch?.metadata?.architecture?.toLowerCase().includes("gpt2");

  return (
    <div className="gpt2-loader">
      <div className="gl-title">Local Checkpoint Loader</div>
      <div className="gl-desc">
        Drag & drop a GGUF file (GPT-2, Qwen, Llama, or any supported model) to inspect its architecture locally.
      </div>

      <div
        className={"gl-dropzone" + (dragOver ? " drag-over" : "")}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {archLoading ? (
          <span className="gl-loading">Parsing GGUF…</span>
        ) : arch ? (
          <div className="gl-loaded">
            <div className="gl-model-name">{arch.metadata.name}</div>
            <div className="gl-model-arch">{arch.metadata.architecture}</div>
            <div className="gl-model-meta">
              {arch.metadata.total_params.toLocaleString()} params · {arch.tensor_count} tensors
              {arch.metadata.quantization && ` · ${arch.metadata.quantization}`}
            </div>
            {isGpt2 && (
              <div className="gl-badge">GPT-2 compatible</div>
            )}
          </div>
        ) : (
          <span className="gl-placeholder">
            Drop a .gguf file here, or use the Explorer panel to load one
          </span>
        )}
      </div>
    </div>
  );
}
