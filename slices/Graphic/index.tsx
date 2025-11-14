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
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      {slice.primary.graphic_image?.url ? (
        <img
          src={slice.primary.graphic_image.url}
          alt={slice.primary.graphic_image.alt || ""}
          style={{
            maxWidth: "600px",
            width: "100%",
            height: "auto",
          }}
        />
      ) : (
        <p style={{ color: "white" }}>No image selected.</p>
      )}
    </section>
  );
};

export default Graphic;
