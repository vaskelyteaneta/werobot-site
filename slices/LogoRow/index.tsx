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
          duration: 20,
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
  }, [logos]);

  // Duplicate logos multiple times for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-4"
    >
      <div
        className="w-full max-w-5xl border border-black/30 bg-transparent py-6 overflow-hidden transition-all duration-300 hover:border-black"
        style={{
          boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.2)",
        }}
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
              <p className="text-xs uppercase tracking-[0.25em] text-left text-white opacity-70">
            Add sponsor logos in Prismic
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoRow;
