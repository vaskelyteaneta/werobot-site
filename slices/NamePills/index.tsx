"use client";

import { FC, useEffect, useRef, useCallback } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `NamePills`.
 */
export type NamePillsProps = SliceComponentProps<Content.NamePillsSlice>;

/**
 * Component for "NamePills" Slices.
 */
const NamePills: FC<NamePillsProps> = ({ slice }) => {
  const pills = slice.primary.pills ?? [];
  const hasTitle = Boolean(slice.primary.section_title);
  const layout = (slice.primary as any).layout || "wrap";
  const isColumnLayout = layout === "columns";
  
  // Generate section ID from title (e.g., "ORGANIZING COMMITTEE" -> "organizing-committee")
  const sectionTitle = slice.primary.section_title || "";
  const sectionId = sectionTitle
    ? sectionTitle.toLowerCase().replace(/\s+/g, "-")
    : "organizing-committee"; // fallback default

  // Direct hover handlers to guarantee pure black (#000000) background - no CSS involved
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("background-color", "#000000", "important");
    el.style.setProperty("background", "#000000", "important");
    el.style.setProperty("border-color", "#000000", "important");
    el.style.setProperty("color", "#ffffff", "important");
    // Also update all child elements
    el.querySelectorAll("*").forEach((child) => {
      (child as HTMLElement).style.setProperty("color", "#ffffff", "important");
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("background-color", "transparent", "important");
    el.style.setProperty("background", "transparent", "important");
    el.style.setProperty("border-color", "#000000", "important");
    el.style.setProperty("color", "#000000", "important");
    el.querySelectorAll("*").forEach((child) => {
      (child as HTMLElement).style.setProperty("color", "#000000", "important");
    });
  }, []);

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
  }, [pills]);

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex flex-col items-center gap-8 py-12 px-4"
    >
      {hasTitle && (
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-left font-light text-white opacity-70">
          {slice.primary.section_title}
        </p>
      )}

      {isColumnLayout ? (
        // Three-column layout
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {pills.length > 0 ? (
            pills.map((item, index) => {
              const content = (
                    <span className="text-sm tracking-[0.1em]">
                  {item.text || "Name"}
                </span>
              );

              const basePillClass = "inline-flex items-center justify-center px-6 py-2 border font-light cursor-pointer rounded-none outline-none";

              // Extract URL from Prismic link field - handle all possible structures
              let linkUrl: string | null = null;
              if (item.link) {
                const link = item.link as any;
                if (link.url) {
                  linkUrl = link.url;
                } else if (link.text && (link.text.startsWith("http://") || link.text.startsWith("https://") || link.text.startsWith("mailto:"))) {
                  linkUrl = link.text;
                } else if (link.value?.url) {
                  linkUrl = link.value.url;
                } else if (link.value?.text && (link.value.text.startsWith("http://") || link.value.text.startsWith("https://") || link.value.text.startsWith("mailto:"))) {
                  linkUrl = link.value.text;
                } else if (link.link_type === "Web" && link.url) {
                  linkUrl = link.url;
                }
              }
              
              const isExternalLink = linkUrl && typeof linkUrl === "string" && (linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:"));

              const pillStyle: React.CSSProperties = {
                backgroundColor: "transparent",
                color: "#000000",
                borderColor: "#000000",
                outline: "none",
                textDecoration: "none",
              };

              if (linkUrl) {
                return (
                  <a
                    key={`${item.text}-${index}`}
                    href={linkUrl}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                    className={basePillClass}
                    style={pillStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </a>
                );
              } else {
                return (
                  <div
                    key={`${item.text || index}-static`}
                    className={basePillClass}
                    style={pillStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </div>
                );
              }
            })
          ) : (
                <p className="text-sm text-white opacity-70 uppercase tracking-[0.2em] col-span-3 text-left">
              Add names to the NamePills slice in Prismic.
            </p>
          )}
        </div>
      ) : (
        // Original wrap layout
        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-6">
          {pills.length > 0 ? (
            pills.map((item, index) => {
              const content = (
                    <span className="text-sm tracking-[0.1em]">
                  {item.text || "Name"}
                </span>
              );

              const basePillClass = "inline-flex items-center justify-center px-6 py-2 border font-light cursor-pointer rounded-none outline-none";

              // Extract URL from Prismic link field - handle all possible structures
              let linkUrl: string | null = null;
              if (item.link) {
                const link = item.link as any;
                if (link.url) {
                  linkUrl = link.url;
                } else if (link.text && (link.text.startsWith("http://") || link.text.startsWith("https://") || link.text.startsWith("mailto:"))) {
                  linkUrl = link.text;
                } else if (link.value?.url) {
                  linkUrl = link.value.url;
                } else if (link.value?.text && (link.value.text.startsWith("http://") || link.value.text.startsWith("https://") || link.value.text.startsWith("mailto:"))) {
                  linkUrl = link.value.text;
                } else if (link.link_type === "Web" && link.url) {
                  linkUrl = link.url;
                }
              }
              
              const isExternalLink = linkUrl && typeof linkUrl === "string" && (linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:"));

              const pillStyle: React.CSSProperties = {
                minWidth: "180px",
                backgroundColor: "transparent",
                color: "#000000",
                borderColor: "#000000",
                outline: "none",
                textDecoration: "none",
              };

              if (linkUrl) {
                return (
                  <a
                    key={`${item.text}-${index}`}
                    href={linkUrl}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                    className={basePillClass}
                    style={pillStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </a>
                );
              } else {
                return (
                  <div
                    key={`${item.text || index}-static`}
                    className={basePillClass}
                    style={pillStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </div>
                );
              }
            })
          ) : (
                <p className="text-sm text-white opacity-70 uppercase tracking-[0.2em]">
              Add names to the NamePills slice in Prismic.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default NamePills;
