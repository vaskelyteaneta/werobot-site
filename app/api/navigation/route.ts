import { createClient } from "@/prismicio";
import { NextResponse } from "next/server";
import type { SettingsWerobotDocument } from "@/prismicio-types";

export async function GET() {
  try {
    const client = createClient();
    
    // Fetch the settings_werobot document
    const settings = await client.getSingle("settings_werobot");
    
    // Type guard: check if this is a SettingsWerobotDocument
    if (settings.type !== "settings_werobot") {
      return NextResponse.json(
        { 
          header_navigation: [], 
          footer_navigation: [],
          anchor_navigation: [],
          error: "Invalid settings document type"
        },
        { status: 200 }
      );
    }
    
    // TypeScript now knows this is SettingsWerobotDocument
    const settingsWerobot = settings as SettingsWerobotDocument;
    const settingsData = settingsWerobot.data as any;
    const headerNav = settingsData.header_navigation || [];
    const footerNav = settingsData.footer_navigation || [];
    // Page navigation - if it exists, use it; otherwise filter page links from header_navigation
    const pageNav = settingsData.page_navigation || [];
    
    // Also fetch anchor navigation from homepage
    let anchorNav: any[] = [];
    try {
      const homepage = await client.getSingle("homepage");
      const homepageData = homepage.data as any;
      anchorNav = homepageData.anchor_navigation || [];
    } catch {
      // Homepage might not exist, that's fine
    }
    
    return NextResponse.json({
      header_navigation: headerNav,
      footer_navigation: footerNav,
      page_navigation: pageNav,
      anchor_navigation: anchorNav,
    });
  } catch (error) {
    // If settings_werobot doesn't exist, return empty navigation
    return NextResponse.json(
      { 
        header_navigation: [], 
        footer_navigation: [],
        anchor_navigation: [],
        error: error instanceof Error ? error.message : "Settings document not found"
      },
      { status: 200 }
    );
  }
}
