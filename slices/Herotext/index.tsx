"use client";

// slices/Herotext/index.tsx
import React, { useEffect, useRef } from "react";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `Herotext`.
 * (Using a loose type so the project builds.)
 */
export type HerotextProps = SliceComponentProps<any>;


/**
 * Hero text slice – the yellow capsule that says “WeRobot 2026”.
 */
const Herotext = ({ slice }: HerotextProps) => {
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
      className="flex justify-center pt-32 pb-16"
    >
      <div className="px-8 py-6 border border-black bg-transparent">
        <PrismicRichText
          field={slice.primary.title}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-[#1a1a1a]">
                {children}
              </h1>
            ),
            paragraph: ({ children }) => (
              <p className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-[#1a1a1a]">
                {children}
              </p>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default Herotext;
