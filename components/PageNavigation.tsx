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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navigation
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navigation
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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
      className="w-full py-4 fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out" 
      style={{ 
        backgroundColor: "rgb(209, 228, 246)", // Matches page background
        border: "none",
        outline: "none",
        boxShadow: "none",
        margin: 0,
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div 
        className="max-w-7xl mx-auto px-4" 
        style={{ 
          border: "none !important",
          backgroundColor: "rgb(209, 228, 246)", // Matches page background
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
                // Find the Web link first, or use the first link
                const selectedLink = link.find((l: any) => l.link_type === 'Web' && l.url) || link[0];
                
                if (selectedLink) {
                  // Handle Document links - construct URL from UID
                  if (selectedLink.link_type === 'Document' && selectedLink.uid) {
                    linkUrl = `/${selectedLink.uid}`;
                  }
                  // Handle Web links
                  else if (selectedLink.link_type === 'Web' && selectedLink.url && typeof selectedLink.url === 'string' && selectedLink.url.trim() !== '') {
                    linkUrl = selectedLink.url.trim();
                  }
                  // Fallback: check url property
                  else if (selectedLink.url && typeof selectedLink.url === 'string' && selectedLink.url.trim() !== '' && selectedLink.url !== 'null') {
                    linkUrl = selectedLink.url.trim();
                  }
                  // Fallback: check text property
                  else if (selectedLink.text && typeof selectedLink.text === 'string' && selectedLink.text.trim() !== '' && selectedLink.text !== 'null') {
                    linkUrl = selectedLink.text.trim();
                  }
                }
              } else if (link && typeof link === 'object' && !Array.isArray(link)) {
                // Single link object (not array)
                // Handle Document links
                if (link.link_type === 'Document' && link.uid) {
                  linkUrl = `/${link.uid}`;
                }
                // Handle Web links
                else if (link.url && typeof link.url === 'string' && link.url.trim() !== '' && link.url !== 'null') {
                  linkUrl = link.url.trim();
                } else if (link.text && typeof link.text === 'string' && link.text.trim() !== '' && link.text !== 'null') {
                  linkUrl = link.text.trim();
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
