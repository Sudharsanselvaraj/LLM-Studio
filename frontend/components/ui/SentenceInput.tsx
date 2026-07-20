"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PRESET_PROMPTS } from "@/lib/prompts";

const DEFAULT_SENTENCE = PRESET_PROMPTS[0].text;

export default function SentenceInput() {
  const [text, setText] = useState(DEFAULT_SENTENCE);
  const analyze = useStore((s) => s.analyze);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);

  // Run once on mount so the scene isn't empty on first load.
  useEffect(() => {
    analyze(DEFAULT_SENTENCE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length > 0 && !loading) analyze(trimmed);
  };

  const pick = (s: string) => {
    setText(s);
    if (!loading) analyze(s);
  };

  return (
    <div>
      <form className="sentence-form" onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a sentence (≤ ~40 tokens)…"
          spellCheck={false}
        />
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>
      <div className="sentence-presets">
        {PRESET_PROMPTS.map((p) => (
          <button
            key={p.label}
            className="chip-btn preset-chip"
            onClick={() => pick(p.text)}
            title={p.note}
          >
            {p.label}
          </button>
        ))}
      </div>
      {error && <div className="error">⚠ {error}</div>}
    </div>
  );
}
