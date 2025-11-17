import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `SectionTitle`.
 */
export type SectionTitleProps = SliceComponentProps<Content.SectionTitleSlice>;

/**
 * Component for "SectionTitle" Slices.
 */
const SectionTitle: FC<SectionTitleProps> = ({ slice }) => {
  const hasTitle = slice.primary.title && slice.primary.title.length > 0;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full flex justify-center py-10 px-4"
    >
      <div className="text-center">
        {hasTitle ? (
          <PrismicRichText
            field={slice.primary.title}
            components={{
              paragraph: ({ children }) => (
                <p className="font-mono text-base md:text-lg tracking-[0.35em] uppercase">
                  {children}
                </p>
              ),
            }}
          />
        ) : (
          <p className="font-mono text-base md:text-lg tracking-[0.35em] uppercase">
            HOSTING ORGANISATIONS
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionTitle;
