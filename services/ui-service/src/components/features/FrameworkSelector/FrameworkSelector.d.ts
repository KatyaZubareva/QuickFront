import React from "react";
interface FrameworkSelectorProps {
    selectedFramework: string | null;
    setSelectedFramework: React.Dispatch<React.SetStateAction<string | null>>;
    selectedVersion: string | null;
    setSelectedVersion: React.Dispatch<React.SetStateAction<string | null>>;
    onNext: () => void;
}
declare const FrameworkSelector: React.FC<FrameworkSelectorProps>;
export default FrameworkSelector;
