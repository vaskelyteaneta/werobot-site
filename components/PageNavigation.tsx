"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavItem {
  label: string;
  link: any;
}

export default function PageNavigation() {
  const [pageNav, setPageNav] = useState<NavItem[]>([]);
  const [anchorNav, setAnchorNav] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch("/api/navigation");
        
        if (response.ok) {
          const data = await response.json();
          setPageNav(data.page_navigation || []);
          setAnchorNav(data.anchor_navigation || []);
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
      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navigation
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px - hide navigation (earlier threshold for smoother fade)
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

  // If no navigation items at all, return null
  if (pageNav.length === 0 && anchorNav.length === 0) {
    return null;
  }

  // Helper function to extract link URL (reused for both desktop and mobile)
  const getLinkUrl = (item: NavItem): string | null => {
    if (!item.link) return null;
    
    const link = item.link as any;
    
    // Handle repeatable link field - it's an array
    if (Array.isArray(link) && link.length > 0) {
      const selectedLink = link.find((l: any) => l.link_type === 'Web' && l.url) || link[0];
      
      if (selectedLink) {
        if (selectedLink.link_type === 'Document' && selectedLink.uid) {
          return `/${selectedLink.uid}`;
        } else if (selectedLink.link_type === 'Web' && selectedLink.url && typeof selectedLink.url === 'string' && selectedLink.url.trim() !== '') {
          return selectedLink.url.trim();
        } else if (selectedLink.url && typeof selectedLink.url === 'string' && selectedLink.url.trim() !== '' && selectedLink.url !== 'null') {
          return selectedLink.url.trim();
        } else if (selectedLink.text && typeof selectedLink.text === 'string' && selectedLink.text.trim() !== '' && selectedLink.text !== 'null') {
          return selectedLink.text.trim();
        }
      }
    } else if (link && typeof link === 'object' && !Array.isArray(link)) {
      if (link.link_type === 'Document' && link.uid) {
        return `/${link.uid}`;
      } else if (link.url && typeof link.url === 'string' && link.url.trim() !== '' && link.url !== 'null') {
        return link.url.trim();
      } else if (link.text && typeof link.text === 'string' && link.text.trim() !== '' && link.text !== 'null') {
        return link.text.trim();
      }
    }
    
    return null;
  };

  // Filter valid page links
  const validNavItems = pageNav
    .map((item) => {
      const linkUrl = getLinkUrl(item);
      const isPageLink = linkUrl && (linkUrl.startsWith("/") || linkUrl.startsWith("http://") || linkUrl.startsWith("https://"));
      
      if (!isPageLink) return null;
      
      const label = (item.label as any)?.value || item.label || (item as any).label_text || (item as any).name;
      
      return { label, linkUrl, isAnchor: false };
    })
    .filter((item): item is { label: string; linkUrl: string; isAnchor: boolean } => item !== null);

  // Process anchor navigation items for mobile menu
  const anchorItems = anchorNav
    .map((item) => {
      // Extract label
      const nameValue = typeof item.name === 'string' ? item.name : item.name?.value;
      const labelValue = typeof item.label === 'string' ? item.label : item.label?.value;
      const label = nameValue || labelValue || item.label_text || null;
      
      if (!label) return null;
      
      // Extract anchor link
      let linkUrl: string | null = null;
      if (item.anchor_link) {
        const anchorLink = item.anchor_link;
        linkUrl = typeof anchorLink === 'string' ? anchorLink : (anchorLink?.value || null);
      }
      if (!linkUrl && item.link) {
        const link = item.link;
        if (Array.isArray(link) && link.length > 0) {
          const sel = link.find((l: any) => l.link_type === 'Web' && l.url) || link[0];
          linkUrl = sel?.url || sel?.text || null;
        } else if (link && typeof link === 'object') {
          linkUrl = link.url || link.text || null;
        }
      }
      
      if (!linkUrl) return null;
      
      // Ensure it starts with #
      if (!linkUrl.startsWith("#") && !linkUrl.startsWith("http")) {
        linkUrl = `#${linkUrl}`;
      }
      // Normalize anchor: lowercase, dashes
      if (linkUrl.startsWith("#")) {
        const normalized = linkUrl.substring(1).toLowerCase().replace(/\s+/g, "-");
        linkUrl = `#${normalized}`;
      }
      
      if (!linkUrl.startsWith("#")) return null;
      
      return { label, linkUrl, isAnchor: true };
    })
    .filter((item): item is { label: string; linkUrl: string; isAnchor: boolean } => item !== null);

  // Combine page links and anchor links for mobile menu
  const allMobileItems = [...anchorItems, ...validNavItems];

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className="w-full py-4 fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out hidden md:block" 
        style={{ 
          background: "linear-gradient(to bottom, rgba(209, 228, 246, 0.6) 0%, rgba(209, 228, 246, 0) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "none",
          outline: "none",
          boxShadow: "none",
          margin: 0,
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <div 
          className="w-full flex justify-center px-4" 
          style={{ 
            border: "none !important",
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0
          }}
        >
          <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {validNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.linkUrl}
                  className="text-sm md:text-base font-light tracking-[0.15em] uppercase text-black hover:text-[#333333] transition-colors duration-200 cursor-pointer"
                  style={{ 
                    textDecoration: "none",
                    color: "#000000",
                    fontWeight: 400,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation: Logo left + Hamburger right */}
      <nav
        className="md:hidden w-full py-3 px-4 fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out flex items-center justify-between"
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          boxShadow: "none",
          margin: 0,
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* weROBOT logo - three times bigger than hamburger button */}
        <Link href="/" aria-label="Home" className="flex items-center">
          <img
            src="/metalic-logo.png"
            alt="weROBOT"
            className="h-[108px] w-auto object-contain"
          />
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-black focus:outline-none"
          aria-label="Toggle menu"
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span 
              className={`block h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              style={{ width: "100%" }}
            />
            <span 
              className={`block h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
              style={{ width: "100%" }}
            />
            <span 
              className={`block h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              style={{ width: "100%" }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 transition-opacity duration-300"
          style={{
            backgroundColor: "rgba(209, 228, 246, 0.95)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-full h-full flex flex-col items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col items-center gap-8">
              {allMobileItems.map((item, index) => {
                const isAnchorLink = item.linkUrl.startsWith("#");
                
                if (isAnchorLink) {
                  return (
                    <li key={`mobile-nav-${index}`}>
                      <a
                        href={item.linkUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          // Close menu first
                          setIsMobileMenuOpen(false);
                          
                          // If not on homepage, navigate there with anchor
                          if (window.location.pathname !== "/") {
                            window.location.href = `/${item.linkUrl}`;
                            return;
                          }
                          
                          const targetId = item.linkUrl.substring(1);
                          
                          // Try to find the element by ID - try multiple variations
                          let element = document.getElementById(targetId);
                          
                          if (!element) {
                            if (targetId === "papers") {
                              element = document.getElementById("call-for-papers");
                            }
                            const dashedId = targetId.replace(/\s+/g, "-");
                            if (!element && dashedId !== targetId) {
                              element = document.getElementById(dashedId);
                            }
                            if (!element) {
                              const sections = document.querySelectorAll(`section[id*="${targetId}"], div[id*="${targetId}"]`);
                              if (sections.length > 0) {
                                element = sections[0] as HTMLElement;
                              }
                            }
                          }
                          
                          if (element) {
                            const titleElement = element.querySelector('p.text-sm, p.text-base, h1, h2, h3');
                            const targetElement = titleElement || element;
                            
                            const extraPadding = 40;
                            const offset = extraPadding;
                            
                            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - offset;
                            
                            // Small delay to let the menu close first
                            setTimeout(() => {
                              window.scrollTo({
                                top: Math.max(0, offsetPosition),
                                behavior: "smooth"
                              });
                            }, 100);
                          }
                        }}
                        className="text-xl font-light tracking-[0.15em] uppercase text-black hover:text-[#333333] transition-colors duration-200 cursor-pointer"
                        style={{ 
                          textDecoration: "none",
                          color: "#000000",
                          fontWeight: 400,
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }
                
                return (
                  <li key={`mobile-nav-${index}`}>
                    <Link
                      href={item.linkUrl}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-light tracking-[0.15em] uppercase text-black hover:text-[#333333] transition-colors duration-200 cursor-pointer"
                      style={{ 
                        textDecoration: "none",
                        color: "#000000",
                        fontWeight: 400,
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
