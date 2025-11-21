// slices/Herotext/index.tsx
import React from "react";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `Herotext`.
 * (Using a loose type so the project builds.)
 */
export type HerotextProps = SliceComponentProps<any>;


/**
 * Hero text slice – the yellow capsule that says “WeRobot 2026”.
 */
const Herotext = ({ slice }: HerotextProps) => {

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex justify-center pt-24 pb-12"
    >
      <div className="bg-[#F5FF6D] px-10 py-4 rounded-xl transition-shadow duration-300 hover:shadow-[8px_8px_0px_#000000]">
        <PrismicRichText
          field={slice.primary.title}
          components={{
            heading1: ({ children }) => (
              <h1 className="text-3xl md:text-4xl font-medium tracking-[0.18em] uppercase">
                {children}
              </h1>
            ),
            paragraph: ({ children }) => (
              <p className="text-2xl md:text-3xl font-medium tracking-[0.18em] uppercase">
                {children}
              </p>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default Herotext;
