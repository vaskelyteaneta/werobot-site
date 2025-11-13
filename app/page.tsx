// app/page.tsx
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();

  // "homepage" = the API ID of your Page type in Prismic
  const page = await client.getSingle("homepage");

  return (
    <main>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
