import React, { useState, useRef } from "react";
import { Button } from "../../core/Button/Button";

interface ConfigSelectorProps {
  selectedFeatures: string[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  onNext?: () => void;
  onBack?: () => void;
}

interface Feature {
  name: string;
  description: string;
}

interface TooltipState {
  visible: boolean;
  content: Feature | null;
  position: { x: number; y: number };
}

const projectConfigFeatures: Feature[] = [
  { name: "TypeScript", description: "Добавляет TypeScript для статической типизации кода." },
  { name: "ESLint", description: "Настраивает линтинг кода для поддержания стиля и качества." },
  { name: "Prettier", description: "Добавляет автоматическое форматирование кода." },
  { name: "Husky", description: "Настраивает git-хуки для автоматического запуска задач." },
  { name: "Lint-Staged", description: "Запускает линтинг только на staged файлах в git." },
  { name: "Jest", description: "Добавляет фреймворк для unit-тестирования." },
  { name: "Cypress", description: "Добавляет инструмент для end-to-end тестирования." },
  { name: "Storybook", description: "Настраивает среду для разработки UI компонентов." },
];

const ConfigSelector: React.FC<ConfigSelectorProps> = ({
  selectedFeatures,
  setSelectedFeatures,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    position: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (
    feature: Feature,
    e: React.MouseEvent
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        visible: true,
        content: feature,
        position: {
          x: e.clientX - containerRect.left + 20,
          y: e.clientY - containerRect.top,
        },
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (tooltip.visible && containerRect) {
      setTooltip((prev) => ({
        ...prev,
        position: {
          x: e.clientX - containerRect.left + 20,
          y: e.clientY - containerRect.top,
        },
      }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <div
      className="p-6 max-w-4xl mx-auto relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Конфигурация проекта</h2>
        <p className="text-sm text-gray-500 mb-6">
          Здесь вы можете выбрать технологии, которые хотите использовать в своём проекте.
        </p>
      </div>

      {/* Updated responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {projectConfigFeatures.map((feature) => (
          <div
            key={feature.name}
            className="relative"
            onMouseEnter={(e) => handleMouseEnter(feature, e)}
            onMouseLeave={handleMouseLeave}
          >
            <Button
              label={feature.name}
              onClick={() => toggleFeature(feature.name)}
              color="purple"
              isActive={selectedFeatures.includes(feature.name)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {tooltip.visible && tooltip.content && (
        <div
          className="absolute z-50 w-64 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl pointer-events-none"
          style={{
            left: `${tooltip.position.x}px`,
            top: `${tooltip.position.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-1 text-center">
            {tooltip.content.name}
          </h3>
          <p className="text-sm text-gray-300 text-center">
            {tooltip.content.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfigSelector;