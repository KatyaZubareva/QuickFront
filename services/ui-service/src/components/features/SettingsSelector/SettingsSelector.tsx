import React, { useState, useRef } from "react";
import { Button } from "../../core/Button/Button";

interface SettingsSelectorProps {
  selectedFeatures: string[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

const frontendFeatures = [
  { name: "Dark Mode", description: "Темный режим интерфейса." },
  { name: "Live Preview", description: "Просмотр изменений в реальном времени." },
  { name: "Drag & Drop", description: "Перетаскивание элементов для упрощения работы." },
  { name: "PWA", description: "Progressive Web App: позволяет установить приложение на устройство." },
  { name: "SSR", description: "Server-Side Rendering: рендеринг на сервере для улучшения SEO." },
  { name: "i18n", description: "Международализация: поддержка разных языков." },
  { name: "Lazy Loading", description: "Загрузка контента по мере необходимости, для ускорения загрузки." },
  { name: "State Management", description: "Управление состоянием приложения (например, Redux)." },
];

interface TooltipState {
  visible: boolean;
  content: {
    name: string;
    description: string;
  } | null;
  position: { x: number; y: number };
}

const SettingsSelector: React.FC<SettingsSelectorProps> = ({
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
    feature: {
      name: string;
      description: string;
    },
    e: React.MouseEvent
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        visible: true,
        content: {
          name: feature.name,
          description: feature.description,
        },
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
      {/* Only this section changed - added text-center wrapper */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Настройки проекта
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Здесь вы можете выбрать дополнительные функции и настройки для вашего проекта.
        </p>
      </div>

      {/* Updated responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {frontendFeatures.map((feature) => (
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

      {/* Original unchanged tooltip */}
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

export default SettingsSelector;