import React from "react";

export const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">About Me</h1>
        <p className="profile-tagline">CSE Graduate · Full-Stack Developer</p>
      </header>

      <section className="profile-section">
        <h2 className="profile-section-heading">Who I am</h2>
        <p className="profile-bio">
          I&apos;m Kanna, a Computer Science graduate with a focus on full-stack development,
          interactive 3D experiences, and clean system design. I enjoy turning ideas into
          working software—from APIs and databases to browser-based 3D and games. When I&apos;m
          not coding, I like to explore new tech and contribute to open source.
        </p>
      </section>

      <section className="profile-section">
        <h2 className="profile-section-heading">Education</h2>
        <div className="profile-card">
          <span className="profile-card-label">Degree</span>
          <span className="profile-card-value">B.Tech / B.E. in Computer Science & Engineering</span>
        </div>
        <div className="profile-card">
          <span className="profile-card-label">Focus</span>
          <span className="profile-card-value">Full-stack development, Data structures, Web technologies</span>
        </div>
      </section>

      <section className="profile-section">
        <h2 className="profile-section-heading">Experience</h2>
        <div className="profile-experience-item">
          <div className="profile-experience-header">
            <span className="profile-experience-role">Full-Stack Developer (Intern / Project)</span>
            <span className="profile-experience-period">2023 – Present</span>
          </div>
          <span className="profile-experience-company">Freelance & side projects</span>
          <ul className="profile-list profile-experience-bullets">
            <li>Built REST APIs and real-time features with Node.js, Express, and WebSockets</li>
            <li>Developed React + TypeScript frontends and 3D experiences with Three.js / R3F</li>
            <li>Designed and maintained PostgreSQL and MongoDB data models</li>
          </ul>
        </div>
        <div className="profile-experience-item">
          <div className="profile-experience-header">
            <span className="profile-experience-role">Technical contributor</span>
            <span className="profile-experience-period">2022 – 2023</span>
          </div>
          <span className="profile-experience-company">Open source & academic projects</span>
          <ul className="profile-list profile-experience-bullets">
            <li>Contributed to open-source repos and collaborated via Git workflows</li>
            <li>Delivered coursework and capstone projects in full-stack and DSA</li>
          </ul>
        </div>
      </section>

      <section className="profile-section">
        <h2 className="profile-section-heading">What I do</h2>
        <ul className="profile-list">
          <li>Build scalable backends with Node.js, Express, and databases (PostgreSQL, MongoDB, Redis)</li>
          <li>Create interactive frontends with React, TypeScript, and 3D (Three.js, React Three Fiber)</li>
          <li>Design and implement REST APIs and real-time features (WebSockets)</li>
          <li>Write clean, maintainable code and care about performance and UX</li>
        </ul>
      </section>

      <section className="profile-section">
        <h2 className="profile-section-heading">Beyond code</h2>
        <p className="profile-bio">
          I like problem-solving on platforms like LeetCode, reading about system design and
          game dev, and tinkering with side projects. I&apos;m open to roles in full-stack, backend,
          or 3D/interactive development and always happy to connect.
        </p>
      </section>
    </div>
  );
};
