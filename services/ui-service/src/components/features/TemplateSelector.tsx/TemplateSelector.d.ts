import React from "react";
import { ProjectTemplate } from "../../../types/template.tsx";
interface TemplateSelectorProps {
    selectedFramework: string | null;
    onSelectTemplate: (templateId: string) => void;
    selectedTemplate: string | null;
    templates: ProjectTemplate[];
    onBack: () => void;
    onNext: () => void;
}
declare const TemplateSelector: React.FC<TemplateSelectorProps>;
export default TemplateSelector;
