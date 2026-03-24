import React, { Suspense, lazy, useEffect, useRef } from "react";

// ── Lazy load each MFE via Module Federation ──────────────────────────────
const TaskWidget = lazy(() =>
  import("mfe_vue_tasks/TaskWidget").then((m) => ({
    default: m.default ?? m,
  })),
);
const WeatherWidget = lazy(() =>
  import("mfe_react_weather/WeatherWidget").then((m) => ({
    default: m.default ?? m,
  })),
);

// The Angular MFE exports a Custom Element — we mount it via a React wrapper
function CounterWidgetWrapper() {
  const ref = useRef(null);

  useEffect(() => {
    import("mfe_angular_counter/CounterWidget").catch(console.error);
  }, []);

  return <counter-widget ref={ref}></counter-widget>;
}

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
function VueTaskWrapper() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    import("mfe_vue_tasks/TaskWidget")
      .then(({ default: TaskWidget }) => {
        const { createApp } = window.__VUE__ ?? {};
        // Vite federation shares Vue — use the shared instance
        import("vue").then(({ createApp }) => {
          const app = createApp(TaskWidget);
          app.mount(mountRef.current);
          return () => app.unmount();
        });
      })
      .catch(console.error);
  }, []);

  return <div ref={mountRef}></div>;
}

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

        {/* EXPERIENCE */}
        <section id="experience" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Career</p>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="exp-list">
            {[
              {
                dates: "Apr 2022 – Present",
                role: "Software Engineer II",
                company: "Oak Street Health",
                bullets: [
                  "Led microfrontend architecture migration to Vue 3 + Vite + Vitest.",
                  "Built collaborative editing with streaming endpoints, Tanstack Query, and Pinia.",
                  "Established Architecture Decision Records (ADRs) and frontend coding standards.",
                  "Drove spike stories validating architectural and tooling decisions.",
                ],
              },
              {
                dates: "Apr 2021 – Mar 2022",
                role: "Software Engineer",
                company: "Oak Street Health",
                bullets: [
                  "Created a VueJS page that increased unsigned document signing by 88.46% (10,670 docs) in the first week.",
                  "Implemented the first streaming service with RxJS — enabling clinical staff live task updates.",
                ],
              },
              {
                dates: "Jun 2019 – Mar 2021",
                role: "Junior Application Developer",
                company: "Oak Street Health",
                bullets: [
                  "Built Windows services for automated healthcare workflows and batch processing.",
                  "Automated referral task flow via ASP.NET with electronic signatures.",
                ],
              },
              {
                dates: "Jun 2017 – May 2019",
                role: "Computer Engineer",
                company: "Oak Street Health",
                bullets: [
                  "Delivered deskside support for 1,000+ users including AD management and hardware.",
                ],
              },
            ].map((job, i) => (
              <div key={i} className="exp-item">
                <div className="exp-meta">
                  <div className="exp-dates">{job.dates}</div>
                </div>
                <div>
                  <div className="exp-role">{job.role}</div>
                  <div className="exp-company">{job.company}</div>
                  <ul className="exp-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Stack</p>
            <h2 className="section-title">Skills & Technologies</h2>
          </div>
          <div className="skills-grid">
            {[
              {
                title: "Frontend",
                tags: [
                  "Vue 3",
                  "TypeScript",
                  "JavaScript",
                  "Pinia",
                  "Tanstack Query",
                  "Vite",
                  "Tailwind CSS",
                ],
              },
              {
                title: "Backend",
                tags: [
                  "ASP.NET",
                  "C#",
                  "Entity Framework",
                  "MS SQL",
                  "Web API",
                  "RxJS",
                ],
              },
              {
                title: "Testing & Tooling",
                tags: ["Vitest", "Cypress", "Docker", "Cursor", "GitHub"],
              },
              {
                title: "Architecture",
                tags: [
                  "Microfrontends",
                  "ADRs",
                  "Repository Pattern",
                  "Streaming APIs",
                  "SPA",
                ],
              },
              {
                title: "Learning Now",
                tags: [
                  "AWS",
                  "Kubernetes",
                  "Terraform",
                  "Azure OpenAI",
                  "Python",
                ],
                accent: true,
              },
              {
                title: "Domain",
                tags: [
                  "Healthcare Tech",
                  "Clinical Workflows",
                  "Cross-team Leadership",
                ],
              },
            ].map((group, i) => (
              <div key={i} className="skill-group">
                <div className="skill-group-title">{group.title}</div>
                <div className="skill-tags">
                  {group.tags.map((t, j) => (
                    <span
                      key={j}
                      className={`tag ${group.accent ? "tag-accent" : ""}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
              <MfePanel
                color="vue"
                label="Vue 3"
                sublabel="Composition API"
                mountId="vue-mfe"
              >
                <VueTaskWrapper />
              </MfePanel>

              {/* <MfePanel color="angular" label="Angular" sublabel="Custom Element" mountId="angular-mfe">
                <CounterWidgetWrapper />
              </MfePanel>

              <MfePanel color="react" label="React 18" sublabel="Hooks + State" mountId="react-mfe">
                <Suspense fallback={<div className="mfe-loading">loading React MFE…</div>}>
                  <WeatherWidget />
                </Suspense>
              </MfePanel> */}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Portfolio</p>
            <h2 className="section-title">Projects</h2>
          </div>
          <div className="projects-grid">
            {[
              {
                icon: "🎮",
                name: "Gaming Stats Dashboard",
                status: "building",
                desc: "Real-time dashboard pulling stats from Steam & Riot Games APIs. AI-powered coaching tips via Azure OpenAI. End-to-end cloud deployment on AWS.",
                tech: [
                  "Vue 3",
                  "ASP.NET",
                  "AWS EC2",
                  "Docker",
                  "Azure OpenAI",
                  "PostgreSQL",
                ],
              },
              {
                icon: "🔧",
                name: "AI Home Maintenance Tracker",
                status: "planned",
                desc: "Log tasks, track tools, get AI repair guides. Upload a photo of something broken — get step-by-step fix instructions via Azure AI Vision.",
                tech: [
                  "Vue 3",
                  "Semantic Kernel",
                  "Azure AI Vision",
                  "pgvector",
                  "Service Bus",
                ],
              },
              {
                icon: "🎵",
                name: "Smart Music Discovery",
                status: "planned",
                desc: "Connects to Spotify API, generates embeddings of your taste profile, and surfaces recommendations using vector similarity search.",
                tech: [
                  "Vue 3",
                  "FastAPI",
                  "OpenAI Embeddings",
                  "Pinecone",
                  "Redis",
                  "AWS Lambda",
                ],
              },
              {
                icon: "⚡",
                name: "MFE Portfolio Shell",
                status: "live",
                desc: "This site. Vue 3, Angular-style Web Component, and React 18 loaded via Module Federation from separate GitHub repos — each deploying independently.",
                tech: [
                  "Vue 3",
                  "React 18",
                  "Web Components",
                  "Module Federation",
                  "GitHub Pages",
                ],
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`project-card ${p.status === "live" ? "project-live" : ""}`}
              >
                <div className="project-icon">{p.icon}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="project-name">{p.name}</div>
                  <span className={`project-status status-${p.status}`}>
                    {p.status === "building"
                      ? "In Progress"
                      : p.status === "planned"
                        ? "Planned"
                        : "Live"}
                  </span>
                </div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t, j) => (
                    <span key={j} className="ptag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESUME */}
        <section id="resume" className="section">
          <div className="section-header">
            <p className="section-eyebrow">Full Document</p>
            <h2 className="section-title">Resume</h2>
          </div>
          <div className="resume-card">
            <div className="resume-header">
              <div>
                <div className="resume-name">Erick Cruz</div>
                <div className="resume-title">Software Engineer II</div>
              </div>
              <div className="resume-contact">
                <span>erickcruz147@gmail.com</span>
                <span>(773) 818-6161</span>
                <span>Chicago, IL</span>
              </div>
            </div>
            <div className="resume-body">
              <div>
                <div className="res-section-title">Experience</div>
                {[
                  {
                    title: "Software Engineer II",
                    dates: "Apr 2022 – Present",
                    company: "Oak Street Health",
                    bullets: [
                      "Led microfrontend migration to Vue 3 + Vite + Vitest",
                      "Built collaborative editing with streaming endpoints & Tanstack Query",
                      "Established ADRs and frontend coding standards",
                    ],
                  },
                  {
                    title: "Software Engineer",
                    dates: "Apr 2021 – Mar 2022",
                    company: "Oak Street Health",
                    bullets: [
                      "Increased doc signing by 88.46% (10,670 docs) in week one",
                      "Built first streaming service with RxJS for live clinical updates",
                    ],
                  },
                  {
                    title: "Junior Application Developer",
                    dates: "Jun 2019 – Mar 2021",
                    company: "Oak Street Health",
                    bullets: [
                      "Windows services for automated healthcare workflows",
                      "Automated referral task flow via ASP.NET",
                    ],
                  },
                  {
                    title: "Computer Engineer",
                    dates: "Jun 2017 – May 2019",
                    company: "Oak Street Health",
                    bullets: ["Deskside support for 1,000+ users"],
                  },
                ].map((job, i) => (
                  <div key={i} className="res-job">
                    <div className="res-job-header">
                      <span className="res-job-title">{job.title}</span>
                      <span className="res-job-dates">{job.dates}</span>
                    </div>
                    <div className="res-job-company">{job.company}</div>
                    <ul className="res-bullets">
                      {job.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div
                  className="res-section-title"
                  style={{ marginTop: "1.5rem" }}
                >
                  Education
                </div>
                <div className="res-edu-school">
                  Illinois Institute of Technology
                </div>
                <div className="res-edu-degree">
                  MS & BS in Software Development
                </div>
                <div className="res-edu-year">Chicago, IL · May 2019</div>
              </div>
              <div>
                <div className="res-section-title">Skills</div>
                {[
                  {
                    label: "Frontend",
                    tags: [
                      "TypeScript",
                      "JavaScript",
                      "VueJS",
                      "Pinia",
                      "Tanstack Query",
                      "Vite",
                      "Tailwind CSS",
                    ],
                  },
                  {
                    label: "Backend",
                    tags: ["ASP.NET", "C#", "MS SQL", "Entity Framework"],
                  },
                  { label: "Testing", tags: ["Vitest", "Cypress"] },
                  { label: "DevOps", tags: ["Docker", "Cursor"] },
                ].map((g, i) => (
                  <div key={i} className="res-skill-group">
                    <div className="res-skill-label">{g.label}</div>
                    <div className="res-skill-tags">
                      {g.tags.map((t, j) => (
                        <span key={j} className="res-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
