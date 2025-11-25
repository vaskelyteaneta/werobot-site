import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // Revalidate the homepage path (this will clear all cached data for the page including Prismic)
    await revalidatePath("/", "page");

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: "Cache revalidated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Error revalidating cache",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
