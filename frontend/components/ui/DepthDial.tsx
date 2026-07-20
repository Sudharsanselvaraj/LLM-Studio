"use client";

import { useStore } from "@/lib/store";

export default function DepthDial() {
  const genMeta = useStore((s) => s.genMeta);
  const playIndex = useStore((s) => s.playIndex);
  const opIndex = useStore((s) => s.opIndex);
  const setPlayIndex = useStore((s) => s.setPlayIndex);
  const setOpIndex = useStore((s) => s.setOpIndex);

  const maxToken = (genMeta?.max_new_tokens ?? 1) - 1;
  const maxOp = (genMeta?.op_catalog?.length ?? 1) - 1;

  if (maxToken < 0 && maxOp < 0) return null;

  return (
    <div className="depth-dial">
      <div className="dd-title">Depth Dial</div>
      <div className="dd-desc">Navigate the generation depth at the token or op level.</div>

      <div className="dd-control">
        <span className="dd-label">Token</span>
        <input
          type="range"
          min={0}
          max={maxToken}
          value={Math.min(playIndex, maxToken)}
          onChange={(e) => setPlayIndex(Number(e.target.value))}
        />
        <span className="dd-value">{playIndex + 1}/{maxToken + 1}</span>
      </div>

      <div className="dd-control">
        <span className="dd-label">Op</span>
        <input
          type="range"
          min={0}
          max={maxOp}
          value={Math.min(opIndex, maxOp)}
          onChange={(e) => setOpIndex(Number(e.target.value))}
        />
        <span className="dd-value">{opIndex + 1}/{maxOp + 1}</span>
      </div>
    </div>
  );
}
