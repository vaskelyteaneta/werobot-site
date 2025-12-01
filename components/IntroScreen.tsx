"use client";

import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Auto-fade after 3 seconds
    const timer = setTimeout(() => {
      if (isVisible) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500); // Wait for animation to complete
      }
    }, 3000);

    // Handle scroll
    const handleScroll = () => {
      if (isVisible && window.scrollY > 10) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    };

    // Handle click/touch
    const handleInteraction = () => {
      if (isVisible) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#F6FF75", // light yellow/lime
      }}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500);
      }}
    >
      <h1
        className="text-6xl md:text-8xl font-bold uppercase tracking-wider"
        style={{
          color: "#000000",
          fontFamily: "var(--font-inter)",
        }}
      >
        WEROBOT
      </h1>
    </div>
  );
}

