import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

/**
 * Props for `CtaBanner`.
 */
export type CtaBannerProps = SliceComponentProps<Content.CtaBannerSlice>;

/**
 * CTA Banner slice – yellow button "GET THE TICKET".
 */
const CtaBanner = ({ slice }: CtaBannerProps) => {
  const label = slice.primary.button_text || "GET THE TICKET";
  const link = slice.primary.button_link;

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
      {link ? (
        <PrismicLink
          field={link}
          style={{
            display: "inline-block",
            padding: "22px 80px",
            backgroundColor: "#F5FF6B",
            color: "#000000",
            borderRadius: "999px",
            boxShadow: "12px 12px 0px #000000",
            fontFamily: "monospace",
            fontSize: "22px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {label}
        </PrismicLink>
      ) : (
        <button
          disabled
          style={{
            padding: "22px 80px",
            backgroundColor: "#888888",
            color: "#000000",
            borderRadius: "999px",
            fontFamily: "monospace",
            fontSize: "22px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {label}
        </button>
      )}
    </section>
  );
};

export default CtaBanner;
