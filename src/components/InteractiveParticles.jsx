import React from "react";
import Particles from "react-tsparticles";

export default function InteractiveParticles() {
  return (
    <Particles
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#fce3ec" },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["grab", "repulse"],
              parallax: { enable: true, force: 40, smooth: 10 },
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.5 } },
            repulse: { distance: 100 },
            push: { quantity: 4 },
          },
        },
        particles: {
          color: { value: "#ff69b4" },
          links: {
            enable: true,
            distance: 150,
            color: "#ff69b4",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: { default: "bounce" },
          },
          number: { value: 30 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: 4, random: true },
        },
        detectRetina: true,
      }}
    />
  );
}
