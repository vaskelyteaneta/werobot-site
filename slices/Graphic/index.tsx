"use client";

import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Graphic`.
 */
export type GraphicProps = SliceComponentProps<Content.GraphicSlice>;

/**
 * Graphic slice.
 */
const Graphic = ({ slice }: GraphicProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const position = (slice.primary as any).position || "center";
  const size = slice.primary.size || "small";
  const showBorder = (slice.primary as any).show_border || false;
  
  // Hide on mobile if this is the second consecutive Graphic slice
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Skip absolute positioned graphics (they overlay other content)
    if (position && (position.startsWith("absolute") || position.includes("absolute"))) {
      return;
    }
    
    // Find the parent wrapper and check previous sibling wrapper
    const wrapper = sectionRef.current.closest('[class*="slice-wrapper"]');
    if (!wrapper) return;
    
    const previousWrapper = wrapper.previousElementSibling;
    if (previousWrapper) {
      // Check if previous wrapper contains a Graphic slice
      const prevGraphic = previousWrapper.querySelector('[data-slice-type="graphic"]');
      if (prevGraphic) {
        // Check if previous graphic is also non-absolute
        const prevSection = prevGraphic.closest('section');
        const isPrevAbsolute = prevSection?.className.includes('absolute');
        
        if (!isPrevAbsolute) {
          // Hide this Graphic on mobile (second consecutive one)
          sectionRef.current.classList.add("hidden", "md:block");
        }
      }
    }
  }, [position]);
  
  // Size mappings
  const sizeClasses = {
    small: "max-w-[200px] md:max-w-[250px]",
    medium: "max-w-[300px] md:max-w-[400px]",
    large: "max-w-[500px] md:max-w-[600px]",
  };

  // Only apply rotation to absolute positioned graphics (decorative overlays)
  // Gallery graphics (star row) and non-absolute graphics should not rotate
  const shouldRotate = position && (position.startsWith("absolute") || position.includes("absolute"));
  
  const imageContent = slice.primary.graphic_image?.url ? (
    shouldRotate ? (
      <div className="rotate-slow">
        <img
          src={slice.primary.graphic_image.url}
          alt={slice.primary.graphic_image.alt || ""}
          className={`w-full h-auto ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.small}`}
        />
      </div>
    ) : (
      <img
        src={slice.primary.graphic_image.url}
        alt={slice.primary.graphic_image.alt || ""}
        className={`w-full h-auto ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.small}`}
      />
    )
  ) : (
    <p style={{ color: "white" }}>No image selected.</p>
  );

  // Absolute positioning (for overlaying on other slices, especially Eventinfo)
  if (position === "absolute-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute top-0 left-4 md:left-8 z-20 pointer-events-none"
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute top-0 right-4 md:right-8 z-20 pointer-events-none"
      >
        {imageContent}
      </section>
    );
  }

  // All absolute positions position relative to the Eventinfo white box
  // Using negative values to position outside the box, ensuring text is never covered
  if (position === "absolute-top-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '-2rem', 
          left: '-2rem',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-top-middle") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '-2rem', 
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-top-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '-2rem', 
          right: '-2rem',
          transform: 'translate(50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-left-middle") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '50%', 
          left: '-2rem',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-right-middle") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '50%', 
          right: '-2rem',
          transform: 'translate(50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-bottom-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          bottom: '-2rem', 
          left: '-2rem',
          transform: 'translate(-50%, 50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-bottom-middle") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          bottom: '-2rem', 
          left: '50%',
          transform: 'translate(-50%, 50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-bottom-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          bottom: '-2rem', 
          right: '-2rem',
          transform: 'translate(50%, 50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  // Float positioning (for side-by-side with other content)
  if (position === "float-left") {
    return (
      <section
        ref={sectionRef}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="w-full flex justify-start px-4 md:px-8 py-4"
      >
        <div className={showBorder ? "border border-black inline-block" : "inline-block"}>
          {imageContent}
        </div>
      </section>
    );
  }

  if (position === "float-right") {
    return (
      <section
        ref={sectionRef}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="w-full flex justify-end px-4 md:px-8 py-4"
      >
        <div className={showBorder ? "border border-black inline-block" : "inline-block"}>
          {imageContent}
        </div>
      </section>
    );
  }

  // Default: centered
  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-10 px-4"
    >
      <div className={showBorder ? "border border-black inline-block" : "inline-block"}>
        {imageContent}
      </div>
    </section>
  );
};

export default Graphic;
