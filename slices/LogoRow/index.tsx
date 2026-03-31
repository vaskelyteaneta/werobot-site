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
  const layout = ((slice.primary as any).layout || "marquee") as "marquee" | "grid";
  const rawGridLogoHeight = (slice.primary as any).grid_logo_height_px;
  const gridLogoHeightPx =
    typeof rawGridLogoHeight === "number" && Number.isFinite(rawGridLogoHeight)
      ? Math.min(120, Math.max(20, rawGridLogoHeight))
      : 46;
  const gridCellHeightPx = gridLogoHeightPx + 24;
  const emptyCellsLg = (6 - (logos.length % 6)) % 6;
  const emptyCellsSm = (3 - (logos.length % 3)) % 3;
  const emptyCellsXs = (2 - (logos.length % 2)) % 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              sectionRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (layout !== "marquee") return;
    if (!containerRef.current || logos.length === 0) return;

    const container = containerRef.current;
    const content = container.querySelector(".logo-content") as HTMLElement;
    if (!content) return;

    // Wait for images to load to get accurate width
    const images = content.querySelectorAll("img");
    let loadedImages = 0;
    const totalImages = images.length;

    const checkAndAnimate = () => {
      if (loadedImages < totalImages) return;

      // Calculate the width of one complete set of logos
      const singleSetWidth = Array.from(content.children)
        .slice(0, logos.length)
        .reduce((sum, child) => {
          const rect = child.getBoundingClientRect();
          return sum + rect.width + 48; // 48px for gap-12
        }, 0);

      // Set initial position
      gsap.set(content, { x: 0 });

      // Create truly continuous infinite scroll that never stops
      // With 4 sets of logos, moving by one set width creates seamless loop
      const animate = () => {
        animationRef.current = gsap.to(content, {
          x: -singleSetWidth,
          duration: 40,
          ease: "none",
          onComplete: () => {
            // Instantly jump back by one set width (invisible due to duplicates)
            const currentX = gsap.getProperty(content, "x") as number;
            gsap.set(content, { x: currentX + singleSetWidth });
            // Immediately start next cycle
            animate();
          }
        });
      };
      
      animate();
    };

    if (totalImages === 0) {
      checkAndAnimate();
    } else {
      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === totalImages) checkAndAnimate();
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) checkAndAnimate();
          };
        }
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [logos, layout]);

  // Duplicate logos multiple times for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-6"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .logo-img { height: 30px !important; max-width: 120px !important; }
        @media (min-width: 768px) {
          .logo-img { height: 70px !important; max-width: 250px !important; }
        }
      `}} />
      <div
        className={`w-full max-w-5xl bg-transparent overflow-hidden transition-all duration-300 border border-[#000053] ${
          layout === "grid" ? "py-0 border-b-0" : "py-3 md:py-6"
        }`}
      >
        {logos.length > 0 ? (
          layout === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {logos.map((item: any, index: number) =>
                item.logo?.url ? (
                  <div
                    key={`${item.logo.url}-${index}`}
                    className="relative border-r border-b border-[#000053] flex items-center justify-center px-3 py-2"
                    style={{ height: `${gridCellHeightPx}px` }}
                  >
                    <img
                      src={item.logo.url}
                      alt={item.logo.alt || "Partner logo"}
                      className="w-auto max-w-full object-contain transition-all duration-300"
                      style={{ maxHeight: `${gridLogoHeightPx}px`, filter: "grayscale(100%)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "grayscale(0%)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "grayscale(100%)";
                      }}
                    />
                    {(item as any).credit ? (
                      <div className="absolute bottom-0 left-0 pointer-events-none bg-white/45 backdrop-blur-[2px] text-black/80 text-[9px] leading-tight px-1 py-[1px] rounded-tr-[6px] border border-white/40 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                        {(item as any).credit}
                      </div>
                    ) : null}
                  </div>
                ) : null
              )}
              {/* Fill trailing empty slots so the last row keeps full grid lines */}
              {Array.from({ length: emptyCellsXs }).map((_, idx) => (
                <div
                  key={`empty-xs-${idx}`}
                  className="sm:hidden border-r border-b border-[#000053]"
                  style={{ height: `${gridCellHeightPx}px` }}
                />
              ))}
              {Array.from({ length: emptyCellsSm }).map((_, idx) => (
                <div
                  key={`empty-sm-${idx}`}
                  className="hidden sm:block lg:hidden border-r border-b border-[#000053]"
                  style={{ height: `${gridCellHeightPx}px` }}
                />
              ))}
              {Array.from({ length: emptyCellsLg }).map((_, idx) => (
                <div
                  key={`empty-lg-${idx}`}
                  className="hidden lg:block border-r border-b border-[#000053]"
                  style={{ height: `${gridCellHeightPx}px` }}
                />
              ))}
            </div>
          ) : (
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden h-[40px] md:h-[80px]"
          >
            <div className="logo-content flex items-center gap-6 md:gap-12 h-full" style={{ width: "fit-content" }}>
              {duplicatedLogos.map((item, index) =>
                item.logo?.url ? (
                  <div key={`${item.logo.url}-${index}`} className="relative flex-shrink-0 inline-flex">
                    <img
                      src={item.logo.url}
                      alt={item.logo.alt || "Partner logo"}
                      className="logo-img object-contain flex-shrink-0 transition-all duration-300 cursor-pointer"
                      style={{
                        width: "auto",
                        filter: "grayscale(100%)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "grayscale(0%)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "grayscale(100%)";
                      }}
                    />
                    {(item as any).credit ? (
                      <div className="absolute bottom-0 left-0 pointer-events-none bg-white/45 backdrop-blur-[2px] text-black/80 text-[9px] leading-tight px-1 py-[1px] rounded-tr-[6px] border border-white/40 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                        {(item as any).credit}
                      </div>
                    ) : null}
                  </div>
                ) : null
              )}
            </div>
          </div>
          )
        ) : (
              <p className="text-xs uppercase tracking-[0.25em] text-left text-white opacity-70">
            Add sponsor logos in Prismic
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoRow;
