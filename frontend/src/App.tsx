import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CommandCenterScene } from "./components/CommandCenterScene";
import { MiniGamePanel } from "./components/MiniGamePanel";
import { QuizPanel } from "./components/QuizPanel";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectIntel } from "./components/ProjectIntel";
import { ContactsPanel } from "./components/ContactsPanel";
import { ProfilePage } from "./components/ProfilePage";
import { TabBar, type TabId } from "./components/TabBar";
import { fetchProjects, recordProjectView } from "./api";
import type { Project } from "./types";

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          if (data[0]) setActiveProjectId(data[0].id);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Failed to load projects");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelectProject = useCallback((id: string) => {
    setActiveProjectId(id);
  }, []);

  const onRecordView = useCallback((id: string) => {
    recordProjectView(id).then(({ viewCount }) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, viewCount } : p))
      );
    }).catch(() => {});
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  if (loading) {
    return (
      <div className="app-root">
        <div className="app-grid app-loading">
          <div className="loading-placeholder" />
          <div className="loading-placeholder scene-shell" />
          <div className="loading-placeholder" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-root">
        <div className="app-grid" style={{ placeItems: "center" }}>
          <section className="panel" style={{ maxWidth: "360px" }}>
            <h2 className="panel-heading">Connection error</h2>
            <p className="muted">{error}</p>
            <p className="muted">Ensure the backend is running on port 4000.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <TabBar activeTab={activeTab} onSelect={setActiveTab} />
      </header>

      {activeTab === "home" && (
        <div className="app-grid">
          <section className="panel panel-left">
            <header className="hud-header">
              <span className="hud-tag">Profile</span>
              <h1 className="hud-title">Kanna – CSE Graduate</h1>
              <p className="hud-subtitle">
                Full-stack developer crafting interactive 3D experiences, scalable backends,
                and clean systems thinking.
              </p>
            </header>
            <div className="tab-cta">
              <button type="button" className="secondary-button" onClick={() => setActiveTab("reflex")}>
                Play Reflex Game
              </button>
              <button type="button" className="secondary-button" onClick={() => setActiveTab("quiz")}>
                Try Tech Quiz
              </button>
            </div>
            <MiniGamePanel />
          </section>

          <section className="panel panel-center">
            <CommandCenterScene
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                onSelectProject(id);
                onRecordView(id);
              }}
            />
          </section>

          <section className="panel panel-right">
            <ProjectIntel
              project={activeProject}
              emptyMessage="Approach a station in the command center to inspect a project."
            />

            <div className="skills-panel">
              <h2 className="panel-heading">Core Systems</h2>
              <ul className="skills-list">
                <li>Full-stack TypeScript (React, Node, Express)</li>
                <li>3D & graphics with Three.js / React Three Fiber</li>
                <li>Databases & caching (PostgreSQL, MongoDB, Redis)</li>
                <li>API design, authentication, and clean architecture</li>
              </ul>
            </div>
          </section>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="app-grid app-grid-single">
          <section className="panel panel-profile">
            <ProfilePage />
          </section>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="app-grid app-grid-two">
          <section className="panel panel-left">
            <ProjectsList
              projects={projects}
              onSelectProject={onSelectProject}
              activeProjectId={activeProjectId}
              onRecordView={onRecordView}
            />
          </section>
          <section className="panel panel-right">
            <ProjectIntel
              project={activeProject}
              emptyMessage="Click a project to view details."
            />
          </section>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="app-grid app-grid-single">
          <section className="panel panel-quiz">
            <QuizPanel />
          </section>
        </div>
      )}

      {activeTab === "reflex" && (
        <div className="app-grid app-grid-single">
          <section className="panel panel-reflex">
            <MiniGamePanel />
          </section>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="app-grid app-grid-single">
          <section className="panel panel-contacts">
            <ContactsPanel />
          </section>
        </div>
      )}
    </div>
  );
};

export default App;
