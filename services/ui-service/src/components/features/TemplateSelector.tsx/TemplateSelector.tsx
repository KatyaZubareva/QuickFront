import React, { useState, useRef } from "react";
import { TEMPLATES } from "../../../data/templates.tsx";
import { ProjectTemplate } from "../../../types/template.tsx";
import { FiSave, FiArrowLeft, FiLayout, FiType, FiSquare, FiTrash2, FiSliders } from "react-icons/fi";

interface TemplateSelectorProps {
  selectedFramework: string | null;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
  templates: ProjectTemplate[];
}

interface TooltipState {
  visible: boolean;
  content: {
    name: string;
    description: string;
    features: string[];
  } | null;
  position: { x: number; y: number };
}

interface UIComponent {
  id: string;
  type: "header" | "footer" | "button";
  content: string;
  styles: React.CSSProperties;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedFramework,
  onSelectTemplate,
  selectedTemplate,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    position: { x: 0, y: 0 },
  });
  const [showUIConstructor, setShowUIConstructor] = useState(false);
  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activePanel, setActivePanel] = useState<"components" | "styles">("components");

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = TEMPLATES.filter((template: ProjectTemplate) =>
    selectedFramework
      ? template.frameworks.some((f: string) => f === selectedFramework)
      : true
  );

  const handleMouseEnter = (
    template: {
      name: string;
      description: string;
      features: string[];
    },
    e: React.MouseEvent
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        visible: true,
        content: {
          name: template.name,
          description: template.description,
          features: template.features,
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

  const handleAddComponent = (type: "header" | "footer" | "button") => {
    const newComponent: UIComponent = {
      id: `comp-${Date.now()}`,
      type,
      content: type === "button" ? "Нажми меня" : type === "header" ? "Добро пожаловать" : "© 2023 Мое приложение",
      styles: {
        padding: type === "button" ? "8px 16px" : "16px",
        backgroundColor: type === "button" ? "#7c3aed" : type === "header" ? "#1e293b" : "#0f172a",
        color: "white",
        borderRadius: type === "button" ? "6px" : "0",
        width: type === "button" ? "fit-content" : "100%",
        textAlign: "center",
        fontSize: type === "button" ? "14px" : type === "header" ? "18px" : "14px",
        fontWeight: type === "button" ? "500" : "600",
        cursor: "pointer",
        border: "none",
        boxShadow: type === "button" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.2s ease",
        ...(type === "button" ? { margin: "20px auto" } : {}),
        ...(type === "footer" ? { marginTop: "auto" } : {}),
      },
    };
    setUIComponents([...uiComponents, newComponent]);
  };

  const handleSaveUIConstructor = () => {
    const customTemplateId = `custom-ui-${Date.now()}`;
    onSelectTemplate(customTemplateId);
    setShowUIConstructor(false);
  };

  const handleDragStart = (e: React.DragEvent, type: "header" | "footer" | "button") => {
    e.dataTransfer.setData("componentType", type);
    setIsDragging(true);
    const target = e.currentTarget as HTMLElement;
    target.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("opacity-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType") as "header" | "footer" | "button";
    if (type) {
      handleAddComponent(type);
    }
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("bg-gray-100");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDragging) {
      const target = e.currentTarget as HTMLElement;
      target.classList.add("bg-gray-100");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("bg-gray-100");
  };

  const handleComponentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(id === selectedComponent ? null : id);
    setActivePanel("styles");
  };

  const handleComponentStyleChange = (id: string, property: string, value: string) => {
    setUIComponents(prevComponents => 
      prevComponents.map(comp => 
        comp.id === id ? { 
          ...comp, 
          styles: { ...comp.styles, [property]: value } 
        } : comp
      )
    );
  };

  const handleContentChange = (id: string, newContent: string) => {
    setUIComponents(prevComponents => 
      prevComponents.map(comp => 
        comp.id === id ? { ...comp, content: newContent } : comp
      )
    );
  };

  const openUIConstructor = () => {
    setUIComponents([]);
    setSelectedComponent(null);
    setActivePanel("components");
    setShowUIConstructor(true);
  };

  return (
    <div
      className="p-6 max-w-6xl mx-auto relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {showUIConstructor ? (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700">
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiLayout className="text-purple-400" /> UI Конструктор
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUIConstructor(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FiArrowLeft size={16} />
                  <span className="hidden sm:inline">Назад к шаблонам</span>
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className={`w-72 bg-gray-800/80 p-5 flex flex-col border-r border-gray-700 transition-all duration-300 ${activePanel === "components" ? "block" : "hidden"}`}>
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <FiSquare className="text-blue-400" /> Компоненты
                  </h3>
                  <div className="space-y-3">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "header")}
                      onDragEnd={handleDragEnd}
                      className="p-4 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 text-white hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center">
                        <FiType className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Шапка</h4>
                        <p className="text-xs text-gray-400">Верхняя навигация</p>
                      </div>
                    </div>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "footer")}
                      onDragEnd={handleDragEnd}
                      className="p-4 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 text-white hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center">
                        <FiType className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Подвал</h4>
                        <p className="text-xs text-gray-400">Нижний колонтитул</p>
                      </div>
                    </div>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "button")}
                      onDragEnd={handleDragEnd}
                      className="p-4 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 text-white hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center">
                        <FiSquare className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Кнопка</h4>
                        <p className="text-xs text-gray-400">Интерактивная кнопка</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Советы</h3>
                  <div className="text-xs text-gray-400 space-y-2">
                    <p>• Перетащите компоненты на холст</p>
                    <p>• Кликните на компонент для редактирования</p>
                    <p>• Используйте панель стилей справа</p>
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-auto transition-all duration-300 flex flex-col ${selectedComponent ? "w-2/3" : "w-full"}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => {
                  setSelectedComponent(null);
                  setActivePanel("components");
                }}
              >
                {uiComponents.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 animate-pulse">
                        <FiLayout size={40} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                        <FiSquare size={16} />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-center text-gray-700">Пустой холст</h3>
                    <p className="text-center max-w-md text-gray-500 mb-6">
                      Начните создавать интерфейс, перетаскивая компоненты с панели слева
                    </p>
                    <button
                      onClick={() => {
                        handleAddComponent("header");
                        handleAddComponent("button");
                        handleAddComponent("footer");
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <FiSquare /> Добавить пример компонентов
                    </button>
                  </div>
                ) : (
                  <div className="min-h-full flex flex-col">
                    {uiComponents.map((component) => (
                      <div
                        key={component.id}
                        onClick={(e) => handleComponentClick(component.id, e)}
                        style={component.styles}
                        className={`relative transition-all duration-200 ${
                          selectedComponent === component.id 
                            ? "ring-4 ring-purple-500/50 ring-offset-2 z-10" 
                            : "hover:ring-2 hover:ring-purple-400/30"
                        }`}
                      >
                        {component.content}
                        {selectedComponent === component.id && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUIComponents(uiComponents.filter(c => c.id !== component.id));
                                setSelectedComponent(null);
                              }}
                              className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                              title="Удалить"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedComponent && (
                <div className="w-96 bg-gray-800/80 p-6 border-l border-gray-700 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiSliders className="text-purple-400" /> Редактор стилей
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedComponent(null);
                        setActivePanel("components");
                      }}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <FiArrowLeft size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Контент</label>
                      <input
                        type="text"
                        value={uiComponents.find(c => c.id === selectedComponent)?.content || ""}
                        onChange={(e) => handleContentChange(selectedComponent, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Фон</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={uiComponents.find(c => c.id === selectedComponent)?.styles.backgroundColor || "#1e293b"}
                            onChange={(e) => handleComponentStyleChange(selectedComponent, "backgroundColor", e.target.value)}
                            className="w-12 h-12 cursor-pointer rounded-lg border-2 border-gray-600 hover:border-purple-400 transition-colors"
                          />
                          <input
                            type="text"
                            value={uiComponents.find(c => c.id === selectedComponent)?.styles.backgroundColor || ""}
                            onChange={(e) => handleComponentStyleChange(selectedComponent, "backgroundColor", e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Текст</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={uiComponents.find(c => c.id === selectedComponent)?.styles.color || "#ffffff"}
                            onChange={(e) => handleComponentStyleChange(selectedComponent, "color", e.target.value)}
                            className="w-12 h-12 cursor-pointer rounded-lg border-2 border-gray-600 hover:border-purple-400 transition-colors"
                          />
                          <input
                            type="text"
                            value={uiComponents.find(c => c.id === selectedComponent)?.styles.color || ""}
                            onChange={(e) => handleComponentStyleChange(selectedComponent, "color", e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Размер шрифта</label>
                      <div className="grid grid-cols-5 gap-2">
                        {["12px", "14px", "16px", "18px", "20px"].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleComponentStyleChange(selectedComponent, "fontSize", size)}
                            className={`py-2 rounded-md ${uiComponents.find(c => c.id === selectedComponent)?.styles.fontSize === size ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Отступы</label>
                      <input
                        type="text"
                        value={uiComponents.find(c => c.id === selectedComponent)?.styles.padding || "8px 16px"}
                        onChange={(e) => handleComponentStyleChange(selectedComponent, "padding", e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="например: 8px 16px"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Скругление углов</label>
                      <div className="grid grid-cols-5 gap-2">
                        {["0", "4px", "8px", "12px", "999px"].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => handleComponentStyleChange(selectedComponent, "borderRadius", radius)}
                            className={`py-2 rounded-md ${uiComponents.find(c => c.id === selectedComponent)?.styles.borderRadius === radius ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            style={{ borderRadius: radius }}
                          >
                            {radius === "999px" ? "Круглый" : radius}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {uiComponents.length} компонент{uiComponents.length !== 1 ? "ов" : ""}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUIConstructor(false)}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiArrowLeft /> Отмена
                </button>
                <button
                  onClick={handleSaveUIConstructor}
                  disabled={uiComponents.length === 0}
                  className={`px-6 py-2.5 text-white rounded-lg shadow-lg transition-all flex items-center gap-2 ${uiComponents.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"}`}
                >
                  <FiSave /> Сохранить шаблон
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedFramework
                ? `Шаблоны для ${selectedFramework}`
                : "Все шаблоны"}
            </h2>
            <p className="text-gray-400 mb-6">
              Выберите готовый шаблон или создайте свой собственный дизайн
            </p>
            
            <button
              onClick={openUIConstructor}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 mx-auto animate-pulse hover:animate-none"
            >
              <FiLayout className="text-lg" /> Открыть UI Редактор
            </button>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50">
              <p className="text-gray-400 mb-4 text-lg">
                Для выбранного фреймворка нет доступных шаблонов
              </p>
              <button
                onClick={openUIConstructor}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Создать шаблон
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template: ProjectTemplate) => {
                const isActive = selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        {
                          name: template.name,
                          description: template.description,
                          features: template.features,
                        },
                        e
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex flex-col items-center p-6 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "border-2 border-purple-500 bg-gradient-to-br from-purple-900/30 to-purple-500/10 shadow-lg scale-[1.02]"
                        : "border border-gray-700 bg-gray-800 hover:border-purple-400 hover:shadow-md hover:bg-gray-750"
                    }`}
                  >
                    <div className="mb-5 text-4xl text-purple-400 group-hover:text-purple-300 transition-colors">
                      {template.icon}
                    </div>
                    <h3
                      className={`text-lg font-medium mb-3 ${
                        isActive ? "text-purple-300" : "text-white group-hover:text-purple-200"
                      }`}
                    >
                      {template.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {template.frameworks.map((f: string) => (
                        <span
                          key={f}
                          className="text-xs px-2.5 py-1 bg-gray-700 rounded-full text-gray-300 group-hover:bg-gray-600 group-hover:text-white transition-colors"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {tooltip.visible && tooltip.content && (
        <div
          className="absolute z-50 w-72 p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl pointer-events-none backdrop-blur-sm"
          style={{
            left: `${tooltip.position.x}px`,
            top: `${tooltip.position.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-2 text-center">
            {tooltip.content.name}
          </h3>
          <p className="text-sm text-gray-300 mb-3 text-center">
            {tooltip.content.description}
          </p>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Включает в себя:</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            {tooltip.content.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-400 mr-2 mt-0.5">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;