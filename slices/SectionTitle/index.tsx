"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `SectionTitle`.
 */
export type SectionTitleProps = SliceComponentProps<Content.SectionTitleSlice>;

/**
 * Component for "SectionTitle" Slices.
 */
const SectionTitle: FC<SectionTitleProps> = ({ slice }) => {
  const hasTitle = slice.primary.title && slice.primary.title.length > 0;
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
      className="w-full flex justify-center py-10 px-4"
    >
      <div className="text-left">
        {hasTitle ? (
          <PrismicRichText
            field={slice.primary.title}
            components={{
              paragraph: ({ children }) => (
                <p className="text-base md:text-lg tracking-[0.35em] uppercase">
                  {children}
                </p>
              ),
            }}
          />
        ) : (
          <p className="font-mono text-base md:text-lg tracking-[0.35em] uppercase">
            HOSTING ORGANISATIONS
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionTitle;
