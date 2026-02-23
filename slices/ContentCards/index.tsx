"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { gsap } from "gsap";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

/**
 * Props for `ContentCards`.
 */
export type ContentCardsProps = SliceComponentProps<Content.ContentCardsSlice>;

/**
 * Component for "ContentCards" Slices.
 */
const ContentCards: FC<ContentCardsProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const content = (slice.primary as any).content || [];

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              sectionRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!content || content.length === 0) {
    return null;
  }

  // Render card content
  const renderCard = (item: any, index: number) => {
    const image = item.image;
    const title = item.title;
    const name = item.name;
    const date = item.date;
    const description = item.description;
    const link = item.link;

    // Format date if it exists
    let formattedDate = "";
    if (date) {
      try {
        const dateObj = new Date(date);
        formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      } catch (e) {
        formattedDate = date;
      }
    }

    return (
      <div
        key={index}
        className="border border-black bg-transparent p-4 md:p-6 transition-all duration-300 group"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "rgba(209, 228, 246, 0.4)";
          el.style.backdropFilter = "blur(12px)";
          el.style.setProperty("-webkit-backdrop-filter", "blur(12px)");
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "transparent";
          el.style.backdropFilter = "none";
          el.style.setProperty("-webkit-backdrop-filter", "none");
        }}
      >
        {image?.url && (
          <div className="w-full aspect-square overflow-hidden border border-black">
            <img
              src={image.url}
              alt={image.alt || title || "Content card image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {title && (
          <h3 className="text-base font-light tracking-[0.05em] text-black">
            {title}
          </h3>
        )}
        
        {(name || formattedDate) && (
          <div className="text-sm text-[#6b6b6b] font-light tracking-[0.05em]">
            {name && <span>{name}</span>}
            {name && formattedDate && <span> • </span>}
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        )}
        
        {description && (
          <div className="text-sm tracking-[0.05em] leading-relaxed text-black font-light">
            <PrismicRichText field={description} />
          </div>
        )}
        
        {link && (
          <div className="mt-auto">
            <PrismicLink
              field={link}
              className="text-sm font-light tracking-[0.05em] text-black hover:text-[#333333] transition-colors duration-200 underline"
              style={{
                textDecoration: "underline",
                color: "#000000",
              }}
            >
              Learn more →
            </PrismicLink>
          </div>
        )}
      </div>
    );
  };

  // Use Splide carousel if more than 3 cards, but only on desktop
  // On mobile, always use grid layout
  const useCarousel = content.length > 3;

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-12 px-4"
    >
      <div className="w-full max-w-7xl">
        {useCarousel ? (
          <>
            {/* Desktop: Show carousel */}
            <div className="hidden md:block">
              <Splide
                options={{
                  type: "slide",
                  perPage: 3,
                  perMove: 1,
                  gap: "2rem",
                  pagination: false,
                  arrows: true,
                  breakpoints: {
                    1024: {
                      perPage: 2,
                    },
                  },
                }}
                aria-label="Content Cards"
              >
                {content.map((item: any, index: number) => (
                  <SplideSlide key={index}>
                    {renderCard(item, index)}
                  </SplideSlide>
                ))}
              </Splide>
            </div>
            {/* Mobile: Show stacked grid */}
            <div className="block md:hidden">
              <div className="grid grid-cols-1 gap-8">
                {content.map((item: any, index: number) => renderCard(item, index))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item: any, index: number) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentCards;
