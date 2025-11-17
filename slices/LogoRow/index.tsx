import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `LogoRow`.
 */
export type LogoRowProps = SliceComponentProps<Content.LogoRowSlice>;

/**
 * Horizontal row of supporting-organization logos inside a white pill card.
 */
const LogoRow: FC<LogoRowProps> = ({ slice }) => {
  const logos = slice.primary.logo || [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-4"
    >
      <div
        className="w-full max-w-5xl rounded-[40px] bg-white border border-black/10 shadow-[14px_14px_0_#000000] px-8 py-6 flex flex-wrap items-center justify-center gap-8"
      >
        {logos.length > 0 ? (
          logos.map((item, index) =>
            item.logo?.url ? (
              <img
                key={item.logo.url + index}
                src={item.logo.url}
                alt={item.logo.alt || "Partner logo"}
                className="max-h-16 object-contain"
                style={{ maxWidth: "180px", width: "100%" }}
              />
            ) : null
          )
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-center text-gray-500">
            Add sponsor logos in Prismic
          </p>
        )}
      </div>
    </section>
  );
};

export default LogoRow;
