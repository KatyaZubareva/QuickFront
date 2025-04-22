interface DownloadStepProps {
    selectedFramework: string | null;
    selectedVersion: string | null;
    selectedFeatures: string[];
    selectedTemplate: string | null;
    projectName: string;
    projectDescription: string;
    onBack?: () => void;
}
declare const DownloadStep: React.FC<DownloadStepProps>;
export default DownloadStep;
