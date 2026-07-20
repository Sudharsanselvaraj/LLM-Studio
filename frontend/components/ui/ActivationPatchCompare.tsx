"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";

export default function ActivationPatchCompare() {
  const data = useStore((s) => s.data);

  // Extract the real prediction trajectory from logit_lens.
  // Each layer's logit_lens shows what the model predicts if it stopped at that depth.
  const trajectory = useMemo(() => {
    if (!data?.logit_lens?.length) return null;

    const nLayers = data.logit_lens.length;
    const lastPos = data.logit_lens[0].length - 1;

    const layers: { layer: number; token: string; prob: number; tokenId: number }[] = [];

    for (let l = 0; l < nLayers; l++) {
      const top = data.logit_lens[l][lastPos]?.[0];
      if (!top) continue;
      layers.push({
        layer: l,
        token: top.text,
        prob: top.prob,
        tokenId: top.token_id,
      });
    }

    return layers;
  }, [data]);

  if (!data) {
    return (
      <div className="act-patch">
        <div className="ap-title">Activation Patching</div>
        <div className="ap-empty">
          Run an analysis first to see the prediction trajectory.
        </div>
      </div>
    );
  }

  return (
    <div className="act-patch">
      <div className="ap-title">Activation Patching</div>
      <div className="ap-desc">
        Real logit-lens trajectory: what the model predicts at each layer if it stopped there.
        A true activation-patching experiment (replacing activations from a corrupted prompt)
        requires two forward passes and is not available in the current session.
      </div>

      {trajectory && trajectory.length > 0 ? (
        <div className="ap-chart">
          <div className="ap-chart-title">
            Prediction trajectory by layer (position {data.tokens.length - 1})
          </div>
          {trajectory.map((t) => (
            <div key={t.layer} className="ap-row">
              <span className="ap-layer">L{t.layer}</span>
              <span className="ap-token-text">{t.token}</span>
              <div className="ap-bar-track">
                <div
                  className="ap-bar"
                  style={{ width: `${Math.max(t.prob * 100, 1)}%` }}
                />
              </div>
              <span className="ap-prob">{(t.prob * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="ap-hint">
          No logit_lens data in the analysis response.
        </div>
      )}
    </div>
  );
}
