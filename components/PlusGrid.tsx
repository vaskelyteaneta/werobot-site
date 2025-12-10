"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function PlusGrid() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Create multiple black plus signs that will move across the screen
    const count = 30; // Number of plus signs
    const plusElements: HTMLDivElement[] = [];

    // Create plus sign elements
    for (let i = 0; i < count; i++) {
      const plus = document.createElement("div");
      plus.textContent = "+";
      plus.style.position = "absolute";
      plus.style.color = "#000000"; // Black color
      plus.style.fontSize = `${18 + Math.random() * 12}px`; // 18-30px
      plus.style.fontFamily = "monospace";
      plus.style.opacity = "0.15"; // Very subtle black
      plus.style.fontWeight = "300";
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      plus.style.left = `${startX}px`;
      plus.style.top = `${startY}px`;
      
      containerRef.current.appendChild(plus);
      plusElements.push(plus);

      // Animate each plus sign moving across the screen
      const duration = 25 + Math.random() * 25; // 25-50 seconds for slow movement
      const delay = Math.random() * 3;
      
      // Random end position (moving across screen)
      const endX = startX + (Math.random() - 0.5) * window.innerWidth * 1.5;
      const endY = startY + (Math.random() - 0.5) * window.innerHeight * 1.5;
      
      // Create animation
      const animation = gsap.to(plus, {
        x: endX - startX,
        y: endY - startY,
        duration: duration,
        delay: delay,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          // Reset position when it completes a cycle
          const newX = Math.random() * window.innerWidth;
          const newY = Math.random() * window.innerHeight;
          gsap.set(plus, { x: 0, y: 0 });
          plus.style.left = `${newX}px`;
          plus.style.top = `${newY}px`;
          // Update animation target
          const newEndX = newX + (Math.random() - 0.5) * window.innerWidth * 1.5;
          const newEndY = newY + (Math.random() - 0.5) * window.innerHeight * 1.5;
          animation.vars.x = newEndX - newX;
          animation.vars.y = newEndY - newY;
        },
      });

      // Subtle fade in/out effect
      gsap.to(plus, {
        opacity: 0.1 + Math.random() * 0.1, // 0.1-0.2 opacity range
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      });
    }

    return () => {
      plusElements.forEach((el) => {
        gsap.killTweensOf(el);
        el.remove();
      });
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0, // Behind content but above background
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}

