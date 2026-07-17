"use client";

import dynamic from "next/dynamic";

// The R3F <Canvas> touches WebGL / `window` and cannot be server-rendered.
// `ssr: false` is only allowed inside a Client Component, which is exactly
// what this wrapper is — it's the SSR boundary for the whole 3D scene.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

export default function SceneLoader() {
  return <Scene />;
}
