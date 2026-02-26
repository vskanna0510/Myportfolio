import React from "react";
import type { Project } from "../types";

type Props = {
  project: Project | null;
  emptyMessage: string;
};

export const ProjectIntel: React.FC<Props> = ({ project, emptyMessage }) => {
  if (!project) {
    return (
      <div className="project-detail">
        <h2 className="panel-heading">Project Intel</h2>
        <p className="muted">{emptyMessage}</p>
      </div>
    );
  }

  const hasLink = project.link && project.link !== "#";
  const demoHref = hasLink ? project.link : undefined;

  return (
    <div className="project-detail">
      <h2 className="panel-heading">Project Intel</h2>
      <h3 className="project-title">{project.name}</h3>
      <p className="project-role">{project.role}</p>
      {(project.viewCount ?? 0) > 0 && (
        <p className="project-views">Viewed {project.viewCount}×</p>
      )}
      <p className="project-summary">{project.summary}</p>
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      {(project.imageUrl || hasLink) && (
        demoHref ? (
          <a
            href={demoHref}
            target="_blank"
            rel="noreferrer"
            className="project-demo-card"
            aria-label={`Open ${project.name} demo`}
          >
            <span className="project-demo-card-inner">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt=""
                  className="project-demo-image"
                  loading="lazy"
                />
              ) : (
                <span className="project-demo-placeholder" aria-hidden>
                  <span className="project-demo-icon">▶</span>
                  <span className="project-demo-label">Demo</span>
                </span>
              )}
              <span className="project-demo-overlay">
                <span className="project-demo-cta">Visit site ↗</span>
              </span>
            </span>
          </a>
        ) : (
          <div className="project-demo-card project-demo-card-static">
            <span className="project-demo-card-inner">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt=""
                  className="project-demo-image"
                  loading="lazy"
                />
              ) : (
                <span className="project-demo-placeholder" aria-hidden>
                  <span className="project-demo-icon">▶</span>
                  <span className="project-demo-label">Demo</span>
                </span>
              )}
              <span className="project-demo-overlay">
                <span className="project-demo-cta">Preview</span>
              </span>
            </span>
          </div>
        )
      )}

      <div className="chip-row">
        {project.techStack.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      {hasLink && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="primary-link"
        >
          View Project
        </a>
      )}
    </div>
  );
};
