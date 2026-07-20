"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function WatchPanel() {
  const watches = useStore((s) => s.watches);
  const addWatch = useStore((s) => s.addWatch);
  const removeWatch = useStore((s) => s.removeWatch);
  const evalWatches = useStore((s) => s.evalWatches);
  const [label, setLabel] = useState("");
  const [expr, setExpr] = useState("");

  const add = () => {
    if (!label.trim() || !expr.trim()) return;
    addWatch(label.trim(), expr.trim());
    setLabel("");
    setExpr("");
  };

  const disp = (v: unknown): string => {
    if (v === undefined) return "—";
    if (typeof v === "number") return v.toFixed(6);
    if (typeof v === "string") return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  };

  return (
    <div className="watch-panel">
      <div className="wp-title">
        Watch Expressions
        {watches.length > 0 && (
          <button className="wp-eval-btn" onClick={evalWatches}>⟳</button>
        )}
      </div>
      <div className="wp-add">
        <input
          className="wp-input"
          placeholder="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <input
          className="wp-input wp-expr"
          placeholder="expression (e.g. playIndex, opIndex, genFrames.length)"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="wp-add-btn" onClick={add}>+</button>
      </div>
      {watches.length > 0 && (
        <div className="wp-list">
          {watches.map((w) => (
            <div key={w.label} className="wp-row">
              <span className="wp-label">{w.label}</span>
              <span className="wp-expr-display">{w.expr}</span>
              <span className="wp-value">{disp(w.value)}</span>
              <button className="wp-rm" onClick={() => removeWatch(w.label)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
