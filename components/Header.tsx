"use client";

import { useEffect, useState } from "react";

interface NavItem {
  name?: string;
  anchor_link?: string;
  label?: string;
  link?: any;
}

interface HeaderProps {
  anchorNavigation?: NavItem[];
}

export default function Header({ anchorNavigation }: HeaderProps) {
  const [headerNav, setHeaderNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If anchorNavigation is passed as prop, use it directly
    if (anchorNavigation && anchorNavigation.length > 0) {
      setHeaderNav(anchorNavigation);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API (fallback for backwards compatibility)
    async function fetchNavigation() {
      try {
        const response = await fetch("/api/navigation");
        
        if (response.ok) {
          const data = await response.json();
          setHeaderNav(data.header_navigation || []);
        }
      } catch (error) {
        // Fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchNavigation();
  }, [anchorNavigation]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If no navigation items, return empty header (structure still exists)
  if (headerNav.length === 0) {
    return <header style={{ display: "none" }} />;
  }

  return (
    <header>
      <nav 
        className="w-full py-6" 
        style={{ 
          backgroundColor: "transparent",
          border: "none",
          borderBottom: "none",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          outline: "none",
          boxShadow: "none",
          background: "transparent",
          margin: 0,
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          borderWidth: 0
        }}
      >
        <div 
          className="max-w-7xl mx-auto px-4" 
          style={{ 
            border: "none !important",
            borderBottom: "none !important",
            borderTop: "none !important",
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0
          }}
        >
          <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {headerNav.map((item, index) => {
              // Extract label - support both new structure (name) and old structure (label)
              const nameValue = typeof item.name === 'string' ? item.name : (item.name as any)?.value;
              const labelValue = typeof item.label === 'string' ? item.label : (item.label as any)?.value;
              const label = nameValue || labelValue || (item as any).label_text || `Link ${index + 1}`;
              
              // Extract URL - support both new structure (anchor_link) and old structure (link)
              let linkUrl: string | null = null;
              
              // New structure: anchor_link field (KeyTextField is usually a string)
              if (item.anchor_link) {
                const anchorLink = item.anchor_link as any;
                linkUrl = typeof anchorLink === 'string' ? anchorLink : (anchorLink?.value || anchorLink || null);
              }
              
              // Old structure: link field (fallback)
              if (!linkUrl && item.link) {
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
              
              // Ensure anchor links start with #
              if (!linkUrl.startsWith("#") && !linkUrl.startsWith("http")) {
                linkUrl = `#${linkUrl}`;
              }

              // Normalize anchor links: convert to lowercase and replace spaces with hyphens
              if (linkUrl.startsWith("#")) {
                const anchorPart = linkUrl.substring(1);
                const normalized = anchorPart.toLowerCase().replace(/\s+/g, "-");
                linkUrl = `#${normalized}`;
              }

              // Check if it's an anchor link (starts with #)
              // Header only shows anchor links, not page links
              const isAnchorLink = linkUrl.startsWith("#");
              
              // Skip page links (they go to PageNavigation component)
              if (!isAnchorLink) {
                return null;
              }

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
                        const targetId = linkUrl.substring(1);
                        
                        // Try to find the element by ID - try multiple variations
                        let element = document.getElementById(targetId);
                        
                        // If not found, try common variations
                        if (!element) {
                          // Try with "call-for-" prefix (for papers section)
                          if (targetId === "papers") {
                            element = document.getElementById("call-for-papers");
                          }
                          // Try with dashes instead of spaces
                          const dashedId = targetId.replace(/\s+/g, "-");
                          if (!element && dashedId !== targetId) {
                            element = document.getElementById(dashedId);
                          }
                          // Try finding by data attribute or section
                          if (!element) {
                            const sections = document.querySelectorAll(`section[id*="${targetId}"], div[id*="${targetId}"]`);
                            if (sections.length > 0) {
                              element = sections[0] as HTMLElement;
                            }
                          }
                        }
                        
                        if (element) {
                          // Find the section title within the section if it exists
                          const titleElement = element.querySelector('p.text-sm, p.text-base, h1, h2, h3');
                          const targetElement = titleElement || element;
                          
                          // Calculate actual header height dynamically
                          const header = document.querySelector('header');
                          const headerHeight = header ? header.getBoundingClientRect().height : 100;
                          
                          // Large offset to ensure title is fully visible with padding
                          // Increased padding to prevent title from being cut off
                          const extraPadding = 100; // Extra space to ensure title is fully visible
                          const offset = headerHeight + extraPadding;
                          
                          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                          const offsetPosition = elementPosition - offset;
                          
                          window.scrollTo({
                            top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
                            behavior: "smooth"
                          });
                        } else {
                          // Debug: log if element not found
                          console.warn(`Anchor element not found for ID: ${targetId}`);
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
    </header>
  );
}
