"use client";

import { useStore } from "@/lib/store";
import { fmtBytes, fmtCount } from "@/lib/format";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="astat">
      <div className="astat-label">{label}</div>
      <div className="astat-value">{value ?? "—"}</div>
    </div>
  );
}

export default function ArchitecturePanel() {
  const arch = useStore((s) => s.arch);
  const m = arch?.metadata;
  if (!m) return null;

  // Show only GGUF-specific info that isn't duplicated in the right panel.
  const isGguf = arch?.source === "gguf";
  const extras: { label: string; value: React.ReactNode }[] = [];
  if (isGguf) {
    extras.push(
      { label: "Quantization", value: m.quantization },
      { label: "File Size", value: fmtBytes(m.file_size) },
    );
  }
  if (m.gguf_version != null) extras.push({ label: "GGUF Version", value: `v${m.gguf_version}` });
  if (m.expert_count != null) {
    extras.push({ label: "Experts", value: m.expert_count });
    extras.push({ label: "Active Experts", value: m.expert_used_count });
  }
  if (m.rope_theta != null) extras.push({ label: "RoPE Base", value: fmtCount(m.rope_theta) });
  if (extras.length === 0) return null;

  return (
    <div className="side-section">
      <div className="side-title">Model Source</div>
      <div className="astat-grid">
        {extras.map((e) => (
          <Stat key={e.label} label={e.label} value={e.value} />
        ))}
      </div>
    </div>
  );
}
