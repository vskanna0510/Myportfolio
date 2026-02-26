import React from "react";

export type TabId = "home" | "profile" | "projects" | "quiz" | "reflex" | "contacts";

const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "home", label: "Command Center", short: "Home" },
  { id: "profile", label: "Profile", short: "About" },
  { id: "projects", label: "Projects", short: "Projects" },
  { id: "quiz", label: "Tech Quiz", short: "Quiz" },
  { id: "reflex", label: "Reflex Game", short: "Reflex" },
  { id: "contacts", label: "Contact", short: "Contact" },
];

type Props = {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
};

export const TabBar: React.FC<Props> = ({ activeTab, onSelect }) => {
  return (
    <nav className="tab-bar" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? "tab-btn-active" : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          <span className="tab-label-full">{tab.label}</span>
          <span className="tab-label-short">{tab.short}</span>
        </button>
      ))}
    </nav>
  );
};
