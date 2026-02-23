// app/page.tsx
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { SliceLike } from "@prismicio/react";
import ImageGallery from "@/components/ImageGallery";
import Header from "@/components/Header";

export default async function Page() {
  const client = createClient();

  // "homepage" = the API ID of your Page type in Prismic
  const page = await client.getSingle("homepage");
  const pageData = page.data as any;
  
  // Extract anchor navigation from homepage
  const anchorNavigation = pageData.anchor_navigation || [];
  
  // Group slices to allow graphics to overlay eventinfo boxes
  // Also group consecutive BackgroundImage slices for horizontal gallery
  const processedSlices: (SliceLike | { type: string; slices: SliceLike[] })[] = [];
  let i = 0;
  
  while (i < page.data.slices.length) {
    const currentSlice = page.data.slices[i];
    const nextSlice = page.data.slices[i + 1];
    
    // If current is Eventinfo and next is Graphic with absolute positioning
    const nextPosition = (nextSlice?.primary as any)?.position;
    const shouldGroupEventinfo = 
      currentSlice.slice_type === "eventinfo" &&
      nextSlice?.slice_type === "graphic" &&
      nextPosition &&
      (nextPosition.startsWith("absolute") || nextPosition.includes("absolute"));
    
    // Group consecutive Graphic slices for horizontal gallery
    // Only group Graphics that are NOT using absolute positioning (those overlay other content)
    if (currentSlice.slice_type === "graphic") {
      const currentPosition = (currentSlice.primary as any)?.position;
      // Skip absolute positioned graphics (they overlay other content)
      if (currentPosition && currentPosition.startsWith("absolute")) {
        processedSlices.push(currentSlice);
        i += 1;
        continue;
      }
      
      // Group consecutive non-absolute Graphic slices
      const graphicGroup: SliceLike[] = [currentSlice];
      let j = i + 1;
      while (j < page.data.slices.length) {
        const nextSlice = page.data.slices[j];
        if (nextSlice.slice_type === "graphic") {
          const nextPosition = (nextSlice.primary as any)?.position;
          // Only add if it's not absolute positioned
          if (!nextPosition || !nextPosition.startsWith("absolute")) {
            graphicGroup.push(nextSlice);
            j++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // Group if we have 2 or more images
      if (graphicGroup.length >= 2) {
        processedSlices.push({
          type: "graphic_gallery",
          slices: graphicGroup,
        });
        i = j;
        continue;
      }
    }
    
    if (shouldGroupEventinfo) {
      processedSlices.push({
        type: "grouped",
        slices: [currentSlice, nextSlice],
      });
      i += 2;
    } else {
      processedSlices.push(currentSlice);
      i += 1;
    }
  }
  
  // Pre-calculate which graphics should be hidden on mobile
  // Only hide when two non-absolute graphics are DIRECTLY next to each other
  // If there's other content between them, both stay visible
  const hideOnMobileMap = new Set<number>();
  
  const isNonAbsoluteGraphic = (item: any) => {
    if (item.type === "graphic_gallery") return true;
    if (item.slice_type === "graphic") {
      const pos = item.primary?.position;
      return !pos || !String(pos).startsWith("absolute");
    }
    return false;
  };
  
  for (let idx = 1; idx < processedSlices.length; idx++) {
    const prev = processedSlices[idx - 1] as any;
    const curr = processedSlices[idx] as any;
    // If two non-absolute graphics are right next to each other, hide the 2nd on mobile
    if (isNonAbsoluteGraphic(prev) && isNonAbsoluteGraphic(curr)) {
      hideOnMobileMap.add(idx);
    }
  }

  return (
    <main>
      {processedSlices.map((sliceOrGroup, index) => {
        const hideOnMobile = hideOnMobileMap.has(index);

        if ((sliceOrGroup as any).type === "grouped") {
          const group = sliceOrGroup as { type: string; slices: SliceLike[] };
          return (
            <div key={`group-${index}`} className="relative w-full overflow-visible">
              <SliceZone slices={group.slices} components={components} />
            </div>
          );
        }
        if ((sliceOrGroup as any).type === "background_image_gallery" || (sliceOrGroup as any).type === "graphic_gallery") {
          const gallery = sliceOrGroup as { type: string; slices: SliceLike[] };
          return (
            <div key={`gallery-${index}`} className={hideOnMobile ? "mobile-hide-graphic" : ""}>
              <ImageGallery slices={gallery.slices} />
            </div>
          );
        }
        // First slice is the big weROBOT logo — hide it on mobile (replaced by small fixed logo in nav)
        const hideFirstOnMobile = index === 0;

        return (
          <div key={`slice-wrapper-${index}`}>
            <div className={hideOnMobile ? "mobile-hide-graphic" : hideFirstOnMobile ? "hidden md:block" : ""}>
              <SliceZone
                slices={[sliceOrGroup as SliceLike]}
                components={components}
              />
            </div>
            {/* Add anchor navigation after the first slice (hero/logo) - only on homepage */}
            {index === 0 && anchorNavigation.length > 0 && <Header anchorNavigation={anchorNavigation} />}
          </div>
        );
      })}
    </main>
  );
}
