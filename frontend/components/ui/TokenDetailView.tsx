"use client";

import { useStore } from "@/lib/store";

export default function TokenDetailView() {
  const data = useStore((s) => s.data);

  if (!data?.tokens) return null;

  return (
    <div className="token-detail-panel">
      <div className="tdv-title">Tokenization Detail</div>
      <div className="tdv-subtitle">
        Byte-level BPE pieces for the input sentence
      </div>
      <div className="tdv-list">
        {data.tokens.map((t) => (
          <div key={t.index} className="tdv-row">
            <span className="tdv-idx">{t.index}</span>
            <span className="tdv-text" title={`ID: ${t.id}`}>
              {t.text || "(space)"}
            </span>
            <span className="tdv-piece" title="Raw tokenizer piece">
              {t.piece}
            </span>
            <span className="tdv-id">{t.id}</span>
            {t.is_special && <span className="tdv-special">special</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
