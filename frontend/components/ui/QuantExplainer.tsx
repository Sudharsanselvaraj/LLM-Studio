"use client";

import { useStore } from "@/lib/store";

export default function QuantExplainer() {
  const arch = useStore((s) => s.arch);
  const compareArch = useStore((s) => s.compareArch);
  const quant = arch?.metadata?.quantization;

  if (!quant) return null;

  const isQ4K = quant.startsWith("Q4_K");
  const blockSize = isQ4K ? 256 : 32;
  const bitWidth = quant.includes("Q8") ? 8 : quant.includes("Q5") ? 5 : quant.includes("Q4") ? 4 : quant.includes("Q3") ? 3 : quant.includes("Q2") ? 2 : 16;

  return (
    <div className="quant-explainer">
      <div className="qe-title">Quantization: {quant}</div>
      <div className="qe-desc">
        {isQ4K
          ? `Q4_K stores ${blockSize} weights in a super-block with shared scales.`
          : `${bitWidth}-bit block quantization (block size ${blockSize}).`}
      </div>

      {/* Q4_K block structure diagram */}
      <div className="qe-block">
        <div className="qe-block-title">Block structure ({blockSize} weights)</div>
        <svg viewBox="0 0 320 140" className="qe-svg">
          {/* d scale (f16) */}
          <rect x="4" y="8" width="36" height="28" rx="4" fill="#3a5a7a" />
          <text x="22" y="26" textAnchor="middle" fill="#fff" fontSize="9">d (f16)</text>

          {/* m min (f16) */}
          <rect x="44" y="8" width="36" height="28" rx="4" fill="#3a5a7a" />
          <text x="62" y="26" textAnchor="middle" fill="#fff" fontSize="9">m (f16)</text>

          {/* Nibble data */}
          <rect x="84" y="8" width="100" height="28" rx="4" fill={isQ4K ? "#5a5a3a" : "#4a4a4a"} />
          <text x="134" y="26" textAnchor="middle" fill="#fff" fontSize="9">{blockSize} nibbles</text>

          {/* Sub-block scales */}
          {isQ4K && (
            <>
              <rect x="188" y="8" width="60" height="28" rx="4" fill="#5a3a5a" />
              <text x="218" y="26" textAnchor="middle" fill="#fff" fontSize="9">16 sub-scales</text>

              {/* Annotations */}
              <text x="22" y="58" textAnchor="middle" fill="#8af" fontSize="8">global scale</text>
              <line x1="22" y1="52" x2="22" y2="38" stroke="#8af" strokeWidth="1" />
              <text x="62" y="58" textAnchor="middle" fill="#8af" fontSize="8">global min</text>
              <line x1="62" y1="52" x2="62" y2="38" stroke="#8af" strokeWidth="1" />
              <text x="218" y="58" textAnchor="middle" fill="#c8a" fontSize="8">per-sub-block</text>
              <line x1="218" y1="52" x2="218" y2="38" stroke="#c8a" strokeWidth="1" />
            </>
          )}
        </svg>
      </div>

      <div className="qe-formula">
        <code>dequant = (d + s[i]) × (nibble − 8) + m</code>
      </div>

      {/* Dual-model comparison */}
      {compareArch && (
        <div className="qe-compare">
          <div className="qe-compare-row">
            <span className="qe-clabel">Loaded:</span>
            <span className="qe-cval">{arch.metadata.quantization ?? "float"}</span>
          </div>
          <div className="qe-compare-row">
            <span className="qe-clabel">Compared:</span>
            <span className="qe-cval">{compareArch.metadata.quantization ?? "float"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
