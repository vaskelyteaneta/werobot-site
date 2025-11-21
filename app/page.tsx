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
  const processedSlices: (SliceLike | { type: string; slices: SliceLike[] })[] = [];
  let i = 0;
  
  while (i < page.data.slices.length) {
    const currentSlice = page.data.slices[i];
    const nextSlice = page.data.slices[i + 1];
    
    // If current is Eventinfo and next is Graphic with absolute positioning
    if (
      currentSlice.slice_type === "eventinfo" &&
      nextSlice?.slice_type === "graphic" &&
      (nextSlice.primary as any)?.position?.startsWith("absolute")
    ) {
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
