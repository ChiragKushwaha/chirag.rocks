"use client";

import React, { useEffect, useState } from "react";
import { ExternalLinkDialog } from "@/components/ExternalLinkDialog";

export const GlobalExternalLinkHandler: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [externalLink, setExternalLink] = useState<{
    isOpen: boolean;
    url: string;
  }>({
    isOpen: false,
    url: "",
  });

  useEffect(() => {
    console.log("[GlobalExternalLinkHandler] Mounted");

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      console.log("[GlobalExternalLinkHandler] Link clicked:", href);

      // Skip javascript: and # links
      if (href.startsWith("javascript:") || href === "#") return;

      // Skip mailto: and tel: links
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // Check if it's an external link
      try {
        // If href starts with http:// or https:// it's definitely external
        if (href.startsWith("http://") || href.startsWith("https://")) {
          const url = new URL(href);
          if (url.origin !== window.location.origin) {
            console.log(
              "[GlobalExternalLinkHandler] External link detected, showing dialog"
            );
            e.preventDefault();
            e.stopPropagation();
            setExternalLink({ isOpen: true, url: href });
            return;
          }
        }

        // Check if target="_blank"
        if (anchor.getAttribute("target") === "_blank") {
          console.log(
            "[GlobalExternalLinkHandler] _blank link detected, showing dialog"
          );
          e.preventDefault();
          e.stopPropagation();
          setExternalLink({ isOpen: true, url: href });
          return;
        }
      } catch (error) {
        console.error("[GlobalExternalLinkHandler] Error parsing URL:", error);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      console.log("[GlobalExternalLinkHandler] Unmounted");
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <>
      {children}
      <ExternalLinkDialog
        isOpen={externalLink.isOpen}
        onClose={() => {
          console.log("[GlobalExternalLinkHandler] Dialog closed");
          setExternalLink({ ...externalLink, isOpen: false });
        }}
        onConfirm={() => {
          console.log(
            "[GlobalExternalLinkHandler] Dialog confirmed, opening:",
            externalLink.url
          );
          window.open(externalLink.url, "_blank");
          setExternalLink({ ...externalLink, isOpen: false });
        }}
        url={externalLink.url}
      />
    </>
  );
};
