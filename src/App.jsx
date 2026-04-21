import React, { Suspense, lazy, useEffect, useRef } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.jsx";

// ── Lazy load each MFE via Module Federation ──────────────────────────────
// const TaskWidget = lazy(() =>
//   import("mfe_vue_tasks/TaskWidget").then((m) => ({
//     default: m.default ?? m,
//   })),
// );
const WeatherWidget = lazy(() =>
  import("mfe-react-weather/WeatherWidget").then((m) => ({
    default: m.default ?? m,
  })),
);

// The Angular MFE exports a Custom Element — we mount it via a React wrapper
// function CounterWidgetWrapper() {
//   const ref = useRef(null);

//   useEffect(() => {
//     import("mfe_angular_counter/CounterWidget").catch(console.error);
//   }, []);

//   return <counter-widget ref={ref}></counter-widget>;
// }

// ── MFE Panel wrapper ─────────────────────────────────────────────────────
function MfePanel({ color, label, sublabel, mountId, children }) {
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

// ── Vue task widget rendered into shadow DOM via React ref ────────────────
// function VueTaskWrapper() {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     if (!mountRef.current) return;
//     import("mfe_vue_tasks/TaskWidget")
//       .then(({ default: TaskWidget }) => {
//         const { createApp } = window.__VUE__ ?? {};
//         // Vite federation shares Vue — use the shared instance
//         import("vue").then(({ createApp }) => {
//           const app = createApp(TaskWidget);
//           app.mount(mountRef.current);
//           return () => app.unmount();
//         });
//       })
//       .catch(console.error);
//   }, []);

//   return <div ref={mountRef}></div>;
// }

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app">
      {/* NAV */}
      <nav className="nav">
        <a href="#hero" className="nav-logo">
          EC
        </a>
        <a href="#experience" className="nav-link">
          Experience
        </a>
        <a href="#skills" className="nav-link">
          Skills
        </a>
        <a href="#mfe-demo" className="nav-link">
          MFE Demo
        </a>
        <a href="#projects" className="nav-link">
          Projects
        </a>
        <a href="#resume" className="nav-link">
          Resume
        </a>
        <a href="#contact" className="nav-cta">
          Contact
        </a>
      </nav>

      <div className="wrap">
        {/* HERO */}
        <section id="hero" className="hero-section">
          <div>
            <p className="eyebrow">Software Engineer II · Chicago, IL</p>
            <h1 className="hero-name">
              Erick Cruz
              <br />
              <em>Building things that scale.</em>
            </h1>
            <p className="hero-desc">
              7+ years at Oak Street Health crafting enterprise .NET APIs, Vue 3
              frontends, and microfrontend architectures. Focused on cloud,
              system design, and AI integration on the path to Senior Engineer.
            </p>
            <div className="hero-links">
              <a href="#resume" className="btn btn-primary">
                View Resume
              </a>
              <a href="#mfe-demo" className="btn btn-outline">
                Live MFE Demo →
              </a>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-stat">
              <div className="stat-num">7+</div>
              <div className="stat-label">Years at Oak Street Health</div>
            </div>
            <div className="hero-stat">
              <div className="stat-num">88%</div>
              <div className="stat-label">Doc signing increase (week 1)</div>
            </div>
            <div className="hero-stat">
              <div className="stat-num">1K+</div>
              <div className="stat-label">Users supported</div>
            </div>
          </div>
        </section>

        {/* MFE DEMO */}
        <section id="mfe-demo" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Live Demo</p>
            <h2 className="section-title">Microfrontend Architecture</h2>
            <p className="section-desc">
              Three independent framework bundles — Vue 3, Angular-style Web
              Component, and React 18 — loaded at runtime via Module Federation.
              Each MFE lives in its own GitHub repo, deploys independently, and
              owns its state entirely.
            </p>
          </div>

          <div className="mfe-wrapper">
            <div className="mfe-arch-bar">
              <span className="arch-node arch-root">portfolio-shell</span>
              <span className="arch-arrow">──▶</span>
              <span className="arch-node arch-vue">mfe-vue-tasks</span>
              <span className="arch-sep">·</span>
              <span className="arch-node arch-ang">mfe-angular-counter</span>
              <span className="arch-sep">·</span>
              <span className="arch-node arch-rea">mfe-react-weather</span>
            </div>

            <div>
              <ErrorBoundary fallbackMessage="Weather widget unavailable">
                <Suspense
                  fallback={
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "var(--hint)",
                      }}
                    >
                      Loading weather widget…
                    </div>
                  }
                >
                  <WeatherWidget />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="mfe-panels">
              {/* <MfePanel
                color="vue"
                label="Vue 3"
                sublabel="Composition API"
                mountId="vue-mfe"
              >
                <VueTaskWrapper />
              </MfePanel> */}

              {/* <MfePanel
                color="angular"
                label="Angular"
                sublabel="Custom Element"
                mountId="angular-mfe"
              >
                <CounterWidgetWrapper />
              </MfePanel> */}

              {/* <MfePanel
                color="react"
                label="React 18"
                sublabel="Hooks + State"
                mountId="react-mfe"
              >
                <Suspense
                  fallback={
                    <div className="mfe-loading">loading React MFE…</div>
                  }
                >
                  <WeatherWidget />
                </Suspense>
              </MfePanel> */}
            </div>
          </div>
        </section>
      </div>
      {/* end .wrap */}

      <footer className="footer">
        <span className="footer-copy">© 2025 Erick Cruz</span>
        <div className="footer-pills">
          {[
            "Vue 3",
            "React 18",
            "Web Components",
            "Module Federation",
            "GitHub Pages",
          ].map((t, i) => (
            <span key={i} className="footer-pill">
              {t}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
