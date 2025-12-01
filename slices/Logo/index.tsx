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
              width: `${width}px`,
              zIndex,
            }
          : undefined
      }
    >
      <div
        className="rounded-[32px] bg-white shadow-[14px_14px_0_#000000] border border-black/5 px-10 py-6 flex flex-col items-center gap-3"
        style={{
          width: useAbsolute ? "100%" : "auto",
          maxWidth: useAbsolute ? "100%" : `${width}px`,
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: "center",
        }}
      >
        {slice.primary.logo?.url ? (
          <img
            src={slice.primary.logo.url}
            alt={slice.primary.logo.alt || slice.primary.text || "Logo"}
            className="max-h-24 object-contain"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        ) : (
          <p className="text-sm text-gray-500">Upload a logo</p>
        )}
        {hasText && (
          <p className="text-xs uppercase tracking-[0.35em] text-left">
            {slice.primary.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default Logo;
