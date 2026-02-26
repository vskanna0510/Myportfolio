import type { Project, Score } from "./types";

const API = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to post to ${path}`);
  return res.json() as Promise<T>;
}

export const fetchProjects = () => get<Project[]>(`/projects`);
export const fetchScores = () => get<Score[]>(`/scores`);
export const submitScore = (name: string, score: number) =>
  post<Score[]>(`/scores`, { name, score });
export const recordProjectView = (projectId: string) =>
  post<{ id: string; viewCount: number }>(`/projects/${projectId}/view`, {});

export type ContactFormData = { name: string; email: string; subject: string; message: string };

export const submitContact = (data: ContactFormData) =>
  post<{ success: boolean; message: string }>(`/contact`, data);
