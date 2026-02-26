import React, { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const QUIZ_QUESTIONS: Question[] = [
  // Full Stack
  {
    id: 1,
    question: "What does R3F stand for in the React 3D ecosystem?",
    options: ["React Three Fiber", "Real-Time Frame Buffer", "Rapid 3D Framework", "Render Three Frames"],
    correctIndex: 0
  },
  {
    id: 2,
    question: "Which HTTP method is typically used to create a new resource in REST?",
    options: ["GET", "PUT", "POST", "PATCH"],
    correctIndex: 2
  },
  {
    id: 3,
    question: "What is the default port for a development Vite server?",
    options: ["3000", "4173", "5173", "8080"],
    correctIndex: 2
  },
  {
    id: 4,
    question: "Which of these is a NoSQL database?",
    options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
    correctIndex: 2
  },
  {
    id: 5,
    question: "In React, which hook is used to perform side effects?",
    options: ["useState", "useEffect", "useMemo", "useCallback"],
    correctIndex: 1
  },
  {
    id: 6,
    question: "What does CORS stand for?",
    options: ["Cross-Origin Resource Sharing", "Centralized Origin Request Service", "Cache Origin Reset Strategy", "Client-Side Origin Redirect"],
    correctIndex: 0
  },
  {
    id: 7,
    question: "Which protocol is used for real-time bidirectional communication?",
    options: ["HTTP", "WebSockets", "FTP", "SMTP"],
    correctIndex: 1
  },
  {
    id: 8,
    question: "What is TypeScript a superset of?",
    options: ["Python", "JavaScript", "Java", "C#"],
    correctIndex: 1
  },
  {
    id: 9,
    question: "In a REST API, which status code typically means 'Resource created successfully'?",
    options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
    correctIndex: 1
  },
  {
    id: 10,
    question: "What does JWT stand for?",
    options: ["JavaScript Web Token", "JSON Web Token", "Java Web Transfer", "Joint Web Technology"],
    correctIndex: 1
  },
  {
    id: 11,
    question: "Which HTML tag is used for the main content that is unique to a page?",
    options: ["<div>", "<section>", "<main>", "<article>"],
    correctIndex: 2
  },
  {
    id: 12,
    question: "In Node.js, which module is built-in for handling file system operations?",
    options: ["file", "fs", "path", "io"],
    correctIndex: 1
  },
  {
    id: 13,
    question: "What is the purpose of environment variables in a full-stack app?",
    options: ["Store UI theme preferences", "Store secrets and config (e.g. API keys) without hardcoding", "Cache API responses", "Define CSS variables"],
    correctIndex: 1
  },
  {
    id: 14,
    question: "Which HTTP header is commonly used to send auth tokens from client to server?",
    options: ["Content-Type", "Authorization", "Accept", "Cache-Control"],
    correctIndex: 1
  },
  {
    id: 15,
    question: "What does SSR stand for in web development?",
    options: ["Secure Socket Relay", "Server-Side Rendering", "Static Site Regeneration", "Single Source of Record"],
    correctIndex: 1
  },
  // DSA
  {
    id: 16,
    question: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1
  },
  {
    id: 17,
    question: "Which data structure uses LIFO (Last In, First Out) order?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctIndex: 1
  },
  {
    id: 18,
    question: "In a binary tree, what is a 'leaf' node?",
    options: ["The root node", "A node with no children", "A node with two children", "The leftmost node"],
    correctIndex: 1
  },
  {
    id: 19,
    question: "Which sorting algorithm has O(n²) worst-case time complexity?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    correctIndex: 2
  },
  {
    id: 20,
    question: "What is the main advantage of a hash table for lookups?",
    options: ["Guaranteed sorted order", "Average O(1) lookup by key", "No collision handling needed", "Always O(log n) lookup"],
    correctIndex: 1
  },
  {
    id: 21,
    question: "In graph traversal, BFS uses which data structure?",
    options: ["Stack", "Queue", "Priority Queue", "Hash Set"],
    correctIndex: 1
  },
  {
    id: 22,
    question: "What is the time complexity of inserting at the end of a dynamic array (amortized)?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctIndex: 2
  },
  {
    id: 23,
    question: "Which algorithm is used to find the shortest path in a weighted graph with no negative edges?",
    options: ["BFS", "DFS", "Dijkstra's algorithm", "Bellman-Ford only"],
    correctIndex: 2
  },
  {
    id: 24,
    question: "A balanced BST (e.g. AVL or Red-Black tree) guarantees search in:",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2
  },
  {
    id: 25,
    question: "What does 'in-place' sorting mean?",
    options: ["Sorting without extra memory (O(1) extra space)", "Sorting only the first half", "Sorting in the same function", "Sorting using recursion"],
    correctIndex: 0
  },
  {
    id: 26,
    question: "In a linked list, what is the time complexity of finding an element by value (unsorted)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2
  },
  {
    id: 27,
    question: "Which data structure is typically used to implement a LRU (Least Recently Used) cache?",
    options: ["Array only", "Hash map + doubly linked list", "Stack", "Binary heap only"],
    correctIndex: 1
  },
  {
    id: 28,
    question: "Recursion is often replaced with an explicit ___ to avoid stack overflow.",
    options: ["Queue", "Stack", "Loop or stack", "Hash table"],
    correctIndex: 2
  },
  {
    id: 29,
    question: "What is the space complexity of merge sort (excluding the array itself)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2
  },
  {
    id: 30,
    question: "In a max-heap, the largest element is always at:",
    options: ["Any leaf", "The root", "The middle index", "The last index"],
    correctIndex: 1
  }
];

export const QuizPanel: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setFinished(false);
  };

  const handleOptionClick = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (!started) {
    return (
      <div className="quiz-panel quiz-panel-start">
        <h2 className="panel-heading">Tech Quiz</h2>
        <p className="mini-game-sub">
          {total} multiple-choice questions. Test your dev knowledge.
        </p>
        <div className="quiz-intro">
          <p><strong>Topics covered:</strong></p>
          <ul>
            <li><strong>Full Stack:</strong> REST APIs, React, TypeScript, Node.js, databases, auth (JWT, CORS), SSR, and web fundamentals.</li>
            <li><strong>DSA:</strong> Time & space complexity, arrays, linked lists, stacks, queues, trees, graphs, sorting, hashing, and common algorithms (e.g. binary search, Dijkstra).</li>
          </ul>
        </div>
        <button type="button" className="primary-button" onClick={handleStart}>
          Start Quiz
        </button>
        <div className="quiz-rules">
          <p><strong>Rules</strong></p>
          <ul>
            <li>One point per correct answer; no negative marking.</li>
            <li>Pick an option to lock in your answer, then tap Next to continue.</li>
            <li>Your final score and percentage are shown at the end.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="quiz-panel">
        <h2 className="panel-heading">Quiz Complete</h2>
        <div className="quiz-result">
          <span className="value">{score}</span>
          <span className="label"> / {total} correct</span>
        </div>
        <p className="quiz-percent">{pct}%</p>
        <button type="button" className="primary-button" onClick={handleStart}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <div className="quiz-progress">
        <span className="label">Question {currentIndex + 1} of {total}</span>
        <span className="value">Score: {score}</span>
      </div>
      <h3 className="quiz-question">{question.question}</h3>
      <ul className="quiz-options" role="list">
        {question.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className={`quiz-option ${selected === i ? "quiz-option-selected" : ""} ${
                answered
                  ? i === question.correctIndex
                    ? "quiz-option-correct"
                    : selected === i
                      ? "quiz-option-wrong"
                      : ""
                  : ""
              }`}
              onClick={() => handleOptionClick(i)}
              disabled={answered}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {answered && (
        <button type="button" className="primary-button" onClick={handleNext}>
          {currentIndex + 1 >= total ? "See Results" : "Next"}
        </button>
      )}
    </div>
  );
};
