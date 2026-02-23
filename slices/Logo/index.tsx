"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Logo`.
 */
export type LogoProps = SliceComponentProps<Content.LogoSlice>;

/**
 * Component for "Logo" Slices.
 */
const Logo: FC<LogoProps> = ({ slice }) => {
  const rawOffsetX = slice.primary.desktop_offset_x;
  const rawOffsetY = slice.primary.desktop_offset_y;
  const width = slice.primary.desktop_width ?? 360;
  const zIndex = slice.primary.z_index ?? 1;
  const rotation = slice.primary.rotation ?? 0;
  const hasText = Boolean(slice.primary.text);

  const useAbsolute =
    typeof rawOffsetX === "number" && typeof rawOffsetY === "number";

  const offsetX = rawOffsetX ?? 0;
  const offsetY = rawOffsetY ?? 0;

  // Track scroll to hide fixed mobile logo
  const [showMobileLogo, setShowMobileLogo] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide after scrolling down past 80px
      if (currentScrollY > 80) {
        setShowMobileLogo(false);
      } else {
        setShowMobileLogo(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = slice.primary.logo?.url;
  const logoAlt = slice.primary.logo?.alt || slice.primary.text || "Logo";

  return (
    <>
      {/* Mobile: small fixed logo at top-left, hides on scroll */}
      {logoUrl && (
        <div
          className="md:hidden fixed top-0 left-0 z-50 p-3 transition-all duration-300"
          style={{
            opacity: showMobileLogo ? 1 : 0,
            pointerEvents: showMobileLogo ? "auto" : "none",
            transform: showMobileLogo ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <a href="/" aria-label="Home">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="object-contain"
              style={{
                height: "36px",
                width: "auto",
              }}
            />
          </a>
        </div>
      )}

      {/* Desktop: original centered logo (hidden on mobile) */}
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={[
          "w-full",
          "hidden md:block", // Hide the big logo on mobile
          "py-10 px-4",
          useAbsolute
            ? "lg:px-0 relative lg:absolute flex justify-center lg:justify-start"
            : "flex justify-center",
        ].join(" ")}
        style={
          useAbsolute
            ? {
                top: offsetY,
                left: offsetX,
                zIndex,
              }
            : undefined
        }
      >
        <div
          className="bg-transparent px-4 md:px-10 py-4 md:py-6 flex flex-col items-center gap-3 transition-all duration-300 w-full max-w-[calc(100%-2rem)] md:max-w-[700px]"
          style={{
            transform: rotation ? `rotate(${rotation}deg)` : undefined,
            transformOrigin: "center",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt}
              className="object-contain"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          ) : (
            <p className="text-sm text-[#6b6b6b] font-light">Upload a logo</p>
          )}
          {hasText && (
            <p className="text-xs uppercase tracking-[0.2em] text-left font-light text-[#6b6b6b]">
              {slice.primary.text}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Logo;
