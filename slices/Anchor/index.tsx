import { FC } from "react";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Anchor`.
 * Note: AnchorSlice type will be available after regenerating Prismic types from Slice Machine
 */
export type AnchorProps = SliceComponentProps<any>;

/**
 * Component for "Anchor" Slices.
 * Renders an invisible anchor point that anchor navigation links can scroll to.
 */
const Anchor: FC<AnchorProps> = ({ slice }) => {
  const anchorLink = (slice.primary as any)?.anchor_link as string | null | undefined;

  if (!anchorLink || typeof anchorLink !== 'string' || anchorLink.trim() === '') {
    return null;
  }

  // Normalize: lowercase, replace spaces with hyphens, trim
  const anchorId = anchorLink.trim().toLowerCase().replace(/\s+/g, "-");

  if (!anchorId) {
    return null;
  }

  return (
    <section
      id={anchorId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      aria-hidden="true"
      style={{
        // Invisible but present in DOM for scroll targeting
        height: 0,
        overflow: "hidden",
        margin: 0,
        padding: 0,
        border: "none",
        position: "relative",
      }}
    />
  );
};

export default Anchor;
