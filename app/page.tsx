// app/page.tsx
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { SliceLike } from "@prismicio/react";

export default async function Page() {
  const client = createClient();

  // "homepage" = the API ID of your Page type in Prismic
  const page = await client.getSingle("homepage");
  
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
    
    // Group consecutive BackgroundImage slices for horizontal gallery
    if (currentSlice.slice_type === "background_image") {
      const backgroundImageGroup: SliceLike[] = [currentSlice];
      let j = i + 1;
      while (j < page.data.slices.length && page.data.slices[j].slice_type === "background_image") {
        backgroundImageGroup.push(page.data.slices[j]);
        j++;
      }
      if (backgroundImageGroup.length > 1) {
        processedSlices.push({
          type: "background_image_gallery",
          slices: backgroundImageGroup,
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
  
  return (
    <main>
      {processedSlices.map((sliceOrGroup, index) => {
        if ((sliceOrGroup as any).type === "grouped") {
          const group = sliceOrGroup as { type: string; slices: SliceLike[] };
          return (
            <div key={`group-${index}`} className="relative w-full overflow-visible">
              <SliceZone slices={group.slices} components={components} />
            </div>
          );
        }
        if ((sliceOrGroup as any).type === "background_image_gallery") {
          const gallery = sliceOrGroup as { type: string; slices: SliceLike[] };
          const images = gallery.slices.map((slice: any) => slice.primary?.image).filter(Boolean);
          
          if (images.length > 0) {
            return (
              <section
                key={`gallery-${index}`}
                className="w-full flex justify-center py-8 px-4"
              >
                <div className="w-full max-w-7xl flex flex-row gap-4 md:gap-6">
                  {images.map((img: any, imgIndex: number) => (
                    <div
                      key={imgIndex}
                      className="gallery-image-wrapper flex-1 relative overflow-hidden"
                      style={{
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `Gallery image ${imgIndex + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .gallery-image-wrapper {
                      transform: scale(1);
                      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
                    }
                    .gallery-image-wrapper:hover {
                      transform: scale(1.05);
                      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                      z-index: 10;
                    }
                  `
                }} />
              </section>
            );
          }
        }
        return (
          <SliceZone
            key={`slice-${index}`}
            slices={[sliceOrGroup as SliceLike]}
            components={components}
          />
        );
      })}
    </main>
  );
}
