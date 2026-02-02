import { createClient } from "@/prismicio";
import { NextResponse } from "next/server";
import type { SettingsWerobotDocument } from "@/prismicio-types";

export async function GET() {
  try {
    const client = createClient();
    
    // Try to fetch the settings document
    let settings: SettingsWerobotDocument | null = null;
    try {
      settings = await client.getSingle("settings_werobot") as SettingsWerobotDocument;
    } catch (e) {
      // If settings_werobot doesn't exist, return empty navigation
      return NextResponse.json(
        { 
          header_navigation: [], 
          footer_navigation: [],
          error: "Settings document not found. Make sure settings_werobot exists and is published."
        },
        { status: 200 }
      );
    }
    
    // TypeScript now knows settings is SettingsWerobotDocument, so these fields exist
    const headerNav = settings.data.header_navigation || [];
    const footerNav = settings.data.footer_navigation || [];
    
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
