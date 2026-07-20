"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";

const PROMPTS = [
  "The capital of France is",
  "She walked into the room and",
  "def fib(n):\n    if n <= 1:",
  "Once upon a time there",
  "2 + 2 =",
];

interface Verdict {
  head: number;
  pattern: string;
  induction: boolean;
  score: number;
}

export default function InductionHeadLab() {
  const data = useStore((s) => s.data);
  const [activePrompt, setActivePrompt] = useState(PROMPTS[0]);

  // Run a simplified induction-head detection on layer 0 fingerprints.
  // Induction heads: head that attends to token B at position i+1 when
  // token A attended to token B at position i (the "copy" pattern).
  const verdicts: Verdict[] = useMemo(() => {
    if (!data?.attention?.[0]) return [];
    const layer0 = data.attention[0];
    const nh = layer0.length;
    const verdicts: Verdict[] = [];

    for (let h = 0; h < nh; h++) {
      const attn = layer0[h];
      let inductionScore = 0;
      let count = 0;

      // Look for induction pattern: attn[i][j] > threshold and attn[i+1][j+1] > threshold
      for (let i = 0; i < attn.length - 1; i++) {
        for (let j = 0; j < attn[i].length - 1; j++) {
          if (attn[i][j] > 0.3 && attn[i + 1][j + 1] > 0.3) {
            inductionScore++;
          }
          count++;
        }
      }

      const normScore = count > 0 ? inductionScore / count : 0;

      // Determine pattern label
      let pattern = "uniform";
      if (normScore > 0.15) pattern = "induction";
      else if (normScore > 0.06) pattern = "partial-induction";

      verdicts.push({
        head: h,
        pattern,
        induction: normScore > 0.1,
        score: normScore * 100,
      });
    }

    return verdicts.sort((a, b) => b.score - a.score);
  }, [data]);

  if (!data?.attention?.length) {
    return (
      <div className="induction-lab">
        <div className="il-title">Induction-Head Lab</div>
        <div className="il-empty">Run an analysis first to detect induction heads.</div>
      </div>
    );
  }

  const inductHeads = verdicts.filter((v) => v.induction);

  return (
    <div className="induction-lab">
      <div className="il-title">Induction-Head Lab</div>
      <div className="il-desc">
        Detects heads that attend to B→A then A→B across adjacent positions.
        {inductHeads.length > 0
          ? ` Found ${inductHeads.length} probable induction head${inductHeads.length > 1 ? "s" : ""}.`
          : " No strong induction heads detected."}
      </div>

      <div className="il-prompts">
        <span className="il-prompt-label">Prompt:</span>
        {PROMPTS.map((p) => (
          <button
            key={p}
            className={"il-prompt" + (p === activePrompt ? " active" : "")}
            onClick={() => setActivePrompt(p)}
          >
            {p.length > 20 ? p.slice(0, 20) + "…" : p}
          </button>
        ))}
      </div>

      <div className="il-verdicts">
        {verdicts.slice(0, 14).map((v) => (
          <div
            key={v.head}
            className={"il-row" + (v.induction ? " induction" : "")}
            title={`Head ${v.head}: ${v.pattern} (score ${v.score.toFixed(1)})`}
          >
            <span className="il-head">H{v.head}</span>
            <div className="il-bar-track">
              <div className="il-bar" style={{ width: `${v.score}%` }} />
            </div>
            <span className="il-verdict">{v.pattern}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
