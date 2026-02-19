import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Logo`.
 */
export type LogoProps = SliceComponentProps<Content.LogoSlice>;

/**
 * Component for "Logo" Slices.
 */
const Logo: FC<LogoProps> = ({ slice }) => {
  const rawOffsetX = slice.primary.desktop_offset_x;
  const rawOffsetY = slice.primary.desktop_offset_y;
  const width = slice.primary.desktop_width ?? 360;
  const zIndex = slice.primary.z_index ?? 1;
  const rotation = slice.primary.rotation ?? 0;
  const hasText = Boolean(slice.primary.text);

  const useAbsolute =
    typeof rawOffsetX === "number" && typeof rawOffsetY === "number";

  const offsetX = rawOffsetX ?? 0;
  const offsetY = rawOffsetY ?? 0;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={[
        "w-full",
        "py-10 px-4",
        useAbsolute
          ? "lg:px-0 relative lg:absolute flex justify-center lg:justify-start"
          : "flex justify-center",
      ].join(" ")}
      style={
        useAbsolute
          ? {
              top: offsetY,
              left: offsetX,
              zIndex,
            }
          : undefined
      }
    >
      <div
        className="border border-black bg-transparent px-10 py-6 flex flex-col items-center gap-3 transition-all duration-300 hover:border-[#1a1a1a] w-full max-w-[90vw] md:max-w-[700px]"
        style={{
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: "center",
        }}
      >
        {slice.primary.logo?.url ? (
          <img
            src={slice.primary.logo.url}
            alt={slice.primary.logo.alt || slice.primary.text || "Logo"}
            className="object-contain"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        ) : (
          <p className="text-sm text-[#6b6b6b] font-light">Upload a logo</p>
        )}
        {hasText && (
          <p className="text-xs uppercase tracking-[0.2em] text-left font-light text-[#6b6b6b]">
            {slice.primary.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default Logo;
