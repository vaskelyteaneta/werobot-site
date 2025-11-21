import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Banner`.
 */
export type BannerProps = SliceComponentProps<Content.BannerSlice>;

/**
 * Component for "Banner" Slices.
 */
const Banner: FC<BannerProps> = ({ slice }) => {
  const label = slice.primary.button_text || "WHAT WEROBOT OFFERS";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-4"
    >
      <div
        className="inline-flex rounded-xl transition-shadow duration-300 hover:shadow-[12px_12px_0_#000000] uppercase font-mono"
        style={{
          backgroundColor: "#F5FF6B",
          padding: "22px 80px",
          letterSpacing: "0.15em",
          fontSize: "22px",
        }}
      >
        {label}
      </div>
    </section>
  );
};

export default Banner;
