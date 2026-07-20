"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";

interface Entry {
  type: "input" | "output" | "error";
  text: string;
}

export default function ConsoleRepl() {
  const [entries, setEntries] = useState<Entry[]>([
    { type: "output", text: "// Debug REPL — type JS expressions against the store." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const evalExpr = (code: string) => {
    try {
      const store = useStore.getState();
      const result = new Function("store", `with(store) { return (${code}); }`)(store);
      const text = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      setEntries((prev) => [
        ...prev,
        { type: "input", text: `> ${code}` },
        { type: "output", text },
      ]);
    } catch (e) {
      setEntries((prev) => [
        ...prev,
        { type: "input", text: `> ${code}` },
        { type: "error", text: String(e) },
      ]);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) evalExpr(input.trim());
      setInput("");
    }
  };

  return (
    <div className="console-repl">
      <div className="cr-title">Console REPL</div>
      <div className="cr-entries">
        {entries.map((e, i) => (
          <div key={i} className={"cr-entry cr-" + e.type}>
            <pre>{e.text}</pre>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="cr-input-row">
        <span className="cr-prompt">&gt;</span>
        <textarea
          className="cr-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="store.opIndex, genFrames.length, ..."
        />
      </div>
    </div>
  );
}
