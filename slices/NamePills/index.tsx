"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicLink, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `NamePills`.
 */
export type NamePillsProps = SliceComponentProps<Content.NamePillsSlice>;

/**
 * Component for "NamePills" Slices.
 */
const NamePills: FC<NamePillsProps> = ({ slice }) => {
  const pills = slice.primary.pills ?? [];
  const hasTitle = Boolean(slice.primary.section_title);
  const layout = (slice.primary as any).layout || "wrap";
  const isColumnLayout = layout === "columns";

  // Define the 5 colors from the palette
  const hoverColors = [
    "#FFF461", // bright pale yellow
    "#DEAE54", // warm golden-brown
    "#FFB366", // light orange/peach (estimated)
    "#DE548B", // muted rose/dusty pink
    "#C06DFA", // vibrant light purple
  ];

  // Get hover color for a specific index
  const getHoverColor = (index: number) => hoverColors[index % hoverColors.length];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex flex-col items-center gap-8 py-12 px-4"
    >
      {hasTitle && (
        <p className="font-mono text-base tracking-[0.35em] uppercase text-center">
          {slice.primary.section_title}
        </p>
      )}

      {isColumnLayout ? (
        // Three-column layout
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {pills.length > 0 ? (
            pills.map((item, index) => {
              const content = (
                <span className="font-mono text-sm tracking-[0.1em]">
                  {item.text || "Name"}
                </span>
              );

              const hoverColor = getHoverColor(index);
              const basePillClass = "inline-flex items-center justify-center rounded-lg px-8 py-3 shadow-[10px_10px_0_0_rgba(0,0,0,0)] hover:shadow-[10px_10px_0_#000000] transition-all duration-300";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{
                    backgroundColor: "#FACC15", // yellow-400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FACC15";
                  }}
                >
                  {content}
                </PrismicLink>
              ) : (
                <div
                  key={`${item.text || index}-static`}
                  className={basePillClass}
                  style={{
                    backgroundColor: "#FACC15", // yellow-400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FACC15";
                  }}
                >
                  {content}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 font-mono uppercase tracking-[0.2em] col-span-3 text-center">
              Add names to the NamePills slice in Prismic.
            </p>
          )}
        </div>
      ) : (
        // Original wrap layout
        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-6">
          {pills.length > 0 ? (
            pills.map((item, index) => {
              const content = (
                <span className="font-mono text-sm tracking-[0.1em]">
                  {item.text || "Name"}
                </span>
              );

              const hoverColor = getHoverColor(index);
              const basePillClass = "inline-flex items-center justify-center rounded-lg px-8 py-3 shadow-[10px_10px_0_0_rgba(0,0,0,0)] hover:shadow-[10px_10px_0_#000000] transition-all duration-300";

              const hasLink = item.link && isFilled.link(item.link);

              return hasLink ? (
                <PrismicLink
                  key={`${item.text}-${index}`}
                  field={item.link}
                  className={basePillClass}
                  style={{ 
                    minWidth: "180px",
                    backgroundColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {content}
                </PrismicLink>
              ) : (
                <div
                  key={`${item.text || index}-static`}
                  className={basePillClass}
                  style={{ 
                    minWidth: "180px",
                    backgroundColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {content}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 font-mono uppercase tracking-[0.2em]">
              Add names to the NamePills slice in Prismic.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default NamePills;
