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
          error: "Invalid settings document type"
        },
        { status: 200 }
      );
    }
    
    // TypeScript now knows this is SettingsWerobotDocument
    const settingsWerobot = settings as SettingsWerobotDocument;
    const headerNav = settingsWerobot.data.header_navigation || [];
    const footerNav = settingsWerobot.data.footer_navigation || [];
    
    return NextResponse.json({
      header_navigation: headerNav,
      footer_navigation: footerNav,
    });
  } catch (error) {
    // If settings_werobot doesn't exist, return empty navigation
    return NextResponse.json(
      { 
        header_navigation: [], 
        footer_navigation: [],
        error: error instanceof Error ? error.message : "Settings document not found"
      },
      { status: 200 }
    );
  }
}
