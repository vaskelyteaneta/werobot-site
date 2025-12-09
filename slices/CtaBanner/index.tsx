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

  // Check if this is the "GET THE PAPERS" button and use PDF link
  const isPapersButton = label.toUpperCase().includes("PAPERS");
  const pdfUrl = "https://ai-laws.org/wp-content/uploads/2025/08/WeRobot26-Berlin.pdf";

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
      {isPapersButton ? (
        <a
          href={pdfUrl}
          download="WeRobot26-Berlin.pdf"
          className="transition-shadow duration-300 hover:shadow-[12px_12px_0px_#000000] inline-block px-6 py-4 md:px-20 md:py-5 text-base md:text-xl"
          style={{
            backgroundColor: "#F5FF6B",
            color: "#000000",
            borderRadius: "2rem",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "2px dashed rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
          }}
        >
          {label}
        </a>
      ) : link ? (
        <PrismicLink
          className="transition-shadow duration-300 hover:shadow-[12px_12px_0px_#000000] inline-block px-6 py-4 md:px-20 md:py-5 text-base md:text-xl"
          field={link}
          style={{
            backgroundColor: "#F5FF6B",
            color: "#000000",
            borderRadius: "2rem",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "2px dashed rgba(0, 0, 0, 0.4)",
          }}
        >
          {label}
        </PrismicLink>
      ) : (
        <button
          disabled
          className="px-6 py-4 md:px-20 md:py-5 text-base md:text-xl"
          style={{
            backgroundColor: "#888888",
            color: "#000000",
            borderRadius: "2rem",
            fontFamily: "monospace",
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
