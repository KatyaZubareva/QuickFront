import React from "react";
interface NavigationButtonsProps {
    onBack: () => void;
    onNext: () => void;
    isLastStep?: boolean;
    isNextDisabled?: boolean;
}
declare const NavigationButtons: React.FC<NavigationButtonsProps>;
export default NavigationButtons;
