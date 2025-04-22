import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepProgress from "../../components/core/Progress/StepProgress";
import ProjectDetailsStep from "../../components/features/ProjectDetailsStep/ProjectDetailsStep";
import FrameworkSelector from "../../components/features/FrameworkSelector/FrameworkSelector";
import SettingsSelector from "../../components/features/SettingsSelector/SettingsSelector";
import ConfigSelector from "../../components/features/ConfigSelector/ConfigSelector";
import DownloadStep from "../../components/features/DownloadStep/DownloadStep";
import NavigationButtons from "../../components/layout/Navigation/NavigationButtons";
import TemplateSelector from "../../components/features/TemplateSelector.tsx/TemplateSelector";
import { TEMPLATES } from "../../data/templates.tsx";
import { AIAssistant } from "../../components/ai/AIAssistant";

const TOTAL_STEPS = 6;

const ProjectSetup = () => {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ projectName?: string; projectDescription?: string }>({});
  const [frameworkError, setFrameworkError] = useState<string | null>(null); // New state for framework error
  const [showAssistant, setShowAssistant] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const validateCurrentStep = () => {
    if (step === 1) {
      const newErrors: { projectName?: string; projectDescription?: string } = {};

      if (!projectName.trim()) {
        newErrors.projectName = "Название проекта обязательно";
      } else if (projectName.trim().length < 3) {
        newErrors.projectName = "Название проекта должно содержать не менее 3 символов";
      }

      if (!projectDescription.trim()) {
        newErrors.projectDescription = "Требуется описание проекта";
      } else if (projectDescription.trim().length < 10) {
        newErrors.projectDescription = "Описание должно быть не менее 10 символов";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (step === 2) {
      if (!selectedFramework) {
        setFrameworkError("Пожалуйста, выберите фреймворк перед продолжением.");
        return false;
      }
      setFrameworkError(null); // Clear the error if a framework is selected
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleFrameworkChange: React.Dispatch<React.SetStateAction<string | null>> = (framework) => {
    setSelectedFramework(framework);
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (templateCode: string | null) => {
    setSelectedTemplate(templateCode);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSuggestion = (suggestion: string) => {
    setUnreadMessages(0);
    console.log("AI ответ:", suggestion);
  };

  const handleNewMessage = () => {
    if (!showAssistant) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  const toggleAssistant = () => {
    setShowAssistant((prev) => {
      if (!prev) setUnreadMessages(0);
      return !prev;
    });
  };

  const filteredTemplates = selectedFramework
    ? TEMPLATES.filter((t) => t.frameworks.includes(selectedFramework))
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* AI Assistant Floating Button */}
      <motion.button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all hover:shadow-2xl hover:scale-105 focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {unreadMessages > 0 && (
            <motion.span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {unreadMessages}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            className="fixed bottom-28 right-6 z-40 w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <AIAssistant
              onSuggestion={handleSuggestion}
              onNewMessage={handleNewMessage}
              currentStep={step}
              selectedFramework={selectedFramework}
              selectedFeatures={selectedFeatures}
              selectedTemplate={selectedTemplate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-4">
        <StepProgress currentStep={step - 1} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main content container */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-xl p-8 min-h-[500px] flex flex-col justify-between border border-white/20 dark:border-gray-700/50">
        <div className="flex-grow">
          {step === 1 && (
            <ProjectDetailsStep
              projectName={projectName}
              setProjectName={setProjectName}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              errors={errors}
              clearErrors={clearErrors}
            />
          )}
          {step === 2 && (
            <>
              {frameworkError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {frameworkError}
                </div>
              )}
              <FrameworkSelector
                onNext={handleNextStep}
                selectedFramework={selectedFramework}
                setSelectedFramework={handleFrameworkChange}
                selectedVersion={selectedVersion}
                setSelectedVersion={setSelectedVersion}
              />
            </>
          )}
          {step === 3 && (
            <TemplateSelector
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              onSelectTemplate={handleSelectTemplate}
              selectedTemplate={selectedTemplate}
              selectedFramework={selectedFramework}
              templates={filteredTemplates}
            />
          )}
          {step === 4 && (
            <ConfigSelector
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />
          )}
          {step === 5 && (
            <SettingsSelector
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />
          )}
          {step === 6 && (
            <DownloadStep
              onBack={handlePreviousStep}
              selectedFramework={selectedFramework}
              selectedVersion={selectedVersion}
              selectedFeatures={selectedFeatures}
              selectedTemplate={selectedTemplate}
              projectName={projectName}
              projectDescription={projectDescription}
            />
          )}
        </div>

        <div className="mt-4">
          {step <= TOTAL_STEPS && (
            <NavigationButtons
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              isLastStep={step === TOTAL_STEPS}
              isNextDisabled={
                (step === 1 && Object.keys(errors).length > 0) || // Validation errors in Step 1
                (step === 2 && !selectedFramework) // No framework selected in Step 2
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;