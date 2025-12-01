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
      {/* Blue background base */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#2563eb",
          zIndex: -1,
          pointerEvents: "none"
        }}
      />
      {/* Unicorn Studio Background */}
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
          transformOrigin: "center center"
        }}
      />
      {/* Blue filter overlay */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(37, 99, 235, 0.4)",
          mixBlendMode: "multiply",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
    </>
  );
}

