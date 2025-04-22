// services/ui-service/src/components/ai/AIAssistant.d.ts

import React from "react";
interface AIAssistantProps {
    onSuggestion: (suggestion: string) => void;
    onNewMessage?: () => void;
    currentStep?: number;
    selectedFramework?: string | null;
    selectedFeatures?: string[];
    selectedTemplate?: string | null;
    className?: string;
}
export declare const AIAssistant: React.FC<AIAssistantProps>;
export {};
