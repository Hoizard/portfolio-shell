import { Suspense } from "react";
export default function MfePanel({
  color,
  label,
  sublabel,
  mountId,
  children,
}) {
  const colors = {
    vue: {
      accent: "#42b883",
      bg: "rgba(66,184,131,0.08)",
      border: "rgba(66,184,131,0.25)",
    },
    angular: {
      accent: "#dd0031",
      bg: "rgba(221,0,49,0.06)",
      border: "rgba(221,0,49,0.22)",
    },
    react: {
      accent: "#149eca",
      bg: "rgba(20,158,202,0.07)",
      border: "rgba(20,158,202,0.22)",
    },
  };
  const c = colors[color];
  return (
    <div
      style={{
        border: `1px solid var(--border)`,
        borderTop: `2px solid ${c.accent}`,
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: c.bg,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            fontWeight: 500,
            color: c.accent,
            border: `1px solid ${c.border}`,
            background: "rgba(255,255,255,0.7)",
            padding: "3px 9px",
            borderRadius: "4px",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            color: "var(--hint)",
          }}
        >
          {sublabel}
        </span>
      </div>
      <div style={{ flex: 1, padding: "1.25rem" }}>
        <Suspense
          fallback={
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "12px",
                color: "var(--hint)",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              loading {label}…
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
