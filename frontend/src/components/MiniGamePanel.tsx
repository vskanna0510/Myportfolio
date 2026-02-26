import React, { useEffect, useRef, useState } from "react";

type Score = {
  name: string;
  score: number;
  createdAt: string;
};

const COUNTDOWN_SECONDS = 60;

const BUG_HINTS = [
  "undefined",
  "null reference",
  "off-by-one",
  "== vs ===",
  "missing dependency",
  "memory leak",
  "race condition",
  "arr[i+1]",
  "useEffect deps",
  "wrong key prop",
  "stale closure",
  "CORS error",
  "404 Not Found",
  "infinite loop",
  "type coercion",
  "async without await"
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const MiniGamePanel: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [name, setName] = useState("Kanna");
  const [hintVisible, setHintVisible] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>("");
  const timerRef = useRef<number | null>(null);
  const hintShowRef = useRef<number | null>(null);
  const hintHideRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setTimeLeft((prev) => {
        if (!running) return prev;
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    };

    if (running && timerRef.current == null) {
      timerRef.current = window.setInterval(tick, 1000);
    }

    return () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    if (!running) {
      setHintVisible(false);
      if (hintShowRef.current != null) window.clearTimeout(hintShowRef.current);
      if (hintHideRef.current != null) window.clearTimeout(hintHideRef.current);
      hintShowRef.current = null;
      hintHideRef.current = null;
      return;
    }

    const showNextHint = () => {
      if (hintHideRef.current != null) window.clearTimeout(hintHideRef.current);
      setCurrentHint(pickRandom(BUG_HINTS));
      setHintVisible(true);
      hintHideRef.current = window.setTimeout(() => {
        setHintVisible(false);
        hintHideRef.current = null;
        const delay = 1800 + Math.random() * 2200;
        hintShowRef.current = window.setTimeout(showNextHint, delay);
      }, 1400);
    };

    const delay = 800 + Math.random() * 1200;
    hintShowRef.current = window.setTimeout(showNextHint, delay);

    return () => {
      if (hintShowRef.current != null) window.clearTimeout(hintShowRef.current);
      if (hintHideRef.current != null) window.clearTimeout(hintHideRef.current);
    };
  }, [running]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const res = await fetch("/api/scores");
        if (!res.ok) throw new Error("Failed to load scores");
        const data = (await res.json()) as Score[];
        setScores(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadScores();
  }, []);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(COUNTDOWN_SECONDS);
    setRunning(true);
    setHintVisible(false);
  };

  const handleBugSpotted = () => {
    if (running && hintVisible) {
      setScore((s) => s + 1);
    }
  };

  const handleSubmitScore = async () => {
    if (!name.trim() || score === 0) return;
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), score })
      });
      if (!res.ok) throw new Error("Failed to submit score");
      const updated = (await res.json()) as Score[];
      setScores(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mini-game">
      <div className="mini-game-header">
        <h2 className="panel-heading">60s Coding Reflex Test</h2>
        <p className="mini-game-sub">
          A bug hint will flash below. Click &quot;Bug Spotted&quot; only when you see it to score +1.
        </p>
      </div>

      <div className="bug-hint-zone">
        <span className="bug-hint-label">Bug hint:</span>
        <div className={`bug-hint-box ${hintVisible ? "bug-hint-visible" : ""}`}>
          {hintVisible ? currentHint : "—"}
        </div>
      </div>

      <div className="mini-game-grid">
        <div className="mini-game-main">
          <div className="mini-game-stats">
            <div>
              <span className="label">Time</span>
              <span className="value">{timeLeft}s</span>
            </div>
            <div>
              <span className="label">Score</span>
              <span className="value">{score}</span>
            </div>
          </div>

          <button
            className="primary-button"
            disabled={running}
            type="button"
            onClick={handleStart}
          >
            {running ? "Running..." : "Start Round"}
          </button>

          <button
            className="accent-button"
            type="button"
            onClick={handleBugSpotted}
          >
            Bug Spotted
          </button>
        </div>

        <div className="mini-game-sidebar">
          <div className="mini-game-input-row">
            <label className="label">Callsign</label>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            className="secondary-button"
            type="button"
            disabled={score === 0}
            onClick={handleSubmitScore}
          >
            Upload Score to Command Log
          </button>

          <div className="mini-game-scores">
            <h3 className="scores-heading">High Scores</h3>
            {scores.length === 0 ? (
              <p className="muted">No scores yet. Be the first commander.</p>
            ) : (
              <ul className="scores-list">
                {scores.map((s) => (
                  <li key={`${s.name}-${s.createdAt}`}>
                    <span>{s.name}</span>
                    <span>{s.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mini-game-tips">
        <p><strong>Tips</strong></p>
        <ul>
          <li>Watch the hint zone — a bug hint will appear for a short time.</li>
          <li>Click &quot;Bug Spotted&quot; only when a hint is visible to score +1.</li>
          <li>Wrong or early clicks don’t subtract points; focus and timing matter.</li>
        </ul>
      </div>
    </div>
  );
};
