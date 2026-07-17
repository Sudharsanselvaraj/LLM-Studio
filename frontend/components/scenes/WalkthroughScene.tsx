"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color } from "three";

import { useStore } from "@/lib/store";
import { CHAPTERS, REF_MODELS } from "@/lib/walkthrough";
import TokenizerDistrict from "../districts/TokenizerDistrict";
import EmbeddingDistrict from "../districts/EmbeddingDistrict";
import AttentionDistrict from "../districts/AttentionDistrict";

function Tower({
  n,
  highlight,
}: {
  n: number;
  highlight: "top" | "mid" | "bottom" | "all";
}) {
  const count = Math.min(48, Math.max(2, n));
  const mid = Math.floor(count / 2);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const active =
          highlight === "all" ||
          (highlight === "top" && i === 0) ||
          (highlight === "bottom" && i === count - 1) ||
          (highlight === "mid" && i === mid);
        const c = active
          ? new Color(0.4, 0.8, 1)
          : new Color(0.42, 0.46, 0.54);
        return (
          <mesh key={i} position={[0, -(i - count / 2) * 1.2, 0]}>
            <boxGeometry args={[7, 0.62, 7]} />
            <meshStandardMaterial
              color={c}
              emissive={c}
              emissiveIntensity={active ? 1.5 : 0.06}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function WalkthroughScene() {
  const chapterIdx = useStore((s) => s.wtChapter);
  const wtModel = useStore((s) => s.wtModel);
  const ch = CHAPTERS[Math.min(chapterIdx, CHAPTERS.length - 1)];
  const layers =
    REF_MODELS.find((m) => m.id === wtModel)?.layers ?? 24;
  const { camera } = useThree();

  useEffect(() => {
    const framings: Record<string, [number, number, number]> = {
      overview: [14, 4, 26],
      tokenizer: [0, 2, 18],
      embedding: [0, 3, 28],
      norm: [12, 2, 20],
      attention: [0, 1, 24],
      mlp: [12, 2, 20],
      softmax: [10, -6, 20],
    };
    const p = framings[ch.scene] ?? [0, 0, 24];
    camera.position.set(p[0], p[1], p[2]);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [ch.scene, camera]);

  switch (ch.scene) {
    case "tokenizer":
      return <TokenizerDistrict />;
    case "embedding":
      return <EmbeddingDistrict />;
    case "attention":
      return <AttentionDistrict />;
    case "norm":
      return <Tower n={layers} highlight="mid" />;
    case "mlp":
      return <Tower n={layers} highlight="mid" />;
    case "softmax":
      return <Tower n={layers} highlight="bottom" />;
    default:
      return <Tower n={layers} highlight="all" />;
  }
}
