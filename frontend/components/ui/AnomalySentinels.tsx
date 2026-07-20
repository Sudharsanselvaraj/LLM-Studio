"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function AnomalySentinels() {
  const scores = useStore((s) => s.sentinelScores);
  const computeSentinels = useStore((s) => s.computeSentinels);
  const frames = useStore((s) => s.genFrames);

  useEffect(() => {
    if (frames.length >= 3) computeSentinels();
  }, [frames.length, computeSentinels]);

  if (!scores.length) return null;

  const maxScore = Math.max(...scores.map((s) => s.score), 1);
  const threshold = maxScore * 0.5;

  return (
    <div className="anomaly-sentinels">
      <div className="as-title">Anomaly Sentinels</div>
      <div className="as-list">
        {scores.map((s) => {
          const pct = (s.score / maxScore) * 100;
          const isHigh = s.score >= threshold;
          return (
            <div key={s.layer} className={"as-row" + (isHigh ? " high" : "")}>
              <span className="as-layer">L{s.layer}</span>
              <div className="as-bar-track">
                <div
                  className={"as-bar" + (isHigh ? " high" : "")}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="as-reason">{s.reason}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
