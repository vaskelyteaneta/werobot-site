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
    const imageFit = item.image_fit || "cover";
    const imagePosition = item.image_position || "center";
    const rawZoom = item.image_zoom_percent;
    const parsedZoom =
      typeof rawZoom === "number"
        ? rawZoom
        : typeof rawZoom === "string"
          ? Number.parseFloat(rawZoom)
          : NaN;
    const imageZoomPercent = Number.isFinite(parsedZoom) ? parsedZoom : 100;
    const clampedZoomPercent = Math.min(300, Math.max(10, imageZoomPercent));
    const imageZoomScale = clampedZoomPercent / 100;
    const isShrinkMode = clampedZoomPercent < 100;
    const shouldShowBlurFill = imageFit === "contain" || isShrinkMode;
    const credit = item.credit;
    const title = item.title;
    const name = item.name;
    const date = item.date;
    const description = item.description;
    const link = item.link;
    const showLearnMore = item.show_learn_more;

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
        className="border border-[#000053] bg-transparent p-4 md:p-6 transition-all duration-300 group"
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
          <div className="w-full aspect-square overflow-hidden border border-[#000053] relative">
            {shouldShowBlurFill && (
              <img
                src={image.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  objectFit: "cover",
                  objectPosition: imagePosition,
                  filter: "blur(18px)",
                  transform: "scale(1.08)",
                  opacity: 0.7,
                }}
              />
            )}
            <img
              src={image.url}
              alt={image.alt || title || "Content card image"}
              className="absolute inset-0"
              style={{
                width: isShrinkMode ? `${clampedZoomPercent}%` : "100%",
                height: isShrinkMode ? `${clampedZoomPercent}%` : "100%",
                left: "50%",
                top: "50%",
                transform: isShrinkMode
                  ? "translate(-50%, -50%)"
                  : `translate(-50%, -50%) scale(${imageZoomScale})`,
                objectFit:
                  isShrinkMode || imageFit === "contain" ? "contain" : "cover",
                objectPosition: imagePosition,
                transformOrigin: imagePosition,
                transition: "transform 0.2s ease-out",
              }}
            />
            {credit ? (
              <div className="absolute bottom-1 left-1 pointer-events-none bg-white/45 backdrop-blur-[2px] text-black/80 text-[10px] leading-tight px-1.5 py-0.5 rounded-[6px] border border-white/40 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                {credit}
              </div>
            ) : null}
          </div>
        )}
        
        {title && (
          <div className="text-base tracking-[0.05em] text-black">
            {Array.isArray(title) ? (
              <PrismicRichText
                field={title}
                components={{
                  heading1: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold text-[#000053]">{children}</h3>,
                  heading2: ({ children }) => <h4 className="text-lg md:text-xl font-semibold text-[#000053]">{children}</h4>,
                  heading3: ({ children }) => <h5 className="text-base md:text-lg font-semibold text-[#000053]">{children}</h5>,
                  paragraph: ({ children }) => <p className="font-light">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              />
            ) : (
              <h3 className="font-light">{title}</h3>
            )}
          </div>
        )}
        
        {(name || formattedDate) && (
          <div className="text-sm text-[#6b6b6b] font-light tracking-[0.05em]">
            {name && (
              Array.isArray(name) ? (
                <PrismicRichText
                  field={name}
                  components={{
                    paragraph: ({ children }) => <span>{children}</span>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    hyperlink: ({ node, children }) => (
                      <a
                        href={(node.data as any)?.url || "#"}
                        target={(node.data as any)?.target || undefined}
                        rel={(node.data as any)?.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                />
              ) : (
                <span>{name}</span>
              )
            )}
            {name && formattedDate && <span> • </span>}
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        )}
        
        {description && (
          <div className="text-sm tracking-[0.05em] leading-relaxed text-black font-light">
            <PrismicRichText
              field={description}
              components={{
                heading1: ({ children }) => (
                  <h3 className="text-xl md:text-2xl font-semibold tracking-[0.03em] text-[#000053]">
                    {children}
                  </h3>
                ),
                heading2: ({ children }) => (
                  <h4 className="text-lg md:text-xl font-semibold tracking-[0.03em] text-[#000053]">
                    {children}
                  </h4>
                ),
                heading3: ({ children }) => (
                  <h5 className="text-base md:text-lg font-semibold tracking-[0.03em] text-[#000053]">
                    {children}
                  </h5>
                ),
                paragraph: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                listItem: ({ children }) => <li className="ml-5 list-disc">{children}</li>,
                oListItem: ({ children }) => <li className="ml-5 list-decimal">{children}</li>,
                hyperlink: ({ node, children }) => (
                  <a
                    href={(node.data as any)?.url || "#"}
                    target={(node.data as any)?.target || undefined}
                    rel={(node.data as any)?.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="underline hover:text-[#000053]/80 transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        )}
        
        {link && (typeof showLearnMore === "boolean" ? showLearnMore : true) && (
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
      className="w-full flex justify-center py-12 px-6"
    >
      <div className={`w-full ${
        !useCarousel && content.length === 1 
          ? "max-w-md mx-auto" 
          : !useCarousel && content.length === 2 
          ? "max-w-4xl mx-auto" 
          : "max-w-7xl"
      }`}>
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
          <div className={`grid gap-8 ${
            content.length === 1
              ? "grid-cols-1"
              : content.length === 2 
              ? "grid-cols-1 md:grid-cols-2" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {content.map((item: any, index: number) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentCards;
