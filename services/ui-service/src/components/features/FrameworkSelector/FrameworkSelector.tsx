import React, { useState, useRef } from "react";
import { Button } from "../../core/Button/Button";
import { TEMPLATES } from "../../../data/templates";

interface Framework {
  versions: string[];
  description: string;
}

interface TooltipState {
  visible: boolean;
  content: {
    name: string;
    description: string;
  } | null;
  position: { x: number; y: number };
}

interface FrameworkSelectorProps {
  selectedFramework: string | null;
  setSelectedFramework: React.Dispatch<React.SetStateAction<string | null>>;
  selectedVersion: string | null;
  setSelectedVersion: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
}

const frameworks: Record<string, Framework> = {
  React: {
    versions: ["18.0.0", "17.0.0"],
    description: "Библиотека для создания пользовательских интерфейсов с компонентным подходом.",
  },
  Vue: {
    versions: ["3.2.0", "2.6.0"],
    description: "Прогрессивный фреймворк для создания интерфейсов с реактивным data-binding.",
  },
  Svelte: {
    versions: ["3.50.0"],
    description: "Компилируемый фреймворк, который переносит работу в этап сборки.",
  },
  Angular: {
    versions: ["16.0.0", "15.2.0"],
    description: "Полноценный фреймворк для корпоративных приложений с TypeScript.",
  },
  "Next.js": {
    versions: ["13.4.0", "12.3.0"],
    description: "React-фреймворк для серверного рендеринга и статических сайтов.",
  },
  "Nuxt.js": {
    versions: ["3.1.0", "2.15.8"],
    description: "Vue-фреймворк для создания универсальных приложений.",
  },
};

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  selectedFramework,
  setSelectedFramework,
  selectedVersion,
  setSelectedVersion,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    position: { x: 0, y: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (framework: string, e: React.MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setTooltip({
      visible: true,
      content: {
        name: framework,
        description: frameworks[framework].description,
      },
      position: {
        x: e.clientX - containerRect.left + 20,
        y: e.clientY - containerRect.top,
      },
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tooltip.visible) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setTooltip((prev) => ({
      ...prev,
      position: {
        x: e.clientX - containerRect.left + 20,
        y: e.clientY - containerRect.top,
      },
    }));
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const hasTemplates = (framework: string) => {
    return TEMPLATES.some((t) => t.frameworks.includes(framework));
  };

  const handleFrameworkSelect = (framework: string) => {
    try {
      setIsLoading(true);
      setSelectedFramework(framework);
      setSelectedVersion(frameworks[framework].versions[0]);
      setError(null);
    } catch (_err) {
      setError("Failed to select framework");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="p-6 max-w-4xl mx-auto relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Выберите фреймворк</h2>
        <p className="text-sm text-gray-500 mb-6">
          Здесь вы можете выбрать технологию, которую хотите использовать для своего проекта, а также
          указать её версию.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {Object.keys(frameworks).map((framework) => (
          <div
            key={framework}
            className="relative"
            onMouseEnter={(e) => handleMouseEnter(framework, e)}
            onMouseLeave={handleMouseLeave}
          >
            <Button
              label={framework}
              onClick={() => handleFrameworkSelect(framework)}
              color="purple"
              isActive={selectedFramework === framework}
              isDisabled={!hasTemplates(framework) || isLoading}
              hint={!hasTemplates(framework) ? "Нет доступных шаблонов" : undefined}
              ariaLabel={`Выбрать ${framework}`}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {selectedFramework && (
        <div className="flex gap-4 mb-6 flex-wrap">
          {frameworks[selectedFramework].versions.map((version) => (
            <Button
              key={version}
              label={version}
              onClick={() => setSelectedVersion(version)}
              color="purpleDark"
              isActive={selectedVersion === version}
              ariaLabel={`Выбрать версию ${version}`}
            />
          ))}
        </div>
      )}

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

export default FrameworkSelector;