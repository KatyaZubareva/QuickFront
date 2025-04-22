//types/index.ts
export interface ProjectConfig {
    projectName: string;
    projectDescription: string;
    framework: string;
    version?: string;
    features?: string[];
    template?: string;
  }
  
  export type FileContentMap = Record<string, string>;