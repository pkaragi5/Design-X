import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";

export const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for premium feel
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  const background = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(350px at ${x}px ${y}px, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(139, 92, 246, 0.6) 15%, 
      rgba(76, 29, 149, 0.4) 40%, 
      rgba(30, 58, 138, 0.2) 70%, 
      transparent 100%)`
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
};
