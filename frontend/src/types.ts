export type Project = {
  id: string;
  name: string;
  role: string;
  techStack: string[];
  summary: string;
  link?: string;
  viewCount?: number;
  description?: string;
  imageUrl?: string;
};

export type Score = {
  name: string;
  score: number;
  createdAt: string;
};
