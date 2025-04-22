import React from "react";
interface ConfigSelectorProps {
    selectedFeatures: string[];
    setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
    onNext?: () => void;
    onBack?: () => void;
}
declare const ConfigSelector: React.FC<ConfigSelectorProps>;
export default ConfigSelector;
