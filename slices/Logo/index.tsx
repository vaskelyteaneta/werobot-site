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
  const offsetX = slice.primary.desktop_offset_x ?? 0;
  const offsetY = slice.primary.desktop_offset_y ?? 0;
  const width = slice.primary.desktop_width ?? 360;
  const zIndex = slice.primary.z_index ?? 1;
  const rotation = slice.primary.rotation ?? 0;
  const hasText = Boolean(slice.primary.text);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-10 px-4 lg:px-0 relative lg:absolute"
      style={{
        top: offsetY,
        left: offsetX,
        width: `${width}px`,
        zIndex,
      }}
    >
      <div
        className="w-full rounded-[32px] bg-white shadow-[14px_14px_0_#000000] border border-black/5 px-10 py-6 flex flex-col items-center gap-3"
        style={{
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
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-center">
            {slice.primary.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default Logo;
