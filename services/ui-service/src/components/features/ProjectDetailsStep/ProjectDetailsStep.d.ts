import React from "react";
interface ProjectDetailsStepProps {
    projectName: string;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    projectDescription: string;
    setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
    errors: {
        projectName?: string;
        projectDescription?: string;
    };
    clearErrors: () => void;
}
declare const ProjectDetailsStep: React.FC<ProjectDetailsStepProps>;
export default ProjectDetailsStep;
