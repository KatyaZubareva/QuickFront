import React from "react";
interface SettingsSelectorProps {
    selectedFeatures: string[];
    setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
    onNext: () => void;
    onBack: () => void;
}
declare const SettingsSelector: React.FC<SettingsSelectorProps>;
export default SettingsSelector;
