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
      className="flex justify-center pt-24 pb-12"
    >
      <div className="bg-[#F5FF6D] px-10 py-4 rounded-[32px] shadow-[8px_8px_0px_#000000]">
        <PrismicRichText
          field={slice.primary.title}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-3xl md:text-4xl font-medium tracking-[0.18em] uppercase">
                {children}
              </h1>
            ),
            paragraph: ({ children }) => (
              <p className="text-2xl md:text-3xl font-medium tracking-[0.18em] uppercase">
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
