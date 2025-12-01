"use client";

import { useEffect } from 'react';

export default function HideUnicornAttribution() {
  useEffect(() => {
    const hideElement = (el: HTMLElement) => {
      // Remove from DOM completely
      try {
        el.remove();
      } catch (e) {
        // If remove fails, hide it completely
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
      }
    };

    const shouldHide = (el: HTMLElement): boolean => {
      // Don't hide the background container
      if (el.hasAttribute('data-us-project')) {
        return false;
      }

      // Check href - only hide if it's a link to unicorn.studio
      if (el.tagName === 'A') {
        const href = (el as HTMLAnchorElement).href || '';
        if (href.includes('unicorn.studio') || href.includes('unicornstudio')) {
          return true;
        }
      }

      // Check text content - hide if it contains attribution text
      const text = el.textContent || '';
      const lowerText = text.toLowerCase().trim();
      
      // Hide if it contains "made with" or "made by" (these are always attribution)
      if (lowerText.includes('made with') || lowerText.includes('made by')) {
        return true;
      }
      
      // Also hide if it mentions unicorn.studio in a short text (likely attribution)
      if (lowerText.includes('unicorn.studio') && lowerText.length < 100) {
        return true;
      }

      // Check innerHTML - same logic
      const innerHTML = el.innerHTML || '';
      const lowerHTML = innerHTML.toLowerCase();
      if (
        (lowerHTML.includes('made with') && lowerHTML.includes('unicorn')) ||
        (lowerHTML.includes('made by') && lowerHTML.includes('unicorn'))
      ) {
        return true;
      }

      // Only hide if class/id specifically indicates attribution
      const className = el.className?.toString() || '';
      const id = el.id || '';
      if (
        (className.toLowerCase().includes('attribution') && className.toLowerCase().includes('unicorn')) ||
        (id.toLowerCase().includes('attribution') && id.toLowerCase().includes('unicorn'))
      ) {
        return true;
      }

      return false;
    };

    const hideAttribution = () => {
      // First, hide all links to unicorn.studio (but protect background container)
      document.querySelectorAll('a[href*="unicorn.studio"], a[href*="unicornstudio"]').forEach(el => {
        const htmlEl = el as HTMLElement;
        // Don't hide if it's the background container itself
        if (!htmlEl.hasAttribute('data-us-project') && !htmlEl.closest('[data-us-project]')) {
          hideElement(htmlEl);
        }
      });

      // Hide all buttons, divs, spans, etc. that contain attribution text
      document.querySelectorAll('button, div, span, p, a, section').forEach(el => {
        const htmlEl = el as HTMLElement;
        
        // Always protect the background container
        if (htmlEl.hasAttribute('data-us-project')) {
          return;
        }
        
        // Check if it's inside the background container - if so, only hide if it's clearly attribution
        const isInBackground = htmlEl.closest('[data-us-project]');
        if (isInBackground) {
          // Inside background container - be very careful, only hide if it's clearly attribution
          const text = (htmlEl.textContent || '').toLowerCase().trim();
          if (text.includes('made with') || text.includes('made by')) {
            hideElement(htmlEl);
          }
          return;
        }
        
        // Outside background container - check if it should be hidden
        if (shouldHide(htmlEl)) {
          hideElement(htmlEl);
        }
      });
    };

    // Run immediately
    hideAttribution();

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const el = node as HTMLElement;
            if (shouldHide(el)) {
              hideElement(el);
            }
            // Also check children
            el.querySelectorAll?.('*').forEach((child) => {
              if (shouldHide(child as HTMLElement)) {
                hideElement(child as HTMLElement);
              }
            });
          }
        });
      });
      hideAttribution();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'href', 'style']
    });

    // Also run periodically as backup - more frequent
    const intervalId = setInterval(hideAttribution, 100);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return null;
}


