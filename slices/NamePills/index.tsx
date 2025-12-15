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

              const basePillClass = "inline-flex items-center justify-center bg-transparent px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:border-black border border-black/30 font-light cursor-pointer rounded-none outline-none";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{
                    color: "#000000 !important",
                    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    borderColor: "rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {content}
                </PrismicLink>
              ) : (
                <div
                  key={`${item.text || index}-static`}
                  className={basePillClass}
                  style={{
                    color: "#000000 !important",
                    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.2)",
                    outline: "none",
                    borderColor: "rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {content}
                </div>
              );
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

              const basePillClass = "inline-flex items-center justify-center bg-transparent px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:border-black border border-black/30 font-light cursor-pointer rounded-none outline-none";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{ 
                    minWidth: "180px",
                    color: "#000000 !important",
                    outline: "none",
                    borderColor: "rgba(0, 0, 0, 0.3)",
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
                    color: "#000000 !important",
                    outline: "none",
                    borderColor: "rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {content}
                </div>
              );
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
