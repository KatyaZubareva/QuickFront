// services/ui-service/src/components/ai/ai.api.d.ts
interface AIRecommendationResponse {
    suggestion: string;
    details?: {
        model: string;
        tokens?: number;
    };
}

export declare const AI_API: {
    getRecommendation(
        message: string, 
        context: {
            currentStep?: number;
            framework?: string | null;
            features?: string[];
            template?: string | null;
        }
    ): Promise<AIRecommendationResponse>;
};