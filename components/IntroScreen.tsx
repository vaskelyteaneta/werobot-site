"use client";

import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    }, 3000);

    const handleScroll = () => {
      if (isVisible && window.scrollY > 10) {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 500);
      }
    };

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
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${
        isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#E6F2FF",
      }}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(false), 700);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/we-robot-logo-v2.png"
        alt="WeRobot Logo"
        className="max-w-[80%] md:max-w-[700px] h-auto px-6"
      />
    </div>
  );
}

