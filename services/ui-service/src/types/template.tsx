// template.tsx

import React from "react";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  frameworks: string[];
  techStack?: string[];
  icon: React.ReactNode;
  features: string[];
  previewFeatures?: string[];
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  files: Record<string, string>;
  dependencies?: Record<string, string>;
}