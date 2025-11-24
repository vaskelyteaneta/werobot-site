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
  const graphicImage = (slice.primary as any).graphic_image;
  const graphicPosition = (slice.primary as any).graphic_position || "absolute-top-right";
  const graphicSize = (slice.primary as any).graphic_size || "small";
  const graphicImage2 = (slice.primary as any).graphic_image_2;
  const graphicPosition2 = (slice.primary as any).graphic_position_2 || "absolute-bottom-left";
  const graphicSize2 = (slice.primary as any).graphic_size_2 || "small";

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

  // Get graphic positioning styles
  const getGraphicStyle = (position: string) => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 20,
      pointerEvents: "none",
    };

    switch (position) {
      case "absolute-top-left":
        return { ...baseStyle, top: "-2rem", left: "-2rem", transform: "translate(-50%, -50%)" };
      case "absolute-top-middle":
        return { ...baseStyle, top: "-2rem", left: "50%", transform: "translate(-50%, -50%)" };
      case "absolute-top-right":
        return { ...baseStyle, top: "-2rem", right: "-2rem", transform: "translate(50%, -50%)" };
      case "absolute-left-middle":
        return { ...baseStyle, top: "50%", left: "-2rem", transform: "translate(-50%, -50%)" };
      case "absolute-right-middle":
        return { ...baseStyle, top: "50%", right: "-2rem", transform: "translate(50%, -50%)" };
      case "absolute-bottom-left":
        return { ...baseStyle, bottom: "-2rem", left: "-2rem", transform: "translate(-50%, 50%)" };
      case "absolute-bottom-middle":
        return { ...baseStyle, bottom: "-2rem", left: "50%", transform: "translate(-50%, 50%)" };
      case "absolute-bottom-right":
        return { ...baseStyle, bottom: "-2rem", right: "-2rem", transform: "translate(50%, 50%)" };
      default:
        return { ...baseStyle, top: "-2rem", right: "-2rem", transform: "translate(50%, -50%)" };
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`w-full flex ${alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center"} mb-6 md:mb-8 px-4 md:px-8 relative`}
    >
      <div
        className={[
          containerClasses,
          "px-10 py-6",
          "rounded-xl",
          "bg-white",
          "relative",
          "z-0",
          "overflow-visible",
          alignClasses,
          "transition-shadow duration-300",
          "hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)]",
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

        {/* Render first graphic if provided */}
        {graphicImage?.url && (
          <div style={getGraphicStyle(graphicPosition)}>
            <img
              src={graphicImage.url}
              alt={graphicImage.alt || ""}
              className={`w-full h-auto ${sizeClasses[graphicSize as keyof typeof sizeClasses] || sizeClasses.small}`}
            />
          </div>
        )}

        {/* Render second graphic if provided */}
        {graphicImage2?.url && (
          <div style={getGraphicStyle(graphicPosition2)}>
            <img
              src={graphicImage2.url}
              alt={graphicImage2.alt || ""}
              className={`w-full h-auto ${sizeClasses[graphicSize2 as keyof typeof sizeClasses] || sizeClasses.small}`}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Eventinfo;
