"use client";

import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { gsap } from "gsap";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

/**
 * Props for `PaperCards`.
 */
export type PaperCardsProps = SliceComponentProps<Content.PaperCardsSlice>;


/**
 * Component for "PaperCards" Slices.
 */
const PaperCards: FC<PaperCardsProps> = ({ slice }) => {
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
    const title = item.title;
    const name = item.name;
    const description = item.description;
    const link = item.link;

    return (
      <div
        key={index}
        className="border border-black bg-transparent p-6 transition-all duration-300 hover:border-[#1a1a1a]"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Always use the same document icon */}
        <div className="w-full aspect-square overflow-hidden flex items-center justify-center bg-white">
          <img
            src="/file-image.png"
            alt="Paper document"
            className="w-full h-full object-contain"
          />
        </div>
        
        {title && (
          <h3 className="text-lg md:text-xl font-light tracking-[0.05em] text-black">
            {title}
          </h3>
        )}
        
        {name && (
          <div className="text-sm text-[#6b6b6b] font-light tracking-[0.05em]">
            {name}
          </div>
        )}
        
        {description && (
          <div className="text-sm md:text-base tracking-[0.05em] leading-relaxed text-black font-light">
            <PrismicRichText field={description} />
          </div>
        )}
        
        {link && (
          <div className="mt-auto">
            <PrismicLink
              field={link}
              className="text-sm md:text-base font-light tracking-[0.1em] uppercase text-black hover:text-[#333333] transition-colors duration-200 underline"
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

  // Use Splide carousel if more than 3 cards, otherwise use grid
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
                640: {
                  perPage: 1,
                },
              },
            }}
            aria-label="Paper Cards"
          >
            {content.map((item: any, index: number) => (
              <SplideSlide key={index}>
                {renderCard(item, index)}
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item: any, index: number) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PaperCards;
