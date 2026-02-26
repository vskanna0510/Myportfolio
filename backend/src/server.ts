import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import Redis from "ioredis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const REDIS_URL = process.env.REDIS_URL;

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

type Project = {
  id: string;
  name: string;
  role: string;
  techStack: string[];
  summary: string;
  link?: string;
  description?: string;
  imageUrl?: string;
};

const projects: Project[] = [
  {
    id: "r3f-command-center",
    name: "3D Command Center Portfolio",
    role: "Full-stack / 3D Frontend",
    techStack: ["React", "React Three Fiber", "TypeScript", "Express", "Redis"],
    summary:
      "This portfolio itself: an interactive starship bridge with project stations, quiz & reflex mini-games, and a Redis-backed score API.",
    description:
      "A 3D command-center experience built with React Three Fiber. Features an interactive network of project nodes, tech quiz, reflex mini-game, and contact form. Backend tracks project views and leaderboard scores.",
    link: "#",
    imageUrl: "https://placehold.co/420x240/0c0c18/00ffd0?text=3D+Portfolio&font=source-sans-pro"
  },
  {
    id: "realtime-collab",
    name: "Realtime Code Collaboration Pad",
    role: "Backend & DevOps",
    techStack: ["Node.js", "WebSockets", "PostgreSQL", "Docker"],
    summary:
      "A collaborative code editor supporting presence indicators, conflict-free syncing, and role-based access control.",
    description:
      "Multi-user code editor with live cursor positions, operational transforms for conflict-free sync, and Dockerized deployment. Includes presence indicators and role-based permissions.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/00d4aa?text=Realtime+Collab&font=source-sans-pro"
  },
  {
    id: "ml-analytics",
    name: "ML-Driven Placement Analytics",
    role: "Data Engineering & API",
    techStack: ["Python", "FastAPI", "Pandas", "React"],
    summary:
      "Analytics dashboard that visualizes placement trends and recommends skill focus areas using historical data.",
    description:
      "Dashboard that ingests placement data, runs trend analysis with Pandas, and exposes a FastAPI backend. React frontend with charts and skill recommendations based on historical patterns.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/43a2ff?text=ML+Analytics&font=source-sans-pro"
  },
  {
    id: "ecommerce-api",
    name: "E-Commerce REST API",
    role: "Backend Developer",
    techStack: ["Node.js", "Express", "MongoDB", "JWT", "Stripe"],
    summary:
      "RESTful API for an online store with cart, orders, payments via Stripe, and admin dashboard hooks.",
    description:
      "Full REST API for e-commerce: product catalog, cart, orders, JWT auth, and Stripe payment integration. Admin endpoints for inventory and order management.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/ff8a3d?text=E-Commerce+API&font=source-sans-pro"
  },
  {
    id: "task-dashboard",
    name: "Task & Sprint Dashboard",
    role: "Full-stack",
    techStack: ["React", "Redux", "Node.js", "PostgreSQL"],
    summary:
      "Agile-style task board with drag-and-drop, sprint planning, and burndown charts.",
    description:
      "Kanban-style board with drag-and-drop, sprint planning, and burndown visualizations. Redux state, Node API, and PostgreSQL for persistence.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/9f9ff5?text=Task+Dashboard&font=source-sans-pro"
  },
  {
    id: "chat-app",
    name: "Real-Time Chat Application",
    role: "Full-stack",
    techStack: ["Socket.io", "React", "Node.js", "Redis"],
    summary:
      "Multi-room chat with typing indicators, read receipts, and optional E2E encryption hooks.",
    description:
      "Real-time chat with multiple rooms, typing indicators, and read receipts. Socket.io for events, Redis for presence and optional message persistence.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/ff2e97?text=Chat+App&font=source-sans-pro"
  },
  {
    id: "weather-cli",
    name: "Weather CLI & API Client",
    role: "CLI / Tooling",
    techStack: ["Node.js", "TypeScript", "OpenWeather API"],
    summary:
      "Command-line weather tool with forecasts, alerts, and a minimal API wrapper for reuse.",
    description:
      "CLI tool for weather by location with forecasts and alerts. TypeScript-based, uses OpenWeather API, with a reusable API client module.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/8ef5df?text=Weather+CLI&font=source-sans-pro"
  },
  {
    id: "portfolio-cms",
    name: "Portfolio CMS Backend",
    role: "Backend",
    techStack: ["Express", "PostgreSQL", "Multer", "JWT"],
    summary:
      "Headless CMS for portfolio content: projects, skills, and media uploads with role-based edit access.",
    description:
      "Headless CMS with Express and PostgreSQL: manage projects, skills, and media. Multer for uploads, JWT for role-based admin access.",
    link: "https://github.com",
    imageUrl: "https://placehold.co/420x240/0c0c18/00ffd0?text=Portfolio+CMS&font=source-sans-pro"
  }
];

