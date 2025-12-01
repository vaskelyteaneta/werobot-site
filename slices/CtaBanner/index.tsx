"use client";

import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `CtaBanner`.
 */
export type CtaBannerProps = SliceComponentProps<Content.CtaBannerSlice>;

/**
 * CTA Banner slice – yellow button "GET THE TICKET".
 */
const CtaBanner = ({ slice }: CtaBannerProps) => {
  const label = slice.primary.button_text || "GET THE TICKET";
  const link = slice.primary.button_link;
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
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      {link ? (
        <PrismicLink
          field={link}
          className="transition-shadow duration-300 hover:shadow-[12px_12px_0px_#000000]"
          style={{
            display: "inline-block",
            padding: "22px 80px",
            backgroundColor: "#F5FF6B",
            color: "#000000",
            borderRadius: "0.75rem",
            fontFamily: "monospace",
            fontSize: "22px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {label}
        </PrismicLink>
      ) : (
        <button
          disabled
          style={{
            padding: "22px 80px",
            backgroundColor: "#888888",
            color: "#000000",
            borderRadius: "0.75rem",
            fontFamily: "monospace",
            fontSize: "22px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {label}
        </button>
      )}
    </section>
  );
};

export default CtaBanner;
