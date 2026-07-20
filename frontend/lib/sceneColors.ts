import { Color } from "three";

export type OpKind = "embedding" | "norm" | "attn" | "mlp" | "output";

export type RGB = [number, number, number];

/* Per-fine-grained-operation colour map (GenerationScene).
   The single allowed colour axis in the 3D view: component class / depth. */
export const OP_COLORS: Record<string, RGB> = {
  embedding: [0.6, 0.4, 0.95],
  norm: [0.55, 0.6, 0.72],
  "attn.q": [0.3, 0.7, 1],
  "attn.k": [0.3, 0.85, 0.9],
  "attn.v": [0.3, 0.9, 0.6],
  attention: [0.4, 0.8, 1],
  "attn.o": [0.6, 0.7, 1],
  "mlp.gate": [1, 0.72, 0.3],
  "mlp.up": [1, 0.6, 0.3],
  "mlp.down": [0.95, 0.45, 0.5],
  output: [0.9, 0.4, 0.95],
};

/* Per-component-class colour map (WalkthroughScene, TransformerStack fallback). */
export const KIND_COLORS: Record<OpKind, RGB> = {
  norm: [0.55, 0.6, 0.72],
  mlp: [1, 0.6, 0.3],
  output: [0.9, 0.4, 0.95],
  attn: [0.4, 0.8, 1],
  embedding: [0.6, 0.4, 0.95],
};

/* Shared material base tints. */
export const GRAY = new Color(0.44, 0.48, 0.56);
export const DIM = new Color(0.28, 0.31, 0.38);
export const HOVER_GLOW = new Color(1, 1, 1);

/* Lighten a base colour when hovered (but not already active). */
export function hoverColor(base: Color, hovered: boolean, active: boolean): Color {
  if (hovered && !active) return base.clone().lerp(HOVER_GLOW, 0.25);
  return base;
}

/* Resolve an op_key to an RGB triple, falling back to the OpKind default. */
export function opColorOf(opKey: string | undefined, kind: OpKind): RGB {
  if (opKey && OP_COLORS[opKey]) return OP_COLORS[opKey];
  return KIND_COLORS[kind];
}

/* Map a real op_key string to the coarse component class. */
export function opKindOf(opKey: string | undefined): OpKind | null {
  if (!opKey) return null;
  if (opKey === "embedding") return "embedding";
  if (opKey === "output") return "output";
  if (opKey === "attention" || opKey.startsWith("attn")) return "attn";
  if (opKey.startsWith("mlp")) return "mlp";
  if (opKey.startsWith("norm") || opKey === "norm") return "norm";
  return null;
}
