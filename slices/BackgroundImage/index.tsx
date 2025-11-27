"use client";

import { SliceComponentProps } from "@prismicio/react";
import { SliceLike } from "@prismicio/react";

export type BackgroundImageProps = SliceComponentProps<SliceLike>;

const BackgroundImage = ({ slice }: BackgroundImageProps) => {
  const primary = (slice as any).primary;
  const image = primary?.image;
  const position = primary?.position || "center";
  const opacity = primary?.opacity || "30";
  const size = primary?.size || "medium";

  if (!image?.url) return null;

  const sizeClasses = {
    small: "max-w-[300px] max-h-[300px]",
    medium: "max-w-[500px] max-h-[500px]",
    large: "max-w-[800px] max-h-[800px]",
    full: "w-full h-full",
  };

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "center-left": "top-1/2 left-4 -translate-y-1/2",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "center-right": "top-1/2 right-4 -translate-y-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  };

  const opacityValue = parseInt(opacity) / 100;

  return (
    <section
      data-slice-type={(slice as any).slice_type}
      data-slice-variation={(slice as any).variation}
      className="fixed inset-0 pointer-events-none z-[1]"
    >
      <div
        className={`absolute ${positionClasses[position as keyof typeof positionClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`}
      >
        <img
          src={image.url}
          alt={image.alt || ""}
          className="w-full h-full object-contain"
          style={{
            opacity: opacityValue,
            filter: "brightness(0.6) contrast(0.85) saturate(0.8)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </section>
  );
};

export default BackgroundImage;

