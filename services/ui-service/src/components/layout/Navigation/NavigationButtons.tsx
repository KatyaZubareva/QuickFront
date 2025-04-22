import React from "react";
import { Button } from "../../core/Button/Button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isLastStep?: boolean;
  isNextDisabled?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  isLastStep = false,
  isNextDisabled = false,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button label="Назад" color="outline" onClick={onBack} />
      {!isLastStep && (
        <Button
          label="Далее"
          color="success"
          onClick={onNext}
          isDisabled={isNextDisabled}
        />
      )}
    </div>
  );
};

export default NavigationButtons;