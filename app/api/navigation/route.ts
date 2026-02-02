import { createClient } from "@/prismicio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = createClient();
    
    // Try to fetch the settings document
    let settings;
    try {
      settings = await client.getSingle("settings_werobot");
      console.log("✅ Found settings_werobot document");
    } catch (e) {
      try {
        settings = await client.getSingle("settings");
        console.log("✅ Found settings document");
      } catch (e2) {
        console.error("❌ Settings document not found. Tried: settings_werobot and settings");
        return NextResponse.json(
          { 
            header_navigation: [], 
            footer_navigation: [],
            error: "Settings document not found. Make sure it exists and is published."
          },
          { status: 200 }
        );
      }
    }
    
    const headerNav = settings.data.header_navigation || [];
    const footerNav = settings.data.footer_navigation || [];
    
    console.log(`📊 Navigation data: ${headerNav.length} header items, ${footerNav.length} footer items`);
    
    return NextResponse.json({
      header_navigation: headerNav,
      footer_navigation: footerNav,
    });
  } catch (error) {
    console.error("❌ Error fetching navigation:", error);
    return NextResponse.json(
      { 
        header_navigation: [], 
        footer_navigation: [],
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 200 }
    );
  }
}
