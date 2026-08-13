// Shared JSX tree for the OG/Twitter share images — kept in one place so
// opengraph-image.tsx and twitter-image.tsx (two separate Next.js file
// conventions, each needing their own default export) render identically
// instead of drifting apart over time.
export function ShareImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundImage: "linear-gradient(135deg, #7c5cfc 0%, #6d5bf5 35%, #3b6bf0 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-140px",
          right: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.16)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-80px",
          width: "420px",
          height: "420px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.10)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "84px",
            height: "84px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.98)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 20 20" fill="none">
            <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="#6d3bf5" />
          </svg>
        </div>
        <span style={{ fontSize: "56px", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>Reline</span>
      </div>

      <div style={{ display: "flex", marginTop: "56px" }}>
        <span
          style={{
            fontSize: "54px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
            maxWidth: "920px",
            letterSpacing: "-1px",
          }}
        >
          Instant virtual numbers &amp; emails for verification
        </span>
      </div>

      <div style={{ display: "flex", marginTop: "36px" }}>
        <span style={{ fontSize: "30px", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>
          Pay in Naira · Get your code in seconds
        </span>
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "56px" }}>
        {["WhatsApp", "Telegram", "Google", "Discord", "TikTok"].map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.16)",
              color: "white",
              fontSize: "24px",
              fontWeight: 500,
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
