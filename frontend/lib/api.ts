import type { AnalyzeResponse, ArchitectureData } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** POST /analyze — returns real tokens + attention from a single forward pass. */
export async function analyzeSentence(
  sentence: string,
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) {
        msg =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      /* non-JSON error body; keep the status message */
    }
    throw new Error(msg);
  }

  return res.json();
}

/** GET /architecture — real model metadata + tensor list (Explorer source). */
export async function fetchArchitecture(): Promise<ArchitectureData> {
  const res = await fetch(`${API_URL}/architecture`);
  if (!res.ok) throw new Error(`Architecture request failed (${res.status})`);
  return res.json();
}
