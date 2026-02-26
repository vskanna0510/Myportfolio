import React from "react";
import type { Project } from "../types";

type Props = {
  projects: Project[];
  onSelectProject: (id: string) => void;
  activeProjectId: string | null;
  onRecordView: (id: string) => void;
};

export const ProjectsList: React.FC<Props> = ({
  projects,
  onSelectProject,
  activeProjectId,
  onRecordView
}) => {
  const handleClick = (id: string) => {
    onSelectProject(id);
    onRecordView(id);
  };

  return (
    <div className="projects-list">
      <h2 className="panel-heading">All Projects ({projects.length})</h2>
      <ul className="projects-list-grid" role="list">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`project-card ${activeProjectId === p.id ? "project-card-active" : ""}`}
              onClick={() => handleClick(p.id)}
            >
              <span className="project-card-name">{p.name}</span>
              <span className="project-card-role">{p.role}</span>
              {(p.viewCount ?? 0) > 0 && (
                <span className="project-card-views">Viewed {p.viewCount}×</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
