import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center w-full mb-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Линия между шагами (фиксированная ширина) */}
            {index > 0 && (
              <div
                className={`w-16 h-0.5 transition-all duration-300 ${
                  isCompleted ? "bg-purple-400" : isActive ? "bg-purple-400" : "bg-gray-500"
                }`}
              />
            )}
            {/* Кружочек шага */}
            <div
              className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                isCompleted ? "bg-purple-400" : isActive ? "bg-purple-400 w-3 h-3 shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]" : "bg-gray-500"
              }`}
            >
              {/* Обводка вокруг активного кружочка */}
              {isActive && (
                <div
                  className="absolute inset-0 border-2 border-purple-400 rounded-full shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]"
                  style={{
                    top: "-5px",
                    left: "-5px",
                    right: "-5px",
                    bottom: "-5px",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;