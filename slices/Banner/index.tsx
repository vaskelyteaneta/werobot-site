"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `Banner`.
 */
export type BannerProps = SliceComponentProps<Content.BannerSlice>;

/**
 * Component for "Banner" Slices.
 */
const Banner: FC<BannerProps> = ({ slice }) => {
  const label = slice.primary.button_text || "WHAT WEROBOT OFFERS";
  const sectionRef = useRef<HTMLElement>(null);
  
  // Check if this is "PARTNER WITH WEROBOT" - use mailto link
  const normalizedLabel = (label || "").trim().toUpperCase();
  const isPartnerButton = normalizedLabel.includes("PARTNER");
  const partnerEmail = "orga@werobot2026.eu";
  
  // Check if this is "CALL FOR PAPERS" section - add anchor ID
  const isCallForPapers = normalizedLabel.includes("PAPERS") || normalizedLabel.includes("CALL FOR");
  const sectionId = isCallForPapers ? "call-for-papers" : undefined;

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
      id={sectionId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-16 px-4"
    >
      {isPartnerButton ? (
        <a
          href={`mailto:${partnerEmail}?subject=Partner%20with%20WeRobot%202026`}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `mailto:${partnerEmail}?subject=Partner%20with%20WeRobot%202026`;
          }}
          className="inline-flex border border-black bg-black uppercase px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light transition-all duration-300 hover:opacity-80"
          style={{
            letterSpacing: "0.2em",
            color: "#ffffff",
            textDecoration: "none",
            cursor: "default",
          }}
        >
          {label}
        </a>
      ) : (
        <div
          className="inline-flex border border-black bg-transparent uppercase px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light"
          style={{
            letterSpacing: "0.2em",
            color: "#000000",
            borderColor: "#000000",
          }}
        >
          {label}
        </div>
      )}
    </section>
  );
};

export default Banner;
