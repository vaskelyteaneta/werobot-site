"use client";

import { SliceLike } from "@prismicio/react";

interface ImageGalleryProps {
  slices: SliceLike[];
}

export default function ImageGallery({ slices }: ImageGalleryProps) {
  const images = slices
    .map((slice: any) => {
      // Check for graphic_image (Graphic slices) or image (BackgroundImage slices)
      const img = slice.primary?.graphic_image || slice.primary?.image;
      return img?.url ? img : null;
    })
    .filter(Boolean);

  if (images.length === 0) return null;

  return (
    <section className="w-full py-8 px-4 md:py-12">
      <div className="w-full max-w-7xl mx-auto flex flex-row gap-4 md:gap-6">
        {images.map((img: any, imgIndex: number) => (
          <div
            key={imgIndex}
            className="gallery-image-wrapper flex-1 relative overflow-hidden transition-all duration-300"
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
          </div>
        ))}
      </div>
    </section>
  );
}

