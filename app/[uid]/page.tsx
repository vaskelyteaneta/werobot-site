// app/[uid]/page.tsx
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { SliceLike } from "@prismicio/react";
import ImageGallery from "@/components/ImageGallery";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ uid: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  // Try multiple custom types: program, about, settings
  const pageTypes: ("program" | "about" | "settings")[] = ["program", "about", "settings"];
  
  for (const type of pageTypes) {
    try {
      const page = await client.getByUID(type as any, uid);
      const pageData = page.data as any;
      
      return {
        title: (pageData.meta_title as string) || "Werobot",
        description: (pageData.meta_description as string) || "Werobot 2026",
        openGraph: {
          title: (pageData.meta_title as string) || "Werobot",
          description: (pageData.meta_description as string) || "Werobot 2026",
          images: pageData.meta_image?.url ? [{ url: pageData.meta_image.url }] : [],
        },
      };
    } catch (error) {
      // Try next type
      continue;
    }
  }
  
  return {
    title: "Werobot",
    description: "Werobot 2026",
  };
}

export default async function Page({ params }: PageProps) {
  const { uid } = await params;
  const client = createClient();

  // Try multiple custom types: program, about, settings
  const pageTypes: ("program" | "about" | "settings")[] = ["program", "about", "settings"];
  let page: any = null;
  let pageType = null;

  for (const type of pageTypes) {
    try {
      page = await client.getByUID(type as any, uid) as any;
      pageType = type;
      break; // Found it, exit loop
    } catch (error) {
      // Try next type
      continue;
    }
  }

  if (!page) {
    notFound();
  }

  try {
    // Cast page.data to any to access slices safely
    const pageData = (page as any).data as any;
    
    // Group slices to allow graphics to overlay eventinfo boxes
    // Also group consecutive BackgroundImage slices for horizontal gallery
    const processedSlices: (SliceLike | { type: string; slices: SliceLike[] })[] = [];
    let i = 0;
    
    while (i < pageData.slices.length) {
      const currentSlice = pageData.slices[i];
      const nextSlice = pageData.slices[i + 1];
      
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
        while (j < pageData.slices.length) {
          const nextSlice = pageData.slices[j];
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
          if ((sliceOrGroup as any).type === "background_image_gallery" || (sliceOrGroup as any).type === "graphic_gallery") {
            const gallery = sliceOrGroup as { type: string; slices: SliceLike[] };
            return (
              <ImageGallery key={`gallery-${index}`} slices={gallery.slices} />
            );
          }
          return (
            <div key={`slice-wrapper-${index}`}>
              <SliceZone
                slices={[sliceOrGroup as SliceLike]}
                components={components}
              />
            </div>
          );
        })}
      </main>
    );
  } catch (error) {
    // If there's an error rendering, return 404
    notFound();
  }
}

// Generate static params for pages (optional - for static generation)
export async function generateStaticParams() {
  const client = createClient();
  
  const pageTypes: ("program" | "about" | "settings")[] = ["program", "about", "settings"];
  const allPages: { uid: string }[] = [];
  
  for (const type of pageTypes) {
    try {
      const pages = await client.getAllByType(type as any);
      allPages.push(...pages
        .filter((page) => page.uid !== null && page.uid !== undefined)
        .map((page) => ({
          uid: page.uid as string,
        })));
    } catch (error) {
      // Type doesn't exist, skip it
      continue;
    }
  }
  
  return allPages;
}
