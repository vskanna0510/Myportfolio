import React, { useEffect, useRef, useState } from "react";

type Score = {
  name: string;
  score: number;
  createdAt: string;
};

const COUNTDOWN_SECONDS = 60;

type BugHint = { short: string; explanation: string };

const BUG_HINTS: BugHint[] = [
  {
    short: "undefined",
    explanation: "A variable or property was used before it had a value, or doesn't exist on the object."
  },
  {
    short: "null reference",
    explanation: "Code tried to use something that is null (e.g. calling a method on null)."
  },
  {
    short: "off-by-one",
    explanation: "A loop or index is wrong by one — e.g. one too many or one too few iterations."
  },
  {
    short: "== vs ===",
    explanation: "== converts types before comparing; === checks value and type. Prefer === to avoid surprises."
  },
  {
    short: "missing dependency",
    explanation: "A hook (e.g. useEffect) uses a value that should be listed in its dependency array."
  },
  {
    short: "memory leak",
    explanation: "Something (e.g. a subscription or timer) wasn't cleaned up when the component unmounted."
  },
  {
    short: "race condition",
    explanation: "Two or more async operations finish in an unexpected order, causing wrong results."
  },
  {
    short: "arr[i+1]",
    explanation: "Accessing the next element can go out of bounds when i is the last index."
  },
  {
    short: "useEffect deps",
    explanation: "useEffect runs when dependencies change; missing or wrong deps cause stale or extra runs."
  },
  {
    short: "wrong key prop",
    explanation: "List items need a stable, unique key so React can track them correctly."
  },
  {
    short: "stale closure",
    explanation: "A function is using an old value of a variable instead of the current one."
  },
  {
    short: "CORS error",
    explanation: "The browser blocked a request to another domain because the server didn't allow it."
  },
  {
    short: "404 Not Found",
    explanation: "The URL or resource doesn't exist — wrong path, typo, or missing route."
  },
  {
    short: "infinite loop",
    explanation: "A loop or recursion never stops because the exit condition is never met."
  },
  {
    short: "type coercion",
    explanation: "JavaScript converted a value to another type (e.g. string to number) in an unexpected way."
  },
  {
    short: "async without await",
    explanation: "An async function was called but the result wasn't awaited, so you get a Promise instead of the value."
  }
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const MiniGamePanel: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [name, setName] = useState("Kanna");
  const [hintVisible, setHintVisible] = useState(false);
  const [currentHint, setCurrentHint] = useState<BugHint | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "early" | null>(null);
  const timerRef = useRef<number | null>(null);
  const hintShowRef = useRef<number | null>(null);
  const hintHideRef = useRef<number | null>(null);
  const feedbackRef = useRef<number | null>(null);

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
      setCurrentHint(null);
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
        setCurrentHint(null);
        hintHideRef.current = null;
        const delay = 1800 + Math.random() * 2200;
        hintShowRef.current = window.setTimeout(showNextHint, delay);
      }, 2200);
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
    setCombo(0);
    setFeedback(null);
    setTimeLeft(COUNTDOWN_SECONDS);
    setRunning(true);
    setHintVisible(false);
    setCurrentHint(null);
  };

  const clearFeedback = () => {
    if (feedbackRef.current != null) window.clearTimeout(feedbackRef.current);
    setFeedback(null);
    feedbackRef.current = null;
  };

  const handleBugSpotted = () => {
    if (!running) return;
    if (feedbackRef.current != null) {
      window.clearTimeout(feedbackRef.current);
      feedbackRef.current = null;
    }
    if (hintVisible) {
      setScore((s) => s + 1);
      setCombo((c) => c + 1);
      setFeedback("correct");
    } else {
      setCombo(0);
      setFeedback("early");
    }
    feedbackRef.current = window.setTimeout(clearFeedback, 1600);
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
          A &quot;bug hint&quot; will appear in the box below with a short explanation. Click &quot;Bug Spotted&quot; only when you see it to score +1.
        </p>
      </div>

      <div className="bug-hint-zone">
        <span className="bug-hint-label">Bug hint (watch this box):</span>
        <div className={`bug-hint-box ${hintVisible ? "bug-hint-visible" : ""}`}>
          {hintVisible && currentHint ? (
            <div className="bug-hint-content">
              <span className="bug-hint-short">{currentHint.short}</span>
              <span className="bug-hint-explanation">{currentHint.explanation}</span>
            </div>
          ) : (
            <span className="bug-hint-empty">—</span>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`reflex-feedback reflex-feedback-${feedback}`} role="status">
          {feedback === "correct" && (
            <>
              <span className="reflex-feedback-icon">✓</span>
              <span>+1 Correct!</span>
              {combo >= 2 && <span className="reflex-combo">{combo}× combo</span>}
            </>
          )}
          {feedback === "early" && (
            <>
              <span className="reflex-feedback-icon reflex-feedback-icon-early">!</span>
              <span>Wait for the hint to appear, then click.</span>
            </>
          )}
        </div>
      )}

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
            {combo >= 2 && (
              <div className="mini-game-combo">
                <span className="label">Combo</span>
                <span className="value value-combo">{combo}×</span>
              </div>
            )}
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
            className={`accent-button reflex-bug-button ${feedback === "correct" ? "reflex-bug-correct" : ""} ${feedback === "early" ? "reflex-bug-early" : ""}`}
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
        <p><strong>How to play (beginner-friendly)</strong></p>
        <ul>
          <li><strong>Watch the hint box</strong> — a bug type (e.g. &quot;undefined&quot;) and a short explanation will appear for about 2 seconds.</li>
          <li><strong>Click &quot;Bug Spotted&quot;</strong> only when the hint is visible. You get +1 point per correct click.</li>
          <li>If you click too early, you will see &quot;Wait for the hint&quot; — no points lost, try again on the next hint.</li>
          <li>Chain correct clicks for a <strong>combo</strong> — stay focused and spot as many as you can in 60 seconds!</li>
        </ul>
      </div>
    </div>
  );
};
