"use client";

import { useEffect, useState } from "react";

// Navigation component for header and footer navigation

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
    async function fetchNavigation() {
      try {
        const response = await fetch("/api/navigation");
        
        if (response.ok) {
          const data = await response.json();
          setHeaderNav(data.header_navigation || []);
          setFooterNav(data.footer_navigation || []);
          if (data.error) {
            setError(data.error);
          }
        } else {
          setError(`API error: ${response.status}`);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
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

  // If there's an error or no navigation items, return null (fail silently)
  if (error || (headerNav.length === 0 && footerNav.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Header Navigation */}
      {headerNav.length > 0 && (
        <nav className="w-full py-6" style={{ 
          backgroundColor: "transparent", 
          border: "none", 
          borderBottom: "none", 
          borderTop: "none", 
          outline: "none",
          boxShadow: "none",
          background: "transparent"
        }}>
          <div className="max-w-7xl mx-auto px-4" style={{ 
            border: "none",
            backgroundColor: "transparent",
            boxShadow: "none"
          }}>
            <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {headerNav.map((item, index) => {
                // Extract label
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
