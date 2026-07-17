"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useStore } from "@/lib/store";
import { waypointFor } from "@/lib/layout";

/**
 * Flies the camera between district waypoints with GSAP. OrbitControls is
 * disabled during a flight so user drag doesn't fight the tween, then re-enabled
 * at the destination (so you can still orbit each district freely).
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const district = useStore((s) => s.currentDistrict);
  const tokenCount = useStore((s) => s.data?.tokens.length ?? 7);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const wp = waypointFor(district, tokenCount);

    // No controls yet (first frame): snap into place.
    if (!controls) {
      camera.position.set(...wp.position);
      camera.lookAt(...wp.target);
      return;
    }

    tweenRef.current?.kill();
    controls.enabled = false;

    const state = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: controls.target.x,
      ty: controls.target.y,
      tz: controls.target.z,
    };

    tweenRef.current = gsap.to(state, {
      duration: 1.5,
      ease: "power2.inOut",
      px: wp.position[0],
      py: wp.position[1],
      pz: wp.position[2],
      tx: wp.target[0],
      ty: wp.target[1],
      tz: wp.target[2],
      onUpdate: () => {
        camera.position.set(state.px, state.py, state.pz);
        controls.target.set(state.tx, state.ty, state.tz);
        controls.update();
      },
      onComplete: () => {
        controls.enabled = true;
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [district, tokenCount, camera, controls]);

  return null;
}
