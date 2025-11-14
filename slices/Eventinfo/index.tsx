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

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center mt-8"
    >
      <div
        className={[
          "inline-flex max-w-[90vw]",
          "px-10 py-4",
          "rounded-[999px]",
          "bg-white",
          "border border-black/5",
          alignClasses,
          showShadow ? "shadow-[10px_10px_0_0_rgba(0,0,0,1)]" : "",
        ].join(" ")}
      >
        {slice.primary.text ? (
          <div className="font-mono text-xs tracking-[0.25em] uppercase">
            <PrismicRichText field={slice.primary.text} />
          </div>
        ) : (
          <p className="font-mono text-xs tracking-[0.25em] uppercase">
            COMING NEXT SPRING: April 23 – 25, 2026 · Berlin, Germany
          </p>
        )}
      </div>
    </section>
  );
};

export default Eventinfo;
