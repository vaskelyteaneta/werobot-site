import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Anchor`.
 */
export type AnchorProps = SliceComponentProps<Content.AnchorSlice>;

/**
 * Component for "Anchor" Slices.
 * Renders an invisible anchor point that anchor navigation links can scroll to.
 */
const Anchor: FC<AnchorProps> = ({ slice }) => {
  const anchorLink = (slice.primary as any).anchor_link as string | null;

  if (!anchorLink) {
    return null;
  }

  // Normalize: lowercase, replace spaces with hyphens
  const anchorId = anchorLink.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      id={anchorId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      aria-hidden="true"
      style={{
        // Invisible but present in DOM for scroll targeting
        // Negative margin pulls the scroll target up so the content below is visible
        height: 0,
        overflow: "hidden",
        marginTop: "-1px",
        paddingTop: "1px",
      }}
    />
  );
};

export default Anchor;
