"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

interface Node {
  id: string;
  label: string;
  type: "input" | "embed" | "block" | "output";
  layer?: number;
}

const NODE_H = 24;
const NODE_GAP = 4;
const GROUP_PAD = 8;

export default function TopologyView() {
  const arch = useStore((s) => s.arch);
  const [expanded, setExpanded] = useState(false);

  if (!arch) return null;
  const nLayers = arch.metadata?.num_layers ?? 0;

  // Build a compact node list.
  const nodes: Node[] = [
    { id: "input", label: "Input", type: "input" },
    { id: "embed", label: "Embed", type: "embed" },
  ];
  // Show first 3 layers + "…" if collapsed, all if expanded.
  const showLayers = expanded ? nLayers : Math.min(3, nLayers);
  for (let i = 0; i < showLayers; i++) {
    nodes.push({ id: `attn-${i}`, label: `Attn`, type: "block", layer: i });
    nodes.push({ id: `mlp-${i}`, label: `MLP`, type: "block", layer: i });
  }
  nodes.push({ id: "output", label: "Output", type: "output" });

  const svgH = nodes.length * (NODE_H + NODE_GAP) + NODE_GAP + GROUP_PAD;

  return (
    <div className="topo-panel">
      <div className="side-title">Architecture Topology</div>
      <svg
        viewBox={`0 0 220 ${svgH}`}
        className="topo-svg"
        style={{ maxHeight: 320 }}
      >
        {/* Background */}
        <rect x={0} y={0} width={220} height={svgH} rx={8} fill="rgba(255,255,255,0.03)" />

        {/* Layer group backgrounds */}
        {nodes
          .filter((n) => n.type === "block")
          .map((n, i, arr) => {
            const idx = Math.floor(i / 2);
            const y = NODE_GAP + idx * (NODE_H + NODE_GAP) + (i % 2 === 0 ? 0 : NODE_H + NODE_GAP / 2);
            if (i % 2 !== 0) return null;
            return (
              <rect
                key={`bg-${n.layer}`}
                x={4}
                y={y - 2}
                width={212}
                height={NODE_H * 2 + NODE_GAP + 2}
                rx={6}
                fill="rgba(255,255,255,0.03)"
              />
            );
          })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          let color = "rgba(255,255,255,0.15)";
          if (n.type === "input") color = "hsl(220 85% 60%)";
          else if (n.type === "embed") color = "hsl(190 85% 60%)";
          else if (n.type === "output") color = "hsl(40 85% 60%)";

          const y = NODE_GAP + i * (NODE_H + NODE_GAP);
          return (
            <g key={n.id}>
              {/* Edge from previous */}
              {i > 0 && (
                <line
                  x1={110} y1={y - NODE_GAP - 2}
                  x2={110} y2={y + 2}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1.5}
                  strokeDasharray={n.type === "output" ? "3 2" : undefined}
                />
              )}
              {/* Node rect */}
              <rect
                x={110 - 80} y={y}
                width={160} height={NODE_H}
                rx={6}
                fill={color}
                opacity={0.25}
                stroke={color}
                strokeWidth={1}
              />
              <text
                x={110} y={y + NODE_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text)"
                fontSize={10}
                fontFamily="var(--mono)"
              >
                {n.label}{n.layer != null ? ` L${n.layer}` : ""}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Collapse/expand */}
      {nLayers > 3 && (
        <button className="chip-btn" onClick={() => setExpanded(!expanded)} style={{ width: "100%", marginTop: 4 }}>
          {expanded ? "Collapse" : `+${nLayers - 3} more layers`}
        </button>
      )}
    </div>
  );
}
