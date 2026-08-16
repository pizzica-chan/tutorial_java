import type { ReactNode } from "react";
import type { CalloutKind, TrackId } from "../types";

export type IconName =
  | "tip"
  | "note"
  | "warn"
  | "search"
  | "check"
  | "clock"
  | "browser"
  | "server"
  | "box"
  | "package"
  | "globe"
  | "folder"
  | "book"
  | "route"
  | "wrench"
  | "lab"
  | "quiz"
  | "shield"
  | "inbox"
  | "cog"
  | "database"
  | "file"
  | "arrow-left"
  | "arrow-right"
  | "close"
  | "flag";

const paths: Record<IconName, ReactNode> = {
  tip: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l2.5 1.5" />
    </>
  ),
  note: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  warn: (
    <>
      <path d="M12 4 21 19H3L12 4z" />
      <path d="M12 10v4" />
      <path d="M12 16.5h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  check: <path d="M5 12.5 9.5 17 19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M6 7h.01M8.5 7h.01" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="14" width="16" height="6" rx="1" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  box: (
    <>
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5z" />
      <path d="M3 8.5v7L12 20l9-4.5v-7" />
      <path d="M12 13v7" />
    </>
  ),
  package: (
    <>
      <path d="M3 8.5 12 4l9 4.5v7L12 20 3 15.5v-7z" />
      <path d="M12 13V4" />
      <path d="M3 8.5 12 13l9-4.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.4 4 5.4 4 8.5s-1.5 6.1-4 8.5c-2.5-2.4-4-5.4-4-8.5s1.5-6.1 4-8.5z" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7.5V18a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9.5a1 1 0 0 0-1-1h-8L10 6H4a1 1 0 0 0-1 1.5z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.2 7.8 15.8 16.2" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5.6 5.6L4 17l3 3 4.9-4.9a4 4 0 0 0 5.6-5.6L15 12l-3-3z" />
    </>
  ),
  lab: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.2L5 19a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 19l-5-9.8V3" />
    </>
  ),
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1 1-1.1 1.8V14" />
      <path d="M12 17h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.2 2.8 7.4 7 8.7 4.2-1.3 7-4.5 7-8.7V6z" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13 6 5h12l2 8v6H4z" />
      <path d="M4 13h4.5l1.5 2h4l1.5-2H20" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2l-1.4 1.4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.5" />
      <path d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V9h5" />
    </>
  ),
  "arrow-left": <path d="M15 6 9 12l6 6M9 12h10" />,
  "arrow-right": <path d="m9 6 6 6-6 6M15 12H5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  flag: (
    <>
      <path d="M6 4v16" />
      <path d="M6 5h11l-2.5 3.5L17 12H6" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function calloutIcon(kind: CalloutKind): IconName {
  if (kind === "note") return "note";
  if (kind === "warn" || kind === "trap") return "warn";
  return "tip";
}

export function trackIcon(id: TrackId): IconName {
  if (id === "intro") return "book";
  if (id === "web") return "globe";
  if (id === "java-map") return "folder";
  if (id === "reading") return "route";
  if (id === "trace") return "route";
  if (id === "scenario") return "flag";
  return "wrench";
}

export function flowLayerIcon(layer: string): IconName {
  if (layer === "Browser") return "browser";
  if (layer === "Filter") return "shield";
  if (layer === "Controller") return "inbox";
  if (layer === "Service") return "cog";
  if (layer === "MyBatis") return "file";
  if (layer === "MySQL") return "database";
  if (layer === "Thymeleaf") return "file";
  return "globe";
}
