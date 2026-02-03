"use client";

import { useEffect, useState } from "react";

// Add global styles for slow animation
if (typeof document !== 'undefined') {
  const styleId = 'unicorn-background-animation';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slowFloat {
        0%, 100% {
          transform: scale(1.5) translate(0, 0);
        }
        50% {
          transform: scale(1.5) translate(2%, 2%);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export default function UnicornBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Add CSS animation for slow movement
    if (typeof document !== 'undefined') {
      const styleId = 'unicorn-background-animation';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes slowFloat {
            0%, 100% {
              transform: scale(1.5) translate(0, 0);
            }
            50% {
              transform: scale(1.5) translate(2%, 2%);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }

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
          backgroundColor: "#e6f2ff",
          zIndex: -1,
          pointerEvents: "none"
        }}
      />
      {/* Unicorn Studio Background - soft subtle cloud */}
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
          transform: "scale(1.5)",
          transformOrigin: "center center",
          filter: "grayscale(100%) brightness(1.8) contrast(0.6) blur(15px)",
          opacity: 0.2,
          animation: "slowFloat 60s ease-in-out infinite",
        }}
      />
    </>
  );
}

