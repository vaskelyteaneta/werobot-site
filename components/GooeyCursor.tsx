"use client";

import { useEffect, useRef, useState } from "react";

export default function GooeyCursor() {
  const segmentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const positions = useRef<Array<{ x: number; y: number }>>([]);
  const numSegments = 20;
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleScroll = (e: Event) => {
      // Make cursor move slightly when scrolling to create dynamic effect
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Adjust cursor position based on scroll
      if (mouse.current.x > 0 && mouse.current.y > 0) {
        // Slight movement based on scroll direction
        mouse.current.y += scrollY * 0.1;
        mouse.current.x += scrollX * 0.1;
      }
    };

    const animate = () => {
      if (positions.current.length === 0 || !segmentsRef.current[0]) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // First segment follows mouse directly
      positions.current[0].x += (mouse.current.x - positions.current[0].x) * 0.2;
      positions.current[0].y += (mouse.current.y - positions.current[0].y) * 0.2;

      // Each subsequent segment follows the previous one
      for (let i = 1; i < numSegments; i++) {
        const prev = positions.current[i - 1];
        const curr = positions.current[i];
        
        // Calculate distance to previous segment
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Minimum distance between segments
        const minDistance = 15;
        
        if (distance > minDistance) {
          // Move current segment towards previous
          const angle = Math.atan2(dy, dx);
          curr.x = prev.x - Math.cos(angle) * minDistance;
          curr.y = prev.y - Math.sin(angle) * minDistance;
        }

        // Update DOM
        if (segmentsRef.current[i]) {
          segmentsRef.current[i]!.style.transform = `translate(${curr.x}px, ${curr.y}px)`;
        }
      }

      // Update first segment DOM
      if (segmentsRef.current[0]) {
        segmentsRef.current[0]!.style.transform = `translate(${positions.current[0].x}px, ${positions.current[0].y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize positions
    const init = () => {
      // Check if all refs are set
      if (segmentsRef.current.length !== numSegments || 
          !segmentsRef.current.every(ref => ref !== null)) {
        requestAnimationFrame(init);
        return;
      }

      // Initialize positions to center of screen
      const initX = window.innerWidth / 2;
      const initY = window.innerHeight / 2;
      positions.current = Array(numSegments).fill(null).map(() => ({ x: initX, y: initY }));
      mouse.current = { x: initX, y: initY };

      // Set initial positions immediately
      segmentsRef.current.forEach((el) => {
        if (el) {
          el.style.transform = `translate(${initX}px, ${initY}px)`;
        }
      });

      // Start animation
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("wheel", handleScroll, { passive: true });
      animate();
    };

    // Start initialization
    setTimeout(init, 200);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* SVG filter for gooey effect - matching Tympanus demo */}
      <svg style={{ position: "fixed", width: 0, height: 0, pointerEvents: "none", top: 0, left: 0, zIndex: 99999 }}>
        <defs>
          <filter id="gooey" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Multiple segments creating snake effect - matching Tympanus demo */}
      {Array(numSegments)
        .fill(null)
        .map((_, i) => {
          const size = Math.max(16, 20 - i * 0.4);
          const opacity = Math.max(0.8, 1 - i * 0.03);
          
          return (
            <div
              key={i}
              ref={(el) => {
                segmentsRef.current[i] = el;
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size / 2}px`,
                pointerEvents: "none",
                willChange: "transform",
                zIndex: 99999 - i,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  opacity: opacity,
                  boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                  borderRadius: "4px",
                }}
              />
            </div>
          );
        })}
    </>
  );
}
