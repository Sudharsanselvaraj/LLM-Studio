"use client";

import { useStore } from "@/lib/store";
import { useMemo } from "react";

interface DiffField {
  key: string;
  label: string;
  a: unknown;
  b: unknown;
  changed: boolean;
}

export default function ConfigDiff() {
  const arch = useStore((s) => s.arch);
  const compare = useStore((s) => s.compareArch);

  const diffs = useMemo(() => {
    if (!arch?.metadata || !compare?.metadata) return null;
    const a = arch.metadata;
    const b = compare.metadata;
    const fields: DiffField[] = [
      { key: "architecture", label: "Architecture", a: a.architecture, b: b.architecture, changed: false },
      { key: "num_layers", label: "Layers", a: a.num_layers, b: b.num_layers, changed: false },
      { key: "hidden_size", label: "Hidden", a: a.hidden_size, b: b.hidden_size, changed: false },
      { key: "num_heads", label: "Heads", a: a.num_heads, b: b.num_heads, changed: false },
      { key: "num_kv_heads", label: "KV Heads", a: a.num_kv_heads, b: b.num_kv_heads, changed: false },
      { key: "head_dim", label: "Head Dim", a: a.head_dim, b: b.head_dim, changed: false },
      { key: "ffn_size", label: "FFN", a: a.ffn_size, b: b.ffn_size, changed: false },
      { key: "vocab_size", label: "Vocab", a: a.vocab_size, b: b.vocab_size, changed: false },
      { key: "context_length", label: "Context", a: a.context_length, b: b.context_length, changed: false },
      { key: "rope_theta", label: "RoPE θ", a: a.rope_theta, b: b.rope_theta, changed: false },
      { key: "tie_word_embeddings", label: "Tie Emb", a: a.tie_word_embeddings, b: b.tie_word_embeddings, changed: false },
      { key: "quantization", label: "Quant", a: a.quantization, b: b.quantization, changed: false },
      { key: "total_params", label: "Params", a: a.total_params, b: b.total_params, changed: false },
      { key: "expert_count", label: "Experts", a: a.expert_count, b: b.expert_count, changed: false },
    ];
    for (const f of fields) {
      f.changed = String(f.a) !== String(f.b);
    }
    return fields;
  }, [arch, compare]);

  if (!diffs) return null;
  const changed = diffs.filter((d) => d.changed);

  return (
    <div className="config-diff">
      <div className="cd-title">Config Diff</div>
      <div className="cd-files">
        <span className="cd-file-a">{arch?.metadata.name}</span>
        <span className="cd-vs">vs</span>
        <span className="cd-file-b">{compare?.metadata.name}</span>
      </div>
      {changed.length === 0 ? (
        <div className="cd-identical">Configs are identical</div>
      ) : (
        <div className="cd-diffs">
          {changed.map((f) => (
            <div key={f.key} className="cd-row">
              <span className="cd-label">{f.label}</span>
              <span className="cd-val-a">{String(f.a)}</span>
              <span className="cd-arrow">→</span>
              <span className="cd-val-b">{String(f.b)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <details className="cd-all">
        <summary>All fields</summary>
        <div className="cd-all-table">
          {diffs.map((f) => (
            <div key={f.key} className={`cd-all-row${f.changed ? " changed" : ""}`}>
              <span className="cd-all-label">{f.label}</span>
              <span className="cd-all-val">{String(f.a)}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