const projectViewCounts: Record<string, number> = {};

function getProjectsWithViews(): (Project & { viewCount: number })[] {
  return projects.map((p) => ({
    ...p,
    viewCount: projectViewCounts[p.id] ?? 0
  }));
}

app.get("/api/projects", (_req, res) => {
  res.json(getProjectsWithViews());
});

app.post("/api/projects/:id/view", (req, res) => {
  const { id } = req.params;
  if (!projects.some((p) => p.id === id)) {
    return res.status(404).json({ error: "Project not found" });
  }
  projectViewCounts[id] = (projectViewCounts[id] ?? 0) + 1;
  res.json({ id, viewCount: projectViewCounts[id]! });
});

type Score = {
  name: string;
  score: number;
  createdAt: string;
};

let inMemoryScores: Score[] = [];

const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      lazyConnect: true
    })
  : null;

const SCORES_KEY = "kanna:portfolio:scores";

const useRedis = async (): Promise<boolean> => {
  if (!redis) return false;
  try {
    if (!redis.status || redis.status === "end") {
      await redis.connect();
    }
    return true;
  } catch (err) {
    console.error("Redis unavailable, falling back to memory:", err);
    return false;
  }
};

const getScores = async (): Promise<Score[]> => {
  if (await useRedis()) {
    const raw = await redis!.zrevrange(SCORES_KEY, 0, 9, "WITHSCORES");
    const scores: Score[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      const [member, scoreStr] = [raw[i] as string, raw[i + 1] as string];
      const [name, createdAt] = member.split("::");
      scores.push({ name, createdAt, score: Number(scoreStr) });
    }
    return scores;
  }
  return inMemoryScores
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

const addScore = async (entry: Score): Promise<Score[]> => {
  if (await useRedis()) {
    const member = `${entry.name}::${entry.createdAt}`;
    await redis!.zadd(SCORES_KEY, entry.score, member);
    return getScores();
  }
  inMemoryScores.push(entry);
  return getScores();
};

app.get("/api/scores", async (_req, res) => {
  try {
    const scores = await getScores();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load scores" });
  }
});

app.post("/api/scores", async (req, res) => {
  const { name, score } = req.body as { name?: string; score?: number };
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const entry: Score = {
    name: name.slice(0, 32),
    score: Math.max(0, Math.floor(score)),
    createdAt: new Date().toISOString()
  };

  try {
    const scores = await addScore(entry);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to store score" });
  }
});

type ContactPayload = { name?: string; email?: string; subject?: string; message?: string };

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body as ContactPayload;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }
  // Optional: log or store submissions (e.g. in memory or Redis)
  console.log("[Contact]", { name: name.trim(), email: email.trim(), subject: subject?.trim() ?? "(no subject)", message: message.trim().slice(0, 200) });
  res.status(200).json({ success: true, message: "Thank you, your message has been sent." });
});

app.listen(PORT, () => {
  console.log(`Command Center backend online at http://localhost:${PORT}`);
});

