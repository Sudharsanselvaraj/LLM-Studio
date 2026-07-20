"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";

export default function ModelLoader() {
  const loadGguf = useStore((s) => s.loadGgufFile);
  const loadTrace = useStore((s) => s.loadTrace);
  const loadArch = useStore((s) => s.loadArchitecture);
  const source = useStore((s) => s.arch?.source);
  const loading = useStore((s) => s.archLoading);
  const err = useStore((s) => s.archError);
  const genStatus = useStore((s) => s.genStatus);
  const traceSource = useStore((s) => s.traceSource);
  const [drag, setDrag] = useState(false);

  const ggufRef = useRef<HTMLInputElement>(null);
  const traceRef = useRef<HTMLInputElement>(null);

  const onGgufFile = (f?: File | null) => {
    if (f) loadGguf(f);
  };

  const onTraceFile = (f?: File | null) => {
    if (f) loadTrace(f);
  };

  return (
    <div className="side-section">
      <div className="side-title">Load Model</div>
      <div className="side-note">
        Drop a GGUF file to inspect its architecture, or replay a recorded trace.
      </div>
      <div
        className={"dropzone" + (drag ? " drag" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file?.name.endsWith(".json")) {
            onTraceFile(file);
          } else {
            onGgufFile(file);
          }
        }}
        onClick={() => ggufRef.current?.click()}
      >
        <input
          ref={ggufRef}
          type="file"
          accept=".gguf"
          hidden
          onChange={(e) => onGgufFile(e.target.files?.[0])}
        />
        <div className="drop-icon">◇</div>
        <div className="drop-text">
          {loading ? (
            "parsing…"
          ) : (
            <>
              Drop <b>.gguf</b> or <b>.json</b> trace here
              <br />
              or click to browse
            </>
          )}
        </div>
      </div>
      <div className="side-row">
        <button className="chip-btn" onClick={() => loadArch()}>
          Use live Qwen model
        </button>
        <button
          className="chip-btn"
          onClick={() => traceRef.current?.click()}
          title="Load a recorded trace file"
        >
          Load trace
        </button>
        <input
          ref={traceRef}
          type="file"
          accept=".json"
          hidden
          onChange={(e) => onTraceFile(e.target.files?.[0])}
        />
      </div>
      {source && (
        <div className="drop-note">
          source: {source === "gguf" ? "parsed GGUF file" : "live model (real forward pass)"}
        </div>
      )}
      {traceSource === "file" && genStatus === "done" && (
        <div className="drop-note">
          replaying recorded trace
        </div>
      )}
      {err && <div className="error">⚠ {err}</div>}
    </div>
  );
}
