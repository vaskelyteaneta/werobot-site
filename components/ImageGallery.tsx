"use client";

import { SliceLike } from "@prismicio/react";

interface ImageGalleryProps {
  slices: SliceLike[];
}

export default function ImageGallery({ slices }: ImageGalleryProps) {
  const isGraphicGallery = slices.every((slice: any) => slice.slice_type === "graphic");

  const images = slices
    .map((slice: any) => {
      // Check for graphic_image (Graphic slices) or image (BackgroundImage slices)
      const img = slice.primary?.graphic_image || slice.primary?.image;
      const credit =
        slice.primary?.credit ||
        slice.primary?.image_credit ||
        slice.primary?.graphic_credit ||
        slice.primary?.background_credit;
      return img?.url ? { url: img.url, alt: img.alt, credit } : null;
    })
    .filter(Boolean);

  if (images.length === 0) return null;

  return (
    <section className="w-full py-8 px-6 md:py-12">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">
        {images.map((img: any, imgIndex: number) => (
          <div
            key={imgIndex}
            className={`gallery-image-wrapper w-full md:flex-1 relative overflow-hidden transition-all duration-300 border border-black${
              isGraphicGallery && imgIndex > 0 ? " mobile-hide-graphic" : ""
            }`}
            style={{
              transform: "scale(1)",
              boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4)";
              e.currentTarget.style.zIndex = "10";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
              e.currentTarget.style.zIndex = "1";
            }}
          >
            <img
              src={img.url}
              alt={img.alt || `Gallery image ${imgIndex + 1}`}
              className="w-full h-auto object-cover block"
            />
            {img.credit ? (
              <div className="absolute bottom-1 left-1 pointer-events-none bg-white/45 backdrop-blur-[2px] text-black/80 text-[10px] leading-tight px-1.5 py-0.5 rounded-[6px] border border-white/40 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                {img.credit}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

