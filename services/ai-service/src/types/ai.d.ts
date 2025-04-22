// src/types/ai.d.ts
interface AIRequest {
    inputs: string;
    context?: {
      currentStep?: number;
      framework?: string;
      features?: string[];
      template?: string;
    };
  }