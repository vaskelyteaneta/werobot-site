"use client";

import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  link: any;
}

export default function Navigation() {
  const [headerNav, setHeaderNav] = useState<NavItem[]>([]);
  const [footerNav, setFooterNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔵 Navigation component mounted, fetching data...");
    async function fetchNavigation() {
      try {
        console.log("📡 Fetching from /api/navigation...");
        const response = await fetch("/api/navigation");
        console.log("📥 Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Navigation data received:", data);
          console.log("📋 Header nav items:", data.header_navigation);
          console.log("📋 Footer nav items:", data.footer_navigation);
          if (data.header_navigation && data.header_navigation.length > 0) {
            console.log("🔍 First header item:", data.header_navigation[0]);
            console.log("🔍 First header item label:", data.header_navigation[0].label);
            console.log("🔍 First header item link:", data.header_navigation[0].link);
          }
          setHeaderNav(data.header_navigation || []);
          setFooterNav(data.footer_navigation || []);
          if (data.error) {
            setError(data.error);
          }
        } else {
          console.error("❌ API error:", response.status, response.statusText);
          setError(`API error: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Error fetching navigation:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchNavigation();
  }, []);

  // Always show something so we know the component is rendering
  if (loading) {
    return (
      <div className="w-full py-6 border-b border-black/10 text-center bg-yellow-50">
        <p className="text-sm text-gray-600">⏳ Loading navigation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-6 border-b border-red-200 bg-red-50 text-center">
        <p className="text-sm text-red-600">❌ Navigation Error: {error}</p>
        <p className="text-xs text-red-500 mt-1">Check console for details</p>
      </div>
    );
  }

  // Debug: show if no navigation items
  if (headerNav.length === 0 && footerNav.length === 0) {
    return (
      <div className="w-full py-6 border-b border-yellow-200 bg-yellow-50 text-center">
        <p className="text-sm text-yellow-700">⚠️ No navigation items found.</p>
        <p className="text-xs text-yellow-600 mt-1">Add navigation items in Prismic Settings document.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header Navigation */}
      {headerNav.length > 0 && (
        <nav className="w-full bg-transparent py-6" style={{ border: "none !important", borderBottom: "none !important", borderTop: "none !important", outline: "none" }}>
          <div className="max-w-7xl mx-auto px-4" style={{ border: "none" }}>
            <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {headerNav.map((item, index) => {
                // Extract label - KeyTextField might need .value or might be direct
                const label = (item.label as any)?.value || item.label || (item as any).label_text || (item as any).name || `Link ${index + 1}`;
                
                // Extract URL from link field (similar to NamePills)
                let linkUrl: string | null = null;
                if (item.link) {
                  const link = item.link as any;
                  
                  // Handle repeatable link field - it's an array
                  if (Array.isArray(link) && link.length > 0) {
                    // Find the Web link (link_type: 'Web') which has the actual URL
                    let selectedLink = link.find((l: any) => l.link_type === 'Web' && l.url) || link[0];
                    
                    // Extract URL from the selected link
                    if (selectedLink?.url) {
                      linkUrl = selectedLink.url;
                    } else if (selectedLink?.text) {
                      linkUrl = selectedLink.text;
                    } else if (selectedLink?.value?.url) {
                      linkUrl = selectedLink.value.url;
                    } else if (selectedLink?.value?.text) {
                      linkUrl = selectedLink.value.text;
                    }
                  } else if (link && typeof link === 'object' && !Array.isArray(link)) {
                    // Single link object (not array)
                    if (link.url) {
                      linkUrl = link.url;
                    } else if (link.text) {
                      linkUrl = link.text;
                    } else if (link.value?.url) {
                      linkUrl = link.value.url;
                    } else if (link.value?.text) {
                      linkUrl = link.value.text;
                    }
                  }
                }

                // If no URL found, skip this item
                if (!linkUrl) {
                  return null;
                }

                // Normalize anchor links: convert to lowercase and replace spaces with hyphens
                // e.g., "#ORGANIZING COMMITTEE" -> "#organizing-committee"
                if (linkUrl.startsWith("#")) {
                  const anchorPart = linkUrl.substring(1); // Remove the #
                  const normalized = anchorPart.toLowerCase().replace(/\s+/g, "-");
                  linkUrl = `#${normalized}`;
                }

                // Check if it's an anchor link (starts with #)
                const isAnchorLink = linkUrl.startsWith("#");

                return (
                  <li key={index}>
                    <a
                      href={linkUrl}
                      className="text-sm md:text-base font-light tracking-[0.15em] uppercase text-black hover:text-[#333333] transition-colors duration-200 cursor-pointer"
                      style={{ 
                        textDecoration: "none",
                        color: "#000000",
                        fontWeight: 400,
                      }}
                      onClick={(e) => {
                        if (isAnchorLink) {
                          e.preventDefault();
                          const targetId = linkUrl.substring(1); // Remove the #
                          const element = document.getElementById(targetId);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }
                      }}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}

      {/* Footer Navigation */}
      {footerNav.length > 0 && (
        <footer className="w-full border-t border-black/10 bg-white/90 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {footerNav.map((item, index) => {
                // Extract label
                const label = (item.label as any)?.value || item.label || (item as any).label_text || (item as any).name || `Link ${index + 1}`;
                
                // Extract URL from link field
                let linkUrl: string | null = null;
                if (item.link) {
                  const link = item.link as any;
                  
                  // Handle repeatable link field - it's an array
                  if (Array.isArray(link) && link.length > 0) {
                    // Find the Web link (link_type: 'Web') which has the actual URL
                    let selectedLink = link.find((l: any) => l.link_type === 'Web' && l.url) || link[0];
                    
                    if (selectedLink?.url) {
                      linkUrl = selectedLink.url;
                    } else if (selectedLink?.text) {
                      linkUrl = selectedLink.text;
                    } else if (selectedLink?.value?.url) {
                      linkUrl = selectedLink.value.url;
                    } else if (selectedLink?.value?.text) {
                      linkUrl = selectedLink.value.text;
                    }
                  } else if (link && typeof link === 'object' && !Array.isArray(link)) {
                    if (link.url) {
                      linkUrl = link.url;
                    } else if (link.text) {
                      linkUrl = link.text;
                    } else if (link.value?.url) {
                      linkUrl = link.value.url;
                    } else if (link.value?.text) {
                      linkUrl = link.value.text;
                    }
                  }
                }

                if (!linkUrl) return null;

                // Normalize anchor links: convert to lowercase and replace spaces with hyphens
                if (linkUrl.startsWith("#")) {
                  const anchorPart = linkUrl.substring(1);
                  const normalized = anchorPart.toLowerCase().replace(/\s+/g, "-");
                  linkUrl = `#${normalized}`;
                }

                const isAnchorLink = linkUrl.startsWith("#");

                return (
                  <li key={index}>
                    <a
                      href={linkUrl}
                      className="text-sm md:text-base font-light tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#000000] transition-colors duration-200"
                      style={{ textDecoration: "none" }}
                      onClick={(e) => {
                        if (isAnchorLink) {
                          e.preventDefault();
                          const targetId = linkUrl.substring(1);
                          const element = document.getElementById(targetId);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }
                      }}
                      >
                        {label}
                      </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </footer>
      )}
    </>
  );
}
