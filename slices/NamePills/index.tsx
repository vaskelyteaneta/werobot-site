"use client";

import { FC, useEffect, useRef } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicLink, SliceComponentProps } from "@prismicio/react";
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

  // Define the 5 colors from the palette
  const hoverColors = [
    "#FFF461", // bright pale yellow
    "#DEAE54", // warm golden-brown
    "#FFB366", // light orange/peach (estimated)
    "#DE548B", // muted rose/dusty pink
    "#C06DFA", // vibrant light purple
  ];

  // Get hover color for a specific index
  const getHoverColor = (index: number) => hoverColors[index % hoverColors.length];

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

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex flex-col items-center gap-8 py-12 px-4"
    >
      {hasTitle && (
            <p className="text-base tracking-[0.35em] uppercase text-left">
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

              const hoverColor = getHoverColor(index);
              const basePillClass = "inline-flex items-center justify-center rounded-lg px-8 py-3 shadow-[10px_10px_0_0_rgba(0,0,0,0)] hover:shadow-[10px_10px_0_#000000] transition-all duration-300";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{
                    backgroundColor: "#FACC15", // yellow-400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FACC15";
                  }}
                >
                  {content}
                </PrismicLink>
              ) : (
                <div
                  key={`${item.text || index}-static`}
                  className={basePillClass}
                  style={{
                    backgroundColor: "#FACC15", // yellow-400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FACC15";
                  }}
                >
                  {content}
                </div>
              );
            })
          ) : (
                <p className="text-sm text-gray-500 uppercase tracking-[0.2em] col-span-3 text-left">
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

              const hoverColor = getHoverColor(index);
              const basePillClass = "inline-flex items-center justify-center rounded-lg px-8 py-3 shadow-[10px_10px_0_0_rgba(0,0,0,0)] hover:shadow-[10px_10px_0_#000000] transition-all duration-300";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{ 
                    minWidth: "180px",
                    backgroundColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {content}
                </PrismicLink>
              ) : (
                <div
                  key={`${item.text || index}-static`}
                  className={basePillClass}
                  style={{ 
                    minWidth: "180px",
                    backgroundColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {content}
                </div>
              );
            })
          ) : (
                <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
              Add names to the NamePills slice in Prismic.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default NamePills;
