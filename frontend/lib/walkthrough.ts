import type { AnalyzeResponse } from "./types";

// Chaptered walkthrough. Each chapter's body is built from a REAL forward pass
// (the /analyze response) so every number shown is genuine, and each chapter
// drives which 3D visual is shown (lockstep).

export type SceneKey =
  | "overview"
  | "tokenizer"
  | "embedding"
  | "norm"
  | "attention"
  | "mlp"
  | "softmax";

export interface Chapter {
  id: string;
  title: string;
  scene: SceneKey;
  build: (d: AnalyzeResponse | null) => string[];
}

const tokList = (d: AnalyzeResponse | null) =>
  d ? d.tokens.map((t) => t.text.trim() || "␣").join(" · ") : "…";

// Find the strongest off-diagonal attention in layer 0, head 0 for a real example.
function topAttention(d: AnalyzeResponse | null): string {
  if (!d) return "…";
  const mat = d.attention?.[0]?.[0];
  if (!mat) return "…";
  let best = { from: 0, to: 0, w: 0 };
  for (let f = 0; f < mat.length; f++)
    for (let t = 0; t < f; t++)
      if (mat[f][t] > best.w) best = { from: f, to: t, w: mat[f][t] };
  const F = d.tokens[best.from]?.text.trim() || "?";
  const T = d.tokens[best.to]?.text.trim() || "?";
  return `“${F}” → “${T}” with weight ${best.w.toFixed(3)}`;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "overview",
    title: "Overview",
    scene: "overview",
    build: (d) => [
      `This walkthrough runs one real sentence through the loaded model — ${d?.model ?? "the model"} — and reads genuine numbers at every stage. Nothing here is illustrative; it all comes from a real forward pass.`,
      `The example sentence is “${d?.sentence ?? "…"}”. Its goal at each position is to predict the next token.`,
    ],
  },
  {
    id: "tokenizer",
    title: "Tokenization",
    scene: "tokenizer",
    build: (d) => [
      `First the string is split into tokens — the model never sees letters, only integer ids from its vocabulary.`,
      `“${d?.sentence ?? "…"}” becomes ${d?.tokens.length ?? "…"} real tokens:`,
      tokList(d),
      `Each token also carries a vocabulary id (e.g. “${d?.tokens[0]?.text.trim() ?? "?"}” = #${d?.tokens[0]?.id ?? "?"}).`,
    ],
  },
  {
    id: "embedding",
    title: "Embedding",
    scene: "embedding",
    build: (d) => [
      `Each token id is looked up in the embedding table and becomes a vector of ${d?.hidden_size ?? "…"} numbers. Similar tokens get similar vectors, so meaning becomes geometry.`,
      `We can't draw ${d?.hidden_size ?? "…"} dimensions, so these are projected to 3D with PCA (a faithful shadow — distances are approximate). Scrub the layer slider to watch them move.`,
    ],
  },
  {
    id: "norm",
    title: "Layer Norm",
    scene: "norm",
    build: (d) => [
      `Before each attention and MLP block, the vector is normalized. This model (Qwen) uses RMSNorm: divide by the root-mean-square of its components and scale by a learned gain γ.`,
      `The residual stream flows straight down all ${d?.num_layers ?? "…"} layers; each block reads a normalized copy and adds its result back.`,
    ],
  },
  {
    id: "attention",
    title: "Self-Attention",
    scene: "attention",
    build: (d) => [
      `In each layer, every token looks back at earlier tokens and mixes in their values, weighted by a softmax over query·key scores.`,
      `A real example — the strongest connection in layer 0, head 0 of this sentence: ${topAttention(d)}.`,
      `There are ${d?.num_heads ?? "…"} heads per layer, each attending differently.`,
    ],
  },
  {
    id: "mlp",
    title: "MLP",
    scene: "mlp",
    build: () => [
      `After attention, each position passes through a feed-forward MLP independently. This model uses a SwiGLU MLP: a gated projection up to a wider hidden size, then back down.`,
      `Attention moves information between tokens; the MLP transforms it within each token. Together they make one transformer block.`,
    ],
  },
  {
    id: "softmax",
    title: "Softmax & Output",
    scene: "softmax",
    build: (d) => [
      `After the final layer norm, the vector is multiplied by the unembedding matrix to produce one logit per vocabulary entry (${d?.hidden_size ?? "…"} → vocab).`,
      `Softmax turns those logits into probabilities that sum to 1 — the model's prediction for the next token. Greedy decoding picks the largest.`,
    ],
  },
];

// A few real reference model sizes, for the "scale" selector. Param counts are
// the real published sizes; the loaded model drives all worked numbers.
export const REF_MODELS: { id: string; label: string; params: number; layers: number }[] =
  [
    { id: "nano", label: "nano-gpt", params: 85_584, layers: 3 },
    { id: "gpt2", label: "GPT-2 (small)", params: 124_439_808, layers: 12 },
    { id: "qwen05", label: "Qwen2.5-0.5B", params: 494_032_768, layers: 24 },
    { id: "gpt2xl", label: "GPT-2 XL", params: 1_557_611_200, layers: 48 },
  ];
