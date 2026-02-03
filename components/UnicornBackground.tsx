"use client";

import { useEffect, useState } from "react";

export default function UnicornBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load Unicorn Studio script
    if (typeof window !== 'undefined' && !(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.36/dist/unicornStudio.umd.js";
      script.onload = () => {
        if ((window as any).UnicornStudio && !(window as any).UnicornStudio.isInitialized && (window as any).UnicornStudio.init) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Clean background base */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          zIndex: -1,
          pointerEvents: "none"
        }}
      />
      {/* Unicorn Studio Background - blue floating cloud */}
      <div 
        data-us-project="XqSpkUNuFa3STasqny3T" 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          transform: "scale(1.2)",
          transformOrigin: "center center",
          filter: "hue-rotate(200deg) saturate(1.3) brightness(0.8)",
          opacity: 0.3,
        }}
      />
      {/* Blue overlay for the cloud */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(94, 128, 199, 0.3)",
          mixBlendMode: "color",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
    </>
  );
}

