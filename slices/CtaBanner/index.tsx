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
  // Check if this is "GET THE TICKET" - use Pretix link
  const isTicketButton = label.toUpperCase().includes("TICKET");
  // Check if this is "PARTNER WITH WEROBOT" - use mailto link (priority check)
  // Trim and normalize the label for better detection
  const normalizedLabel = (label || "").trim().toUpperCase();
  const isPartnerButton = normalizedLabel.includes("PARTNER");
  const isActionButton = isPapersButton || isTicketButton;
  const pdfUrl = "https://ai-laws.org/wp-content/uploads/2025/08/WeRobot26-Berlin.pdf";
  const partnerEmail = "orga@werobot2026.eu";
  const ticketUrl = "https://pretix.eu/werobot26/tickets/";
  
  // Force mailto for partner button even if link exists - this takes priority
  const shouldUseMailto = isPartnerButton;

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
      {shouldUseMailto ? (
        <a
          href={`mailto:${partnerEmail}?subject=Partner%20with%20WeRobot%202026`}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `mailto:${partnerEmail}?subject=Partner%20with%20WeRobot%202026`;
          }}
          className="transition-all duration-300 hover:opacity-80 inline-block px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "1px solid #000000",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "default",
          }}
        >
          {label}
        </a>
      ) : isTicketButton ? (
        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:opacity-80 inline-block px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "1px solid #000000",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "default",
          }}
        >
          {label}
        </a>
      ) : isPapersButton ? (
        <a
          href={pdfUrl}
          download="WeRobot26-Berlin.pdf"
          className="transition-all duration-300 hover:opacity-80 inline-block px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#fafafa",
            border: "1px solid #1a1a1a",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {label}
        </a>
      ) : link ? (
        <PrismicLink
          className={`transition-all duration-300 inline-block px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light ${
            isActionButton ? "hover:opacity-80" : ""
          }`}
          field={link}
          style={{
            backgroundColor: isActionButton ? "#1a1a1a" : "transparent",
            color: isActionButton ? "#fafafa" : "#1a1a1a",
            border: "1px solid #1a1a1a",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {label}
        </PrismicLink>
      ) : (
        <button
          disabled
          className="px-8 py-4 md:px-16 md:py-5 text-sm md:text-base font-light"
          style={{
            backgroundColor: "transparent",
            color: "#6b6b6b",
            border: "1px solid #e5e5e5",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.5,
            cursor: "not-allowed",
          }}
        >
          {label}
        </button>
      )}
    </section>
  );
};

export default CtaBanner;
