import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadHyperspacePreset } from "@tsparticles/preset-hyperspace";

export default function ThreeDParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadHyperspacePreset(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        preset: "hyperspace",
        fullScreen: { enable: true, zIndex: 0 },
        background: {
          color: "#0b001a", // nền tối kiểu không gian vũ trụ
        },
      }}
    />
  );
}
