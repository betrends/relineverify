// Shared bolt-mark JSX rendered into PNGs by the icon routes and
// apple-icon.tsx via next/og's ImageResponse — keeps every generated icon
// visually identical to the SVG favicon without duplicating the artwork.
export function BoltMark({ padding = "20%" }: { padding?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#7c5cfc",
      }}
    >
      <svg width={`${100 - parseInt(padding) * 2}%`} height={`${100 - parseInt(padding) * 2}%`} viewBox="0 0 20 20" fill="none">
        <path d="M11 3 5 12h4.2l-.8 5 6.6-9h-4.2l.8-5Z" fill="white" />
      </svg>
    </div>
  );
}
