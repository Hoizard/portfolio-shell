import MfePanel from "./components/MfePanel/MfePanel.jsx";
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
            <h1 className="hero-name">
              Erick Cruz
              <br />
              <em>Building things that scale.</em>
            </h1>
            <p className="hero-desc">
              Crafting enterprise .NET APIs, Vue 3 frontends, and microfrontend
              architectures. Focused on cloud, system design, and AI integration
              on the path as a Software Engineer.
            </p>
            <div className="hero-links">
              <a href="#mfe-demo" className="btn btn-outline">
                Live MFE Demo →
              </a>
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

              <MfePanel
                color="react"
                label="React 18"
                sublabel="Hooks + State"
                mountId="react-mfe"
              >
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
              </MfePanel>
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
