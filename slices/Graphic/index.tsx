import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Graphic`.
 */
export type GraphicProps = SliceComponentProps<Content.GraphicSlice>;

/**
 * Graphic slice.
 */
const Graphic = ({ slice }: GraphicProps) => {
  const position = (slice.primary as any).position || "center";
  const size = slice.primary.size || "small";
  
  // Size mappings
  const sizeClasses = {
    small: "max-w-[200px] md:max-w-[250px]",
    medium: "max-w-[300px] md:max-w-[400px]",
    large: "max-w-[500px] md:max-w-[600px]",
  };

  const imageContent = slice.primary.graphic_image?.url ? (
    <img
      src={slice.primary.graphic_image.url}
      alt={slice.primary.graphic_image.alt || ""}
      className={`w-full h-auto ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.small}`}
    />
  ) : (
    <p style={{ color: "white" }}>No image selected.</p>
  );

  // Absolute positioning (for overlaying on other slices, especially Eventinfo)
  if (position === "absolute-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute top-0 left-4 md:left-8 z-20 pointer-events-none"
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute top-0 right-4 md:right-8 z-20 pointer-events-none"
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-top-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '1rem', 
          left: '1rem',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-top-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          top: '1rem', 
          right: '1rem',
          transform: 'translate(50%, -50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-bottom-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          bottom: '1rem', 
          left: '1rem',
          transform: 'translate(-50%, 50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  if (position === "absolute-bottom-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="absolute z-20 pointer-events-none"
        style={{ 
          bottom: '1rem', 
          right: '1rem',
          transform: 'translate(50%, 50%)'
        }}
      >
        {imageContent}
      </section>
    );
  }

  // Float positioning (for side-by-side with other content)
  if (position === "float-left") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="w-full flex justify-start px-4 md:px-8 py-4"
      >
        {imageContent}
      </section>
    );
  }

  if (position === "float-right") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="w-full flex justify-end px-4 md:px-8 py-4"
      >
        {imageContent}
      </section>
    );
  }

  // Default: centered
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-10 px-4"
    >
      {imageContent}
    </section>
  );
};

export default Graphic;
