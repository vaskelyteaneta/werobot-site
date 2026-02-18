"use client";

import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  link: any;
}

export default function Footer() {
  const [footerNav, setFooterNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch("/api/navigation");
        
        if (response.ok) {
          const data = await response.json();
          setFooterNav(data.footer_navigation || []);
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

  // If no navigation items, return empty footer (structure still exists)
  if (footerNav.length === 0) {
    return <footer style={{ display: "none" }} />;
  }

  return (
    <footer 
      className="w-full mt-auto"
      style={{
        backgroundColor: "transparent",
        border: "none",
        borderTop: "none",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        outline: "none",
        boxShadow: "none",
        background: "transparent",
        margin: 0,
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4"
        style={{
          border: "none !important",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
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
                // Find the Web link first, or use the first link
                const selectedLink = link.find((l: any) => l.link_type === 'Web' && l.url) || 
                                    link.find((l: any) => l.link_type === 'Document' && l.uid) ||
                                    link[0];
                
                if (selectedLink) {
                  // Handle Document links (internal pages)
                  if (selectedLink.link_type === 'Document' && selectedLink.uid) {
                    linkUrl = `/${selectedLink.uid}`;
                  }
                  // Handle Web links
                  else if (selectedLink?.url) {
                    linkUrl = selectedLink.url;
                  } else if (selectedLink?.text) {
                    linkUrl = selectedLink.text;
                  } else if (selectedLink?.value?.url) {
                    linkUrl = selectedLink.value.url;
                  } else if (selectedLink?.value?.text) {
                    linkUrl = selectedLink.value.text;
                  }
                }
              } else if (link && typeof link === 'object' && !Array.isArray(link)) {
                // Handle Document links (internal pages)
                if (link.link_type === 'Document' && link.uid) {
                  linkUrl = `/${link.uid}`;
                }
                // Handle Web links
                else if (link.url) {
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
                  className="text-sm md:text-base font-light tracking-[0.1em] uppercase hover:text-[#333333] transition-colors duration-200"
                  style={{ 
                    textDecoration: "none",
                    color: "#000000",
                    fontWeight: 400,
                  }}
                  onClick={(e) => {
                    if (isAnchorLink) {
                      e.preventDefault();
                      const targetId = linkUrl.substring(1);
                      const element = document.getElementById(targetId);
                      if (element) {
                        // Find the section title within the section if it exists
                        const titleElement = element.querySelector('p.text-sm, p.text-base');
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
  );
}
