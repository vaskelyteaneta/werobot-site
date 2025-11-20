// slices/Eventinfo/index.tsx
import type { JSX } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

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
const Eventinfo = ({ slice }: EventinfoProps): JSX.Element => {
  const alignment = slice.primary.alignment || "center";
  const alignClasses = alignmentClasses[alignment] ?? alignmentClasses.center;
  const showShadow = slice.primary.show_shadow ?? false;

  // Determine container width based on alignment
  const containerClasses = 
    alignment === "left" || alignment === "right"
      ? "w-full max-w-[90vw] md:max-w-[45vw]"
      : "w-full max-w-[90vw] md:max-w-[700px]";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full flex ${alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center"} mt-8 px-4 md:px-8 relative`}
    >
      <div
        className={[
          containerClasses,
          "px-10 py-6",
          "rounded-lg",
          "bg-white",
          "relative",
          "z-0",
          alignClasses,
          showShadow ? "shadow-[10px_10px_0_0_rgba(0,0,0,1)]" : "shadow-[10px_10px_0_0_rgba(0,0,0,1)]",
        ].join(" ")}
      >
        {slice.primary.text ? (
          <div className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase leading-relaxed">
            <PrismicRichText field={slice.primary.text} />
          </div>
        ) : (
          <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase leading-relaxed">
            COMING NEXT SPRING: April 23 – 25, 2026 · Berlin, Germany
          </p>
        )}
      </div>
    </section>
  );
};

export default Eventinfo;
