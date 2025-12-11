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
  const items = (slice as any).items || [];
  const displayMode = primary?.display_mode || "single";

  // Check if we have a gallery (multiple images in items)
  const hasGallery = items && items.length > 0 && items.some((item: any) => item.image?.url);
  const galleryImages = hasGallery ? items.filter((item: any) => item.image?.url).map((item: any) => item.image) : [];

  // Gallery mode: display multiple images in a row
  if (hasGallery && galleryImages.length > 0) {
    return (
      <section
        data-slice-type={(slice as any).slice_type}
        data-slice-variation={(slice as any).variation}
        className="w-full flex justify-center py-8 px-4"
      >
        <div className="w-full max-w-7xl flex flex-row gap-4 md:gap-6">
          {galleryImages.map((img: any, index: number) => (
            <div
              key={index}
              className="gallery-image-wrapper flex-1 relative overflow-hidden"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            .gallery-image-wrapper {
              transform: scale(1);
              box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            }
            .gallery-image-wrapper:hover {
              transform: scale(1.05);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
              z-index: 10;
            }
          `
        }} />
      </section>
    );
  }

  // Single image mode (original behavior)
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
            opacity: opacityValue * 0.3, // More subtle for refined look
            filter: "grayscale(0.3) brightness(0.9) contrast(0.9)",
            mixBlendMode: "normal",
          }}
        />
      </div>
    </section>
  );
};

export default BackgroundImage;

