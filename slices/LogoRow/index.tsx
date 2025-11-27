"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `LogoRow`.
 */
export type LogoRowProps = SliceComponentProps<Content.LogoRowSlice>;

/**
 * Horizontal row of supporting-organization logos inside a white pill card with continuous scrolling animation.
 */
const LogoRow: FC<LogoRowProps> = ({ slice }) => {
  const logos = slice.primary.logo || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current || logos.length === 0) return;

    const container = containerRef.current;
    const content = container.querySelector(".logo-content") as HTMLElement;
    if (!content) return;

    // Get the width of the content
    const contentWidth = content.scrollWidth;
    const containerWidth = container.offsetWidth;

    // Reset position
    gsap.set(content, { x: 0 });

    // Create infinite scroll animation
    animationRef.current = gsap.to(content, {
      x: -contentWidth / 2, // Move by half the content width (since we duplicate it)
      duration: 30, // Adjust speed here (higher = slower)
      ease: "none",
      repeat: -1, // Infinite repeat
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [logos]);

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-4"
    >
      <div
        className="w-full max-w-5xl rounded-xl bg-white border border-black/10 shadow-[14px_14px_0_#000000] py-6 overflow-hidden"
      >
        {logos.length > 0 ? (
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: "80px" }}
          >
            <div className="logo-content flex items-center gap-12 h-full" style={{ width: "fit-content", paddingLeft: "0", paddingRight: "0" }}>
              {duplicatedLogos.map((item, index) =>
                item.logo?.url ? (
                  <img
                    key={`${item.logo.url}-${index}`}
                    src={item.logo.url}
                    alt={item.logo.alt || "Partner logo"}
                    className="max-h-16 object-contain flex-shrink-0"
                    style={{ maxWidth: "180px", width: "auto" }}
                  />
                ) : null
              )}
            </div>
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-center text-gray-500">
            Add sponsor logos in Prismic
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoRow;
