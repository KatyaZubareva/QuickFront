// services/ui-service/src/components/ai/ai.api.ts
import axios from "axios";

interface AIRecommendationResponse {
  suggestion: string;
  details?: {
    model: string;
    tokens?: number;
  };
}

export const AI_API = {
  async getRecommendation(
    message: string,
    context: {
      currentStep?: number;
      framework?: string | null;
      features?: string[];
      template?: string | null;
    }
  ): Promise<AIRecommendationResponse> {
    try {
      const response = await axios.post("/api/ai/query", {
        inputs: message,
        context
      });

      return {
        suggestion: response.data.suggestion,
        details: response.data.details
      };
    } catch (error) {
      console.error("AI API Error:", error);
      throw new Error("Failed to get AI recommendation");
    }
  }
};