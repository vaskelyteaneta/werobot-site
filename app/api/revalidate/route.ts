import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // Revalidate the Prismic cache tag
    revalidateTag("prismic");
    
    // Also revalidate the homepage path
    revalidatePath("/");

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
