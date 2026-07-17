"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function Formula({ latex }: { latex: string }) {
  const html = useMemo(
    () => katex.renderToString(latex, { displayMode: true, throwOnError: false }),
    [latex],
  );
  return <div className="formula" dangerouslySetInnerHTML={{ __html: html }} />;
}
