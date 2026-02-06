"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavItem {
  label: string;
  link: any;
}

export default function PageNavigation() {
  const [pageNav, setPageNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch("/api/navigation");
        
        if (response.ok) {
          const data = await response.json();
          setPageNav(data.page_navigation || []);
        }
      } catch (error) {
        // Fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchNavigation();
  }, []);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If no navigation items, return null
  if (pageNav.length === 0) {
    return null;
  }

  return (
    <nav 
      className="w-full py-4" 
      style={{ 
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        boxShadow: "none",
        background: "transparent",
        margin: 0,
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4" 
        style={{ 
          border: "none !important",
          backgroundColor: "transparent",
          boxShadow: "none",
          margin: 0
        }}
      >
        <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {pageNav.map((item, index) => {
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

            // Only show page links (not anchor links)
            // Page links start with / or are full URLs
            const isPageLink = linkUrl.startsWith("/") || linkUrl.startsWith("http://") || linkUrl.startsWith("https://");
            
            if (!isPageLink) {
              return null;
            }

            return (
              <li key={index}>
                <Link
                  href={linkUrl}
                  className="text-sm md:text-base font-light tracking-[0.15em] uppercase text-black hover:text-[#333333] transition-colors duration-200 cursor-pointer"
                  style={{ 
                    textDecoration: "none",
                    color: "#000000",
                    fontWeight: 400,
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
