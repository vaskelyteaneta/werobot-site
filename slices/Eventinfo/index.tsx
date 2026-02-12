"use client";

// slices/Eventinfo/index.tsx
import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps, PrismicLink, LinkField } from "@prismicio/react";
import { gsap } from "gsap";

/**
 * Props for `Eventinfo`.
 */
export type EventinfoProps = SliceComponentProps<Content.EventinfoSlice>;

// Map select field values → alignment classes
const alignmentClasses: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

/**
 * White rounded rectangle with the event info text.
 */
const Eventinfo = ({ slice }: EventinfoProps) => {
  const alignment = slice.primary.alignment || "center";
  const alignClasses = alignmentClasses[alignment] ?? alignmentClasses.center;
  const showShadow = slice.primary.show_shadow ?? false;
  const graphicImage = (slice.primary as any).graphic_image;
  const graphicPosition = (slice.primary as any)?.graphic_position;
  const graphicSize = (slice.primary as any).graphic_size || "small";
  const graphicImage2 = (slice.primary as any).graphic_image_2;
  const graphicPosition2 = (slice.primary as any)?.graphic_position_2;
  const graphicSize2 = (slice.primary as any).graphic_size_2 || "small";
  
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const graphic1Ref = useRef<HTMLDivElement>(null);
  const graphic2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the white box with fly-in/fade-in
            if (boxRef.current) {
              gsap.fromTo(
                boxRef.current,
                {
                  opacity: 0,
                  y: 60,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.2,
                  ease: "power2.out",
                }
              );
            }

            // Animate first graphic - simple fade/fly in
            if (graphic1Ref.current && graphicImage?.url) {
              gsap.fromTo(
                graphic1Ref.current,
                {
                  opacity: 0,
                  y: 30,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.2,
                  ease: "power2.out",
                  delay: 0.3,
                }
              );
            }

            // Animate second graphic with more delay if both graphics exist
            if (graphic2Ref.current && graphicImage2?.url) {
              // Check if graphics are positioned near each other
              const positionsNearEachOther = 
                (graphicPosition === "absolute-top-left" && graphicPosition2 === "absolute-top-right") ||
                (graphicPosition === "absolute-top-right" && graphicPosition2 === "absolute-top-left") ||
                (graphicPosition === "absolute-bottom-left" && graphicPosition2 === "absolute-bottom-right") ||
                (graphicPosition === "absolute-bottom-right" && graphicPosition2 === "absolute-bottom-left") ||
                (graphicPosition === "absolute-top-middle" && graphicPosition2 === "absolute-bottom-middle") ||
                (graphicPosition === "absolute-left-middle" && graphicPosition2 === "absolute-right-middle");
              
              const delay = positionsNearEachOther ? 1.2 : 0.8;
              
              gsap.fromTo(
                graphic2Ref.current,
                {
                  opacity: 0,
                  y: 30,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.2,
                  ease: "power2.out",
                  delay: delay,
                }
              );
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [graphicImage, graphicImage2, graphicPosition, graphicPosition2]);

  // Size mappings for graphics
  const sizeClasses = {
    small: "max-w-[200px] md:max-w-[250px]",
    medium: "max-w-[300px] md:max-w-[400px]",
    large: "max-w-[500px] md:max-w-[600px]",
  };

  // Determine container width based on alignment
  const containerClasses = 
    alignment === "left" || alignment === "right"
      ? "w-full max-w-[90vw] md:max-w-[45vw]"
      : "w-full max-w-[90vw] md:max-w-[700px]";

  // Get graphic positioning styles - absolute on desktop, static on mobile
  // Graphics are positioned further away to avoid covering text
  const getGraphicStyle = (position: string | undefined) => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 20,
      pointerEvents: "none",
    };

    // Normalize position string (trim and lowercase for comparison)
    const normalizedPosition = (position || "").trim().toLowerCase();

    // Moderate offsets to keep graphics on slice but prevent covering text
    // Using negative values to position graphics slightly outside the box edges
    if (normalizedPosition === "absolute-top-left") {
      return { ...baseStyle, top: "-2.5rem", left: "-2.5rem", transform: "translate(-50%, -50%)", bottom: "auto", right: "auto" };
    }
    if (normalizedPosition === "absolute-top-middle") {
      return { ...baseStyle, top: "-2.5rem", left: "50%", transform: "translate(-50%, -50%)", bottom: "auto", right: "auto" };
    }
    if (normalizedPosition === "absolute-top-right") {
      return { ...baseStyle, top: "-2.5rem", right: "-2.5rem", transform: "translate(50%, -50%)", bottom: "auto", left: "auto" };
    }
    if (normalizedPosition === "absolute-left-middle") {
      return { ...baseStyle, top: "50%", left: "-2.5rem", transform: "translate(-50%, -50%)", bottom: "auto", right: "auto" };
    }
    if (normalizedPosition === "absolute-right-middle") {
      return { ...baseStyle, top: "50%", right: "-2.5rem", transform: "translate(50%, -50%)", bottom: "auto", left: "auto" };
    }
    if (normalizedPosition === "absolute-bottom-left") {
      return { ...baseStyle, bottom: "-2.5rem", left: "-2.5rem", transform: "translate(-50%, 50%)", top: "auto", right: "auto" };
    }
    if (normalizedPosition === "absolute-bottom-middle") {
      return { ...baseStyle, bottom: "-2.5rem", left: "50%", transform: "translate(-50%, 50%)", top: "auto", right: "auto" };
    }
    if (normalizedPosition === "absolute-bottom-right") {
      return { ...baseStyle, bottom: "-2.5rem", right: "-2.5rem", transform: "translate(50%, 50%)", top: "auto", left: "auto" };
    }
    
    // Fallback: log the actual value for debugging
    console.warn("Unknown graphic position:", position, "normalized:", normalizedPosition, "using default top-right");
    return { ...baseStyle, top: "-4rem", right: "-4rem", transform: "translate(50%, -50%)", bottom: "auto", left: "auto" };
  };

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full flex ${alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center"} mb-6 md:mb-8 px-4 md:px-8 relative overflow-visible`}
    >
      <div
        ref={boxRef}
        className={[
          containerClasses,
          "px-8 py-8 md:px-12 md:py-10",
          "border border-white",
          "bg-transparent",
          "relative",
          "z-0",
          "items-start text-left",
          "transition-all duration-300",
          "hover:border-[#1a1a1a]",
          "overflow-visible",
        ].join(" ")}
        style={{ position: "relative" }}
      >
        {slice.primary.text ? (
              <div className="text-sm md:text-base tracking-[0.05em] leading-relaxed text-left text-[#1a1a1a] font-light">
            <PrismicRichText 
              field={slice.primary.text}
              components={{
                hyperlink: ({ node, children }) => {
                  const linkField = node.data as LinkField;
                  return (
                    <PrismicLink
                      field={linkField}
                      className="underline hover:text-[#000000] transition-colors duration-200"
                      style={{ 
                        textDecoration: "underline", 
                        color: "#1a1a1a",
                        cursor: "pointer"
                      }}
                      target={linkField.target || undefined}
                      rel={linkField.target === '_blank' ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </PrismicLink>
                  );
                },
              }}
            />
          </div>
        ) : (
              <p className="text-sm md:text-base tracking-[0.05em] leading-relaxed text-left text-[#1a1a1a] font-light">
            Coming next spring: April 23 – 25, 2026 · Berlin, Germany
          </p>
        )}

        {/* Render first graphic if provided */}
        {graphicImage?.url && (
          <>
            {/* Mobile: static, stacked */}
            <div 
              ref={graphic1Ref} 
              className="static mt-4 flex justify-center md:hidden"
            >
              <img
                src={graphicImage.url}
                alt={graphicImage.alt || ""}
                className={`w-full h-auto ${sizeClasses[graphicSize as keyof typeof sizeClasses] || sizeClasses.small}`}
              />
            </div>
            {/* Desktop: absolute positioned */}
            <div 
              className="hidden md:block"
              style={getGraphicStyle(graphicPosition)}
            >
              <img
                src={graphicImage.url}
                alt={graphicImage.alt || ""}
                className={`w-full h-auto ${sizeClasses[graphicSize as keyof typeof sizeClasses] || sizeClasses.small}`}
              />
            </div>
          </>
        )}

        {/* Render second graphic if provided */}
        {graphicImage2?.url && (
          <>
            {/* Mobile: static, stacked */}
            <div 
              ref={graphic2Ref} 
              className="static mt-4 flex justify-center md:hidden"
            >
              <img
                src={graphicImage2.url}
                alt={graphicImage2.alt || ""}
                className={`w-full h-auto ${sizeClasses[graphicSize2 as keyof typeof sizeClasses] || sizeClasses.small}`}
              />
            </div>
            {/* Desktop: absolute positioned */}
            <div 
              className="hidden md:block"
              style={getGraphicStyle(graphicPosition2)}
            >
              <img
                src={graphicImage2.url}
                alt={graphicImage2.alt || ""}
                className={`w-full h-auto ${sizeClasses[graphicSize2 as keyof typeof sizeClasses] || sizeClasses.small}`}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Eventinfo;
