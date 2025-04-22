// src/services/recommender.ts
interface ProjectContext {
  currentStep: number;
  framework?: string;
  features?: string[];
  template?: string;
}

export function buildTechnicalPrompt(userInput: string, context: ProjectContext): string {
  return `
  As a senior web architect, analyze this request considering:

  Project Context:
  - Current step: ${context.currentStep}/6
  ${context.framework ? `- Framework: ${context.framework}` : ''}
  ${context.features?.length ? `- Features: ${context.features.join(', ')}` : ''}

  User Query:
  "${userInput}"

  Response Guidelines:
  1. Recommend general software development tools and best practices
  2. Compare options when unclear
  3. Include version considerations
  4. Mention testing strategies
  5. Highlight optimizations
  6. Note common pitfalls

  Format using Markdown with clear sections.
  `;
  }
  