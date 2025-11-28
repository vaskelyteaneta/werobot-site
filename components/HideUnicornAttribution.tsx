"use client";

import { useEffect } from 'react';

export default function HideUnicornAttribution() {
  useEffect(() => {
    const hideElement = (el: HTMLElement) => {
      el.style.cssText = `
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
        z-index: -9999 !important;
      `;
    };

    const shouldHide = (el: HTMLElement): boolean => {
      // Check href
      if (el.tagName === 'A') {
        const href = (el as HTMLAnchorElement).href || '';
        if (href.includes('unicorn.studio') || href.includes('unicornstudio')) {
          return true;
        }
      }

      // Check text content
      const text = el.textContent || '';
      if (
        text.toLowerCase().includes('made with') ||
        text.toLowerCase().includes('unicorn.studio') ||
        text.toLowerCase().includes('unicorn studio')
      ) {
        return true;
      }

      // Check classes and IDs
      const className = el.className?.toString() || '';
      const id = el.id || '';
      if (
        className.toLowerCase().includes('unicorn') ||
        id.toLowerCase().includes('unicorn')
      ) {
        return true;
      }

      return false;
    };

    const hideAttribution = () => {
      // Hide links to unicorn.studio
      document.querySelectorAll('a[href*="unicorn.studio"], a[href*="unicornstudio"]').forEach(el => {
        hideElement(el as HTMLElement);
      });

      // Hide all elements and check their content
      document.querySelectorAll('*').forEach(el => {
        if (shouldHide(el as HTMLElement)) {
          hideElement(el as HTMLElement);
        }
      });
    };

    // Run immediately
    hideAttribution();

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      hideAttribution();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'href']
    });

    // Also run periodically as backup
    const intervalId = setInterval(hideAttribution, 200);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return null;
}

