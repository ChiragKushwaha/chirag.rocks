import React from "react";
import { ExternalLink } from "lucide-react";

interface WebLinkAppProps {
  title: string;
  url: string;
  description?: string;
  /** Optional icon element rendered above the title. */
  icon?: React.ReactNode;
}

/**
 * A lightweight launcher shown when an external web-app is opened as a window
 * (e.g. from Spotlight). Clicking through routes via an anchor so the global
 * external-link handler shows the standard confirmation dialog.
 */
export const WebLinkApp: React.FC<WebLinkAppProps> = ({
  title,
  url,
  description,
  icon,
}) => {
  const domain = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  })();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[#1e1e1e] p-8 text-center text-white">
      {icon && (
        <div className="h-24 w-24 drop-shadow-2xl" aria-hidden="true">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
            {description}
          </p>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
      >
        Open {domain}
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    </div>
  );
};
