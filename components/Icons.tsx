type P = { size?: number };
const base = (size: number) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true, style: { flexShrink: 0 },
});

export const IconMenu = ({ size = 16 }: P) => (
  <svg {...base(size)}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
);
export const IconSettings = ({ size = 16 }: P) => (
  <svg {...base(size)}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="9" cy="6" r="2.2" fill="var(--bg)" /><circle cx="15" cy="12" r="2.2" fill="var(--bg)" /><circle cx="8" cy="18" r="2.2" fill="var(--bg)" /></svg>
);
export const IconBook = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /><line x1="9" y1="8" x2="15" y2="8" /></svg>
);
export const IconTrash = ({ size = 16 }: P) => (
  <svg {...base(size)}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
);
